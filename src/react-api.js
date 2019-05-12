import React from 'react';

export const createStore = () => {
  const store = {
    unitContexts: new Map(),
    getUnit(unit) {
      if (!store.unitContexts.has(unit)) {
        const unitContext = {
          unit,
          hooks: [],
          effects: []
        };

        unitContext.set(unit, unitContext);
      }
    },
    subscribe() {

    },
    registerUnit(identity) {
      store.unitContexts.set(identity, {

      });
    }
  };

  return store;
};

export const reusable = (customHook) => {
  const unit = store.getUnit(customHook);



  return customHook;
};

export const ReuseContext = React.createContext();
