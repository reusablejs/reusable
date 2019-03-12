export const reuse = callback => {
  return () => {
    if (!currentStore) {
      throw new Error('Must provide a store first');
    }
    // Lazily define hooks for this unit
    if (!currentStore.units.has(callback)) {
      currentStore.units.set(callback, {hooks: []});
    }
    // save cursor
    const prevUnitKey = currentUnitKey;
    const prevHookIndex = currentHookIndex;

    // reset cursor
    currentUnitKey = callback;
    currentHookIndex = 0;

    // call
    const result = callback();

    // restore cursor
    currentUnitKey = prevUnitKey;
    currentHookIndex = prevHookIndex;

    // return
    return result;
  }
}
// TBD: export const useReuse = unit => {

// }

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

export const createStore = () => ({units: new Map()});
export const setCurrentStore = store => currentStore = store;
export const setCurrentCallback = callback => currentCallback = callback;
;

export const reuseState = (initialState) => {
  return reuseReducer(initialState, defaultReducer)
}

const notify = () => {
  currentCallback && currentCallback();
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

  const {hooks} = currentStore.units.get(currentUnitKey);

  // If hook doesn't exist for this index, create it
  if (hooks.length <= currentHookIndex) {
    const curIndex = currentHookIndex; // For closure
    const setState = (action) => {
      const prevState = hooks[curIndex][0];
      const newState = reducer(prevState, action);

      hooks[curIndex][0] = newState;
      notify();
    }
    hooks[currentHookIndex] = [initialState, setState];
  }
  // Get current hook
  let hook = hooks[currentHookIndex];
  currentHookIndex++;

  return hook;
}
