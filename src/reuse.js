import React, {
  createContext,
  useRef,
  useState,
  useContext,
  useEffect
} from "react";

// TBD: export const useReuse = unit => {

// }

export const reuse = (unit) => {
  if (!currentStore) {
    throw new Error('Must provide a store first');
  }

  // TBD unit dependencies
  // if (currentUnitKey) {
  //   currentStore.getUnit(currentUnitKey).addDependency(unit);
  // }

  // TBD cache the value
  // if (!unit.cachedValue) {
    // save cursor
    const prevUnitKey = currentUnitKey;
    const prevHookIndex = currentHookIndex;

    // reset cursor
    currentUnitKey = unit;
    currentHookIndex = 0;

    // call
    // unit.cachedValue = unit();
    const result = unit();

    // restore cursor
    currentUnitKey = prevUnitKey;
    currentHookIndex = prevHookIndex;

  // }

  return result;
  // return unit.cachedValue;
}

const defaultReducer = (state, value) => {
  if (typeof value === "function") {
    return value(state);
  } else {
    return value;
  }
};

let currentStore;
let currentUnitKey = null;
let currentHookIndex = 0;

export const createStore = () => {
  const store = {
    unitContexts: new Map(),
    getUnit: (unit) => {
      // Lazily define hooks for this unit
      if (!store.unitContexts.has(unit)) {
        const unitContext = {
          unit,
          hooks: [],
          subscribers: [],
          subscribe: (callback) => {
            unitContext.subscribers.push(callback);
            return () => unitContext.subscribers = unitContext.subscribers.filter(sub => sub !== callback)
          },
          forceUpdate: () => {
            unitContext.subscribers.forEach(sub => {
              const newValue = reuse(unitContext.unit);
              // TBD - check if different than previous cachedValue
              sub(newValue);
            });
          }
        }
        store.unitContexts.set(unit, unitContext);
      }
      return store.unitContexts.get(unit);
    },
    subscribe: (unit, callback) => {
      return store.getUnit(unit).subscribe(callback);
    }
  };
  return store;
};

export const setCurrentStore = store => currentStore = store;


// TBD: reuseEffect
// TBD: reuseMemo

export const reuseState = (initialState) => {
  return reuseReducer(initialState, defaultReducer)
}

export const reuseReducer = (initialState, reducer) => {
  if (!currentUnitKey) {
    throw new Error(`reuse hooks cannot be called outside of a reusable unit,
e.g. const reuseCount = reuse(() => {
  return reuseState(0);
})')`);
  }

  if (!currentStore) {
    throw new Error('Must provide a store first');    
  }

  const unitContext = currentStore.getUnit(currentUnitKey);

  // If hook doesn't exist for this index, create it
  if (unitContext.hooks.length <= currentHookIndex) {
    const curIndex = currentHookIndex; // For closure
    const setState = (action) => {
      const prevState = unitContext.hooks[curIndex][0];
      const newState = reducer(prevState, action);

      unitContext.hooks[curIndex][0] = newState;
      unitContext.forceUpdate();
    }
    unitContext.hooks[currentHookIndex] = [initialState, setState];
  }
  // Get current hook
  let hook = unitContext.hooks[currentHookIndex];
  currentHookIndex++;

  return hook;
}



// react-reuse
const ReuseContext = createContext();

export const ReuseProvider = ({ store = null, children }) => {
  const storeRef = useRef(store);

  if (!storeRef.current) {
    storeRef.current = createStore();
  }

  return (
    <ReuseContext.Provider value={storeRef.current}>
      {children}
    </ReuseContext.Provider>
  );
};

export const useReuse = (unit) => {
  const store = useContext(ReuseContext);
  setCurrentStore(store);
  const [state, setState] = useState(() => reuse(unit));

  useEffect(() => {
    return store.subscribe(unit, () => {
      const newState = reuse(unit);
      if (newState !== state) {
        setState(newState);
      }
    });
  }, [state]);

  return state;
}

const shallowCompare = (obj1, obj2) => {
  const keys = [...Object.keys(obj1), ...Object.keys(obj2)];

  for (let key of keys) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

// HOC
export const withReuse = (mapStateToProps, units) => (Comp) => {
  class WrappedComponent extends React.Component {
    state = {
      mappedProps: {}
    }
    componentDidMount() {
      const store = this.context;
      setCurrentStore(store);
      this.unsubscribes = units.map(unit => store.subscribe(unit, () => {
        this.updateStateToProps();
      }));
      this.updateStateToProps();
    }
    componentWillUnmount() {
      this.unsubscribes.forEach(unsubscribe => unsubscribe());
    }
    updateStateToProps() {
      const newStates = units.map(unit => reuse(unit));
      const newProps = mapStateToProps(newStates);
      const oldProps = this.state.mappedProps;

      if (!shallowCompare(oldProps, newProps)) {
        this.setState({ mappedProps: newProps });
      }
    }
    render() { 
      const {forwardedRef, ...ownProps} = this.props;
      const {mappedProps} = this.state;

      return <Comp ref={forwardedRef} {...ownProps} {...mappedProps}/>;
    }
  }
  WrappedComponent.contextType = ReuseContext;
  function forwardRef(props, ref) {
    return <WrappedComponent {...props} forwardedRef={ref} />;
  }
  const name = Comp.displayName || Comp.name;
  forwardRef.displayName = `withReuse(${name})`;

  return React.forwardRef(forwardRef);
}

export class Reuse extends React.Component {
  state = {
    result: undefined
  };
  componentDidMount() {
    const store = this.context;
    setCurrentStore(store);
    this.unsubscribe = store.subscribe(this.props.unit, () => {
      this.updateState();
    })
    this.updateState();
  }
  updateState() {
    this.setState({
      result: reuse(this.props.unit)
    })
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const {children} = this.props;
    const {result} = this.state;

    return result ? children(result) : null;
  }
}
Reuse.contextType = ReuseContext;
