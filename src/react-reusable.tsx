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

type SelectorFn<HookValue, SelectorValue> = (val: HookValue) => SelectorValue;
const identity = (val: any) => val;

function useStore<HookValue, SelectorValue>(
  fn: HookFn<HookValue>,
  selector: SelectorFn<HookValue, SelectorValue>,
  areEqual:AreEqual<SelectorValue>
) {
  const store = useContainer().getStore<HookValue>(fn);
  const [localCopy, setLocalCopy] = useState<SelectorValue>(() => selector(store.getValue()));

  useEffect(() => {
    return store.subscribe((newValue) => {
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

  // overload return function:
  function useStoreHook(): HookValue;

  function useStoreHook<SelectorValue = HookValue>(
    selector?: SelectorFn<HookValue, SelectorValue>,
    areEqual?: AreEqual<SelectorValue>
  ): SelectorValue;

  function useStoreHook<SelectorValue = HookValue>(
    selector?: SelectorFn<HookValue, SelectorValue>,
    areEqual?: AreEqual<SelectorValue>
  ) {
    return useStore(fn, selector || identity, areEqual || shallowEqual);
  }
  return useStoreHook;
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
