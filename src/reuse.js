export const reuse = callback => {
  units.set(callback, {hooks: []});

  return () => {
    // save
    const prevUnitKey = currentUnitKey;
    const prevHookIndex = currentHookIndex;

    // reset
    currentUnitKey = callback;
    currentHookIndex = 0;

    // call
    const result = callback();

    // restore
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

let currentUnitKey = null;
let currentHookIndex = 0;
let units = new Map();

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

  const {hooks} = units.get(currentUnitKey);

  // If hook doesn't exist for this index, create it
  if (hooks.length <= currentHookIndex) {
    const curIndex = currentHookIndex; // For closure
    const setState = (action) => {
      const prevState = hooks[curIndex][0];
      const newState = reducer(prevState, action);

      hooks[curIndex][0] = newState;
      // TBD: notify();
    }
    hooks[currentHookIndex] = [initialState, setState];
  }
  // Get current hook
  let hook = hooks[currentHookIndex];
  currentHookIndex++;

  return hook;
}
