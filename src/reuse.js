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
export const withHistory = originalCreateStore => {
  return initialState => {
    const newInitialState = {
      ...initialState,
      __history: {
        items: [initialState],
        index: 0
      }
    };
    const store = originalCreateStore(newInitialState);

    const newStore = {
      ...store,
      update: (fullpath, value) => {
        store.update(fullpath, value);
        store.update("__history", __history => {
          // get items until current index
          const itemsTillNow = __history.items.slice(0, __history.index + 1);
          // save all state except time travel data
          const newItem = { ...store.getState() };
          delete newItem.__history;

          // add to items and advance index
          const newItems = [...itemsTillNow, newItem];
          const newIndex = __history.index + 1;

          return {
            ...__history,
            items: newItems,
            index: newIndex
          };
        });
      }
    };

    return newStore;
  };
};

export const useTimeTravel = () => {
  const [timeTravel] = reuseState("__history");
  const store = useContext(ReuseContext);

  const gotoIndex = index => {
    const newIndex = Math.min(Math.max(0, index), timeTravel.items.length - 1);
    const newState = {
      ...timeTravel.items[newIndex],
      __history: {
        ...timeTravel,
        index: newIndex
      }
    };
    store.replace(newState);
  };

  return {
    getItems: () => timeTravel.items,
    getIndex: () => timeTravel.index,
    canUndo: () => timeTravel.index > 0,
    canRedo: () => timeTravel.index < timeTravel.items.length - 1,
    undo: () => gotoIndex(timeTravel.index - 1),
    redo: () => gotoIndex(timeTravel.index + 1),
    gotoIndex
  };
};
