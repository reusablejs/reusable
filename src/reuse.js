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

  // if (!unit.cachedValue) {
    // save cursor
    const prevUnitKey = currentUnitKey;
    const prevHookIndex = currentHookIndex;
    const prevCallback = currentCallback;

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
let currentCallback = null;

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
      // unit.invalidate = true;
      // notify();
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
