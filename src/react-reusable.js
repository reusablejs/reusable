import React, { useState, useRef, useContext, useEffect } from "react";
import {getStore} from './reusable';

export const ReusableContext = React.createContext();
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
  const value = unit.run();

  useEffect(() => unit.notify(), [unit.cachedValue]);

  return (
    <pre style={{display: 'none'}}>
      { JSON.stringify(value, null, 4) }
    </pre>
  );
}

export const useStore = () => useContext(ReusableContext);

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
export const useReuse = (fn) => {
  const unit = useStore().getUnit(fn);
  const [localCopy, setLocalCopy] = useState(() => unit.getValue());
  
  useEffect(() => {
    return unit.subscribe((newValue) => {
      setLocalCopy(newValue);
    });
  }, [unit]);

  return localCopy;
}

export const reusable = (fn) => {
  getStore().getUnit(fn);

  return () => useReuse(fn);
}