import React, { createContext, useState, useContext, useEffect } from "react";
import { get, set } from "lodash/fp";

// reuse
export const createStore = initialState => {
  let listeners = [];
  let state = initialState;
  const store = {
    getState: () => state,
    subscribe: (path, callbackFn) => {
      const listener = { path, callbackFn };
      listeners = [...listeners, listener];

      return () => {
        listeners = listeners.filter(item => item !== listener);
      };
    },
    replace: newState => {
      state = newState;
      listeners.forEach(({ path, callbackFn }) => {
        callbackFn(get(path, state));
      });
    },
    update: (fullpath, value) => {
      state = set(fullpath, value, state);

      listeners.forEach(({ path, callbackFn }) => {
        if (path.includes(fullpath) || fullpath.includes(path)) {
          callbackFn(get(path, state));
        }
      });
    }
  };
  window.store = store;
  return store;
};

// reuse-react
const ReuseContext = createContext();

export const ReuseProvider = ({ store, children }) => (
  <ReuseContext.Provider value={store}>{children}</ReuseContext.Provider>
);

const defaultReducer = (state, value) => {
  if (typeof value === "function") {
    return value(state);
  } else {
    return value;
  }
};
export const reuseState = (path, reducer = defaultReducer) => {
  const store = useContext(ReuseContext);

  const [state, setState] = useState(get(path, store.getState()));
  useEffect(() => {
    return store.subscribe(path, value => setState(value));
  }, []);
  return [
    state,
    value => {
      const newState = reducer(state, value);
      store.update(path, newState);
    }
  ];
};

// time travel
export const withTimeTravel = store => {
  let history = [store.getState()];
  let currentHistoryIndex = 0;

  const newStore = {
    ...store,
    update: (fullpath, value) => {
      store.update(fullpath, value);
      history = [
        ...history.slice(0, currentHistoryIndex + 1),
        store.getState()
      ];
      currentHistoryIndex++;
    }
  };
  const actions = {
    canUndo: () => currentHistoryIndex > 0,
    canRedo: () => currentHistoryIndex < history.length - 1,
    undo: () => actions.setHistoryIndex(currentHistoryIndex - 1),
    redo: () => actions.setHistoryIndex(currentHistoryIndex + 1),
    setHistoryIndex: newIndex => {
      currentHistoryIndex = Math.min(Math.max(0, newIndex), history.length - 1);
      store.replace(history[currentHistoryIndex]);
    }
  };
  return { ...newStore, ...actions };
};
