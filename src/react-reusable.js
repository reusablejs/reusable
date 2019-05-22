import React, { useState, useContext, useEffect } from "react";
import {shallowEqual} from './shallow-equal';
import {getStore} from './reusable';

const ReusableContext = React.createContext();
export const ReusableProvider = ({ children }) => {
  return (
    <ReusableContext.Provider value={getStore()}>
      <React.Fragment>
        <Units/>
        {children}
      </React.Fragment>
    </ReusableContext.Provider>
  );
};

const Unit = ({ unit }) => {
  unit.run();

  useEffect(() => unit.notify(), [unit.cachedValue]);

  return null;
}

const useStore = () => useContext(ReusableContext);

const Units = () => {
  const store = useStore();
  const [units, setUnits] = useState(() => store.getUnitsArray());

  useEffect(() => {
    return store.onUnitsChanged(() => {
      setUnits(store.getUnitsArray());
    });
  }, []);

  return (
    <React.Fragment>
      {units.map((unit, index) => <Unit key={index} unit={unit}/>)}
    </React.Fragment>
  )
}
const identity = val => val;
const useReuse = (fn, selector = identity, areEqual = shallowEqual) => {
  const unit = useStore().getUnit(fn);
  const [localCopy, setLocalCopy] = useState(() => selector(unit.getValue()));
  
  useEffect(() => {
    return unit.subscribe((newValue) => {
      const selectedNewValue = selector(newValue);
      if (!areEqual(selectedNewValue, localCopy)) {
        setLocalCopy(selectedNewValue);
      }
    });
  }, [unit, selector, areEqual]);

  return localCopy;
}

export const reusable = (fn) => {
  getStore().createUnit(fn);

  return (selector, areEqual) => useReuse(fn, selector, areEqual);
}

// TBD:
// export const reusableReducer = (reducer, initialValue, init, options) => {
//   const fn = () => useReducer(reducer, initialValue, init);

//   getStore().createUnit(fn, options);
//   return (selector, areEqual) => useReuse(fn, selector, areEqual);
// };

// export const reusableState = (init, options) => {
//   const fn = () => useState(init);

//   getStore().createUnit(fn, options);
//   return (selector, areEqual) => useReuse(fn, selector, areEqual);
// };
