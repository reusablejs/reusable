import React, {
  createContext,
  useRef,
  useState,
  useContext,
  useEffect
} from "react";

export const reuse = (unit) => {
  if (!currentStore) {
    throw new Error('Must provide a store first');
  }

  if (currentUnitKey) {
    currentStore.getUnit(currentUnitKey).addDependency(unit);
  }

  const unitContext = currentStore.getUnit(unit);

  if (!unitContext.cachedValue) {
    // save cursor
    const prevUnitKey = currentUnitKey;
    const prevHookIndex = currentHookIndex;

    // reset cursor
    currentUnitKey = unit;
    currentHookIndex = 0;

    // call
    unitContext.cachedValue = unit();

    // restore cursor
    currentUnitKey = prevUnitKey;
    currentHookIndex = prevHookIndex;

  }

  return unitContext.cachedValue;
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
          dependencies: new Map(),
          cachedValue: undefined,
          subscribe: (callback) => {
            unitContext.subscribers.push(callback);
            return () => unitContext.unsubscribe(callback);
          },
          unsubscribe: (callback) => {
            unitContext.subscribers = unitContext.subscribers.filter(sub => sub !== callback);
          },
          addDependency: (unit) => {
            const unitContextDep = store.getUnit(unit);
            if (!unitContext.dependencies.has(unit)) {
              const unsubscribe = unitContextDep.subscribe(unitContext.update);
              unitContext.dependencies.set(unit, unsubscribe);
            }
          },
          update: () => {
            const prevValue = unitContext.cachedValue;
            unitContext.cachedValue = undefined;
            const newValue = reuse(unitContext.unit);
  
            if (newValue !== prevValue) {
              unitContext.subscribers.forEach(sub => {
                sub(newValue);
              });
            }
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
      unitContext.update();
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

      setState(newState);
    });
  }, []);

  return state;
}
