import * as React from 'react';
import { FunctionComponent, useState, useContext, useEffect } from 'react';
import { shallowEqual, AreEqual } from './shallow-equal';
import { Store, getStore, Unit as UnitClass, HookFn } from './reusable';

const ReusableContext = React.createContext<Store | null>(null);

export const ReusableProvider: FunctionComponent<{}> = ({ children }) => {
  return (
    <ReusableContext.Provider value={getStore()}>
      <React.Fragment>
        <Units />
        {children}
      </React.Fragment>
    </ReusableContext.Provider>
  );
};

const Unit = ({ unit }: { unit: UnitClass<any> }) => {
  unit.run();

  useEffect(() => unit.notify(), [unit.cachedValue]);

  return null;
}

const useStore = () => {
  const store = useContext(ReusableContext) as Store;

  if (store === null) {
    throw new Error('Are you trying to use Reusable without a ReusableProvider?');
  }

  return store;
}

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
      {units.map((unit: UnitClass<any>, index: number) => <Unit key={index} unit={unit} />)}
    </React.Fragment>
  )
}

type SelectorFn<HookValue> = (val: HookValue) => any;
const identity = (val: any) => val;
function useReuse<HookValue>(
  fn: HookFn<HookValue>,
  selector = identity,
  areEqual = shallowEqual
) {
  const unit = useStore().getUnit(fn);
  const [localCopy, setLocalCopy] = useState(() => selector(unit.getValue()));

  useEffect(() => {
    return unit.subscribe((newValue: any) => {
      const selectedNewValue = selector(newValue);
      if (!areEqual(selectedNewValue, localCopy)) {
        setLocalCopy(() => selectedNewValue);
      }
    });
  }, [unit, localCopy, selector, areEqual]);

  return localCopy;
}

export function reusable<HookValue>(fn: HookFn<HookValue>) {
  getStore().createUnit(fn);

  return (selector?: SelectorFn<HookValue>, areEqual?: AreEqual<HookValue>) => useReuse(fn, selector, areEqual);
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
