import React, { createContext, useState, useContext, useEffect } from "react";
import produce from "immer";

const SimmerContext = createContext();
export const Provider = ({ initialState, children }) => {
  let listeners = [];
  const store = {
    state: initialState,
    subscribe: fn => {
      listeners = [...listeners, fn];
      return () => listeners.filter(l => l !== fn);
    },
    notify: () => {
      listeners.forEach(l => l(store.state));
    }
  };

  return (
    <SimmerContext.Provider value={store}>{children}</SimmerContext.Provider>
  );
};

export const useAction = (name, actionCreator) => {
  return (...args) => {
    const store = useContext(SimmerContext);
    return () => {
      console.log("fired action", name, args);
      store.state = produce(store.state, actionCreator(...args));
      store.notify();
    };
  };
};

export const useSelector = selectorCreator => {
  return (...args) => {
    const selectorFn = selectorCreator(...args);
    const store = useContext(SimmerContext);
    const [result, setResult] = useState(() => selectorFn(store.state));
    let prevResult = result;

    useEffect(() => {
      store.subscribe(state => {
        let nextResult = selectorFn(state);
        if (nextResult !== prevResult) {
          prevResult = nextResult;

          setResult(nextResult);
        }
      });
    });
    return result;
  };
};
