import React, {
    createContext,
    useRef,
    useState,
    useContext,
    useEffect
} from "react";
import {shallowCompare} from './shallow-compare';
import {reuse, createStore, setCurrentStore} from './reuse';

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

// HOC
export const withReuse = (unit, mapStateToProps) => (Comp) => {
  class WrappedComponent extends React.Component {
    state = {
      mappedProps: {}
    }
    componentDidMount() {
      const store = this.context;
      setCurrentStore(store);
      this.unsubscribe = store.subscribe(unit, () => {
        this.updateStateToProps();
      })
      this.updateStateToProps();
    }
    updateStateToProps() {
      const newState = reuse(unit);
      const newProps = mapStateToProps(newState);
      const oldProps = this.state.mappedProps;

      if (!shallowCompare(oldProps, newProps)) {
        this.setState({ mappedProps: newProps });
      }
    }
    componentWillUnmount() {
      this.unsubscribe();
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

