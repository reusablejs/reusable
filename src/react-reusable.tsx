import * as React from 'react';
import { FunctionComponent, useState, useContext, useEffect } from 'react';
import { shallowEqual, AreEqual } from './shallow-equal';
import { Container, getContainer, Store as StoreClass, HookFn } from './reusable';

const ReusableContext = React.createContext<Container | null>(null);

export const ReusableProvider: FunctionComponent<{}> = ({ children }) => {
  return (
    <ReusableContext.Provider value={getContainer()}>
      <React.Fragment>
        <Stores />
        {children}
      </React.Fragment>
    </ReusableContext.Provider>
  );
};

const createStoreComponent = (name: string) => {
  const Component = ({ store }: { store: StoreClass<any>}) => {
    store.run();

    React.useDebugValue(store.name);

    useEffect(() => store.notify(), [store.cachedValue]);

    return null;
  };

  Object.defineProperty(Component,'name', { value: name });

  return Component;
};

const useContainer = () => {
  const container = useContext(ReusableContext) as Container;

  if (container === null) {
    throw new Error('Are you trying to use Reusable without a ReusableProvider?');
  }

  return container;
}

const Stores = () => {
  const container = useContainer();
  const [stores, setStores] = useState(() => container.getStoresArray());

  useEffect(() => {
    return container.onStoresChanged(() => {
      setStores(container.getStoresArray());
    });
  }, []);

  return (
    <React.Fragment>
      {stores.map((store: StoreClass<any>, index: number) => {
        const StoreComponent = createStoreComponent(store.name);

        return <StoreComponent key={index} store={store}/>;
      })}
    </React.Fragment>
  )
}

type SelectorFn<HookValue> = (val: HookValue) => any;
const identity = (val: any) => val;
function useStore<HookValue>(
  fn: HookFn<HookValue>,
  selector = identity,
  areEqual = shallowEqual
) {
  const store = useContainer().getStore(fn);
  const [localCopy, setLocalCopy] = useState(() => selector(store.getValue()));

  useEffect(() => {
    return store.subscribe((newValue: any) => {
      const selectedNewValue = selector(newValue);
      if (!areEqual(selectedNewValue, localCopy)) {
        setLocalCopy(() => selectedNewValue);
      }
    });
  }, [store, localCopy, selector, areEqual]);

  return localCopy;
}

export function createStore<HookValue>(fn: HookFn<HookValue>) {
  getContainer().createStore(fn);

  return (selector?: SelectorFn<HookValue>, areEqual?: AreEqual<HookValue>) => useStore(fn, selector, areEqual);
}

// TBD:
// export const reusableReducer = (reducer, initialValue, init, options) => {
//   const fn = () => useReducer(reducer, initialValue, init);

//   getStore().createUnit(fn, options);
//   return (selector, areEqual) => useStore(fn, selector, areEqual);
// };

// export const reusableState = (init, options) => {
//   const fn = () => useState(init);

//   getStore().createUnit(fn, options);
//   return (selector, areEqual) => useStore(fn, selector, areEqual);
// };
