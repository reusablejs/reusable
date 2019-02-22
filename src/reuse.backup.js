import React, { createContext, useState, useContext, useEffect } from "react";
import { get, set } from "lodash/fp";

const ReuseContext = createContext();
export const ReuseProvider = ({ initialState, children }) => {
  let listeners = {};
  const store = {
    state: initialState,
    subscribe(path, callbackFn) {
      let pathListeners = listeners[path] || [];
      pathListeners = [...pathListeners, callbackFn];
      listeners = {
        ...listeners,
        [path]: pathListeners
      };

      return () => {
        listeners = {
          ...listeners,
          [path]: listeners[path].filter(item => item !== callbackFn)
        };
      };
    },
    update(fullpath, value) {
      store.state = set(fullpath, value, store.state);
      const pathElements = fullpath.split(".");
      let partialPath = [];
      pathElements.forEach(pathElement => {
        partialPath = [...partialPath, pathElement];
        store._notify(partialPath.join("."));
      });
    },
    _notify(path) {
      (listeners[path] || []).forEach(callbackFn => {
        callbackFn(store.state, path);
      });
    }
  };
  window.store = store;
  return (
    <ReuseContext.Provider value={store}>{children}</ReuseContext.Provider>
  );
};

export const reuseState = path => {
  const store = useContext(ReuseContext);

  const [state, setState] = useState(() => get(path, store.state));
  useEffect(() => {
    return store.subscribe(path, state => {
      console.log(state);

      setState(get(path, state));
    });
  }, []);
  return [state, value => store.update(path, value)];
};
