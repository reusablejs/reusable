import React, {
  createContext,
  useRef,
  useState,
  useContext,
  useEffect
} from "react";
import { get, set } from "lodash/fp";

const defaultReducer = (state, value) => {
  if (typeof value === "function") {
    return value(state);
  } else {
    return value;
  }
};

// reuse
export const createStore = () => {
  let listeners = [];
  let state = new Map();
  let currentKey = null;
  let currentPath = null;
  let currentHookIndex = 0;
  const store = {
    getCurrentHooks: () => {
      if (!state.has(currentKey)) {
        state.set(currentKey, {});
      }
      const hooks = state.get(currentKey);

      if (!get(currentPath, hooks)) {
        state.set(currentKey, set(currentPath, [], hooks));
      }
      return get(currentPath, state.get(currentKey));
    },
    setCurrentKey: (key, path = "__root") => {
      currentKey = key;
      currentPath = path;
      currentHookIndex = 0;
    },
    useState: (initialValue, reducer = defaultReducer) => {
      // get current hook
      const hooks = store.getCurrentHooks();
      const curIndex = currentHookIndex;
      const key = currentKey;
      // if it doesn't exist, create it according to initialValue
      if (hooks.length <= currentHookIndex) {
        // create tuple
        const value =
          typeof initialValue === "function" ? initialValue() : initialValue;
        const setValue = newValue => {
          hooks[curIndex][0] = reducer(hooks[curIndex][0], newValue);
          store.notify(key);
        };

        // save it on the current index
        hooks[curIndex] = [value, setValue];
      }
      // return current hook and advance index
      return hooks[currentHookIndex++];
    },
    subscribe: (key, callbackFn) => {
      // subscribe to specific key
      const listener = { key, callbackFn };

      listeners = [...listeners, listener];

      return () => {
        listeners = listeners.filter(item => item !== listener);
      };
    },
    notify: key => {
      // notify specific key
      listeners.forEach(listener => {
        if (key === listener.key) {
          listener.callbackFn();
        }
      });
    }
    // replace: newState => {
    //   state = newState;
    //   listeners.forEach(({ key, callbackFn }) => {
    //     callbackFn(get(key, state));
    //   });
    // }
  };

  window.store = store;

  return store;
};

// reuse-react
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
const mockStore = {
  useState,
  subscribe: () => {},
  setCurrentKey: () => {}
};

export const reuse = param => {
  let callback =
    typeof param === "function" ? param : reuseState => reuseState(param);

  return path => {
    const store = useContext(ReuseContext) || mockStore;
    let reuseState = store.useState;
    const [counter, setCounter] = useState(0);
    const forceUpdate = () => setCounter(val => val + 1);

    store.setCurrentKey(callback, path);
    useEffect(() => store.subscribe(callback, forceUpdate), []);

    return callback(reuseState);
  };
};

// export const reuseState = (path, initialValue, reducer = defaultReducer) => {
//   const store = useContext(ReuseContext);

//   const [state, setState] = useState(() => {
//     let result = get(path, store.getState());

//     if (result === undefined) {
//       if (initialValue === undefined) {
//         throw new Error("Must supply initial value to reuseState");
//       }
//       result = initialValue;
//     }
//     return result;
//   });
//   useEffect(() => {
//     return store.subscribe(path, value => setState(value));
//   }, []);
//   return [
//     state,
//     value => {
//       const newState = reducer(state, value);
//       store.update(path, newState);
//     }
//   ];
// };

// time travel
// export const withHistory = originalCreateStore => {
//   return (initialState = {}) => {
//     const store = originalCreateStore({
//       ...initialState,
//       __history: {
//         items: [{}],
//         index: 0
//       }
//     });
//     const newStore = {
//       ...store,
//       update: (fullpath, value) => {
//         store.update(fullpath, value);
//         store.update("__history", __history => {
//           // get items until current index
//           const itemsTillNow = __history.items.slice(0, __history.index + 1);
//           // save all state except time travel data
//           const newItem = { ...store.getState() };
//           delete newItem.__history;

//           // add to items and advance index
//           const newItems = [...itemsTillNow, newItem];
//           const newIndex = __history.index + 1;

//           return {
//             ...__history,
//             items: newItems,
//             index: newIndex
//           };
//         });
//       }
//     };

//     return newStore;
//   };
// };

// // react time travel
// export const useTimeTravel = () => {
//   const [timeTravel] = reuseState();
//   const store = useContext(ReuseContext);

//   const gotoIndex = index => {
//     const newIndex = Math.min(Math.max(0, index), timeTravel.items.length - 1);
//     const newState = {
//       ...timeTravel.items[newIndex],
//       __history: {
//         ...timeTravel,
//         index: newIndex
//       }
//     };
//     store.replace(newState);
//   };

//   return {
//     getItems: () => timeTravel.items,
//     getIndex: () => timeTravel.index,
//     canUndo: () => timeTravel.index > 0,
//     canRedo: () => timeTravel.index < timeTravel.items.length - 1,
//     undo: () => gotoIndex(timeTravel.index - 1),
//     redo: () => gotoIndex(timeTravel.index + 1),
//     gotoIndex
//   };
// };
