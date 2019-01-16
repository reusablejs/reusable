import React, { createContext, useState, useContext, useEffect } from "react";
import { get, set } from "lodash/fp";

const GlobalStateContext = createContext();
export const GlobalStateProvider = ({ initialState, children }) => {
  let listeners = [];
  const store = {
    state: initialState,
    subscribe: (path, callbackFn) => {
      const listener = { path, callbackFn };
      listeners = [...listeners, listener];

      return () => {
        listeners = listeners.filter(item => item !== listener);
      };
    },
    notify: fullpath => value => {
      store.state = set(fullpath, value, store.state);

      listeners.forEach(({ path, callbackFn }) => {
        if (path.includes(fullpath) || fullpath.includes(path)) {
          callbackFn(get(path, store.state));
        }
      });
    }
  };

  return (
    <GlobalStateContext.Provider value={store}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = path => {
  const store = useContext(GlobalStateContext);

  const [state, setState] = useState(get(path, store.state));
  useEffect(() => {
    return store.subscribe(path, value => setState(value));
  }, []);
  return [state, store.notify(path)];
};
