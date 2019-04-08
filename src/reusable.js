import { shallowCompare } from './shallow-compare';

export const reuse = (unit) => {
  if (!currentStore) {
    throw new Error('Must provide a store first');
  }

  if (currentUnitKey) {
    currentStore.getUnit(currentUnitKey).addDependency(unit);
  }

  const unitContext = currentStore.getUnit(unit);

  if (!unitContext.cachedValue) {
    // save cursor
    const prevUnitKey = currentUnitKey;
    const prevHookIndex = currentHookIndex;

    // reset cursor
    currentUnitKey = unit;
    currentHookIndex = 0;

    // call
    unitContext.cachedValue = unit();

    // run effects:
    unitContext.effects.forEach(effect => {
      if (effect.cleanup) {
        if (typeof effect.cleanup === 'function') {
          effect.cleanup();
        } else {
          console.error(`Cleanup function ${effect.cleanup} is not a function`)
        }
      };
      effect.cleanup = effect.effectFn();
    })
    unitContext.effects = [];

    // restore cursor
    currentUnitKey = prevUnitKey;
    currentHookIndex = prevHookIndex;

  }

  return unitContext.cachedValue;
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

const equality = (prev, next) => prev === next;

export const createStore = () => {
  const store = {
    unitContexts: new Map(),
    getUnit: (unit) => {
      // Lazily define hooks for this unit
      if (!store.unitContexts.has(unit)) {
        const unitContext = {
          unit,
          hooks: [],
          effects: [],
          subscribers: [],
          dependencies: new Map(),
          cachedValue: undefined,
          areEqual: unit.areEqual || equality,
          subscribe: (callback) => {
            unitContext.subscribers.push(callback);
            return () => unitContext.unsubscribe(callback);
          },
          unsubscribe: (callback) => {
            unitContext.subscribers = unitContext.subscribers.filter(sub => sub !== callback);
          },
          addDependency: (unit) => {
            const unitContextDep = store.getUnit(unit);
            if (!unitContext.dependencies.has(unit)) {
              const unsubscribe = unitContextDep.subscribe(unitContext.update);
              unitContext.dependencies.set(unit, unsubscribe);
            }
          },
          update: () => {
            const prevValue = unitContext.cachedValue;
            unitContext.cachedValue = undefined;
            const newValue = reuse(unitContext.unit);

            if (!unitContext.areEqual(prevValue, newValue)) { // TBD - change to shallowCompare
              unitContext.subscribers.forEach(sub => {
                sub(newValue);
              });
            }
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
  return reuseReducer(defaultReducer, initialState)
}

export const reuseReducer = (reducer, initialState) => {
  if (!currentUnitKey) {
    throw new Error(`reuseMemo hook cannot be called outside of a reuse statement`);
  }

  if (!currentStore) {
    throw new Error('Must provide a store first');
  }

  const unitContext = currentStore.getUnit(currentUnitKey);

  // If hook doesn't exist for this index, create it
  if (unitContext.hooks.length <= currentHookIndex) {
    const curIndex = currentHookIndex; // For closure
    const setState = (action) => {
      const prevState = unitContext.hooks[curIndex].state;
      const newState = reducer(prevState, action);

      unitContext.hooks[curIndex].state = newState;
      unitContext.update();
    }
    const state = (typeof initialState === 'function') ? initialState() : initialState;

    unitContext.hooks[currentHookIndex] = { state, setState, type: 'state' };
  }
  // Get current hook
  let hook = unitContext.hooks[currentHookIndex];
  currentHookIndex++;

  return [hook.state, hook.setState];
}

export const reuseMemo = (fn, deps) => {
  if (!currentUnitKey) {
    throw new Error(`reuseMemo hook cannot be called outside of a reuse statement`);
  }

  if (!currentStore) {
    throw new Error('Must provide a store first');
  }

  const unitContext = currentStore.getUnit(currentUnitKey);
  // If hook doesn't exist for this index, create it
  if (unitContext.hooks.length <= currentHookIndex) {
    unitContext.hooks[currentHookIndex] = { value: undefined, deps: undefined, type: 'memo' };
  }
  // Get current hook
  let hook = unitContext.hooks[currentHookIndex];
  currentHookIndex++;
  let prevDeps = hook.deps;

  // If deps changed - or no deps
  if (!shallowCompare(prevDeps, deps) || !deps) {
    hook.value = fn();
    hook.deps = deps;
  }
  return hook.value;
}

export const reuseCallback = (fn, deps) => {
  return reuseMemo(() => fn, deps);
}

export const reuseEffect = (effectFn, deps) => {
  if (!currentUnitKey) {
    throw new Error(`reuseMemo hook cannot be called outside of a reuse statement`);
  }

  if (!currentStore) {
    throw new Error('Must provide a store first');
  }

  const unitContext = currentStore.getUnit(currentUnitKey);
  // If hook doesn't exist for this index, create it
  if (unitContext.hooks.length <= currentHookIndex) {
    unitContext.hooks[currentHookIndex] = {
      deps: undefined,
      effectFn,
      cleanup: undefined,
      type: 'effect'
    };
  }
  // Get current hook
  let hook = unitContext.hooks[currentHookIndex];
  currentHookIndex++;
  let prevDeps = hook.deps;

  // If deps changed
  if (!shallowCompare(prevDeps, deps) || !deps) {
    unitContext.effects.push(hook);
    hook.deps = deps;
    hook.effectFn = effectFn;
  }
  return;
}


export const Memo = (unit, areEqual = shallowCompare) => {
  unit.areEqual = areEqual;

  return unit;
};

export const reuseRef = (initialVal) => {
  if (!currentUnitKey) {
    throw new Error(`reuseRef hook cannot be called outside of a reuse statement`);
  }

  if (!currentStore) {
    throw new Error('Must provide a store first');
  }

  const unitContext = currentStore.getUnit(currentUnitKey);
  // If hook doesn't exist for this index, create it
  if (unitContext.hooks.length <= currentHookIndex) {
    console.log('create ref');
    unitContext.hooks[currentHookIndex] = {
      ref: {current: initialVal},
      type: 'ref'
    };
  }
  // Get current hook
  let hook = unitContext.hooks[currentHookIndex];
  currentHookIndex++;

  return hook.ref;
} // reuseRef

