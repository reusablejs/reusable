import * as React from "react";
import { FunctionComponent, useState, useContext, useEffect } from "react";
import { shallowEqual, AreEqual } from "./shallow-equal";
import {
  Container,
  getContainer,
  Store as StoreClass,
  HookFn,
} from "./reusable";

const storeValuesArray: any[] = [];

function storeValueChanged(storeValueProp: object)  {
  storeValuesArray.push(storeValueProp)
  return storeValuesArray
}

const ReusableContext = React.createContext<Container | null>(null);

export const ReusableProvider: FunctionComponent<{}> = ({ children }) => {
  const [globalState, setGlobalState] = useState()
  return (
  <ReusableContext.Provider value={getContainer()}>
    <React.Fragment>
      <Stores setGlobalState={setGlobalState}/>
      <DevTools globalState={globalState}/>
      {children}
    </React.Fragment>
  </ReusableContext.Provider>
  )
};
Object.defineProperty(ReusableProvider, "displayName", {
  value: "ReusableProvider",
});

const componentCache = new Map();


const createStoreComponent = (store: StoreClass<any>, setGlobalState: any) => {
  if (!componentCache.has(store)) {
    const Component = React.memo(() => {
      const storeValue = store.useValue();
      // storeValueChanged(store.useValue())
      setGlobalState((state: any) => {
        if(state){
            state[store.name].push(storeValue);
          return ({...state, [store.name]: state[store.name]})
        }
        return({...state, [store.name]: [storeValue]})
      })
      useEffect(() => store.notify(), [store.cachedValue]);
      return null;
    });
    Object.defineProperty(Component, "name", { value: store.name });
    componentCache.set(store, Component);
  }

  return componentCache.get(store);
};


/* ########################## */
const useContainer = () => {
  const container = useContext(ReusableContext) as Container;

  if (container === null) {
    throw new Error(
      "Are you trying to use Reusable without a ReusableProvider?"
    );
  }

  return container;
};
/* ########################## */
const Stores = ({setGlobalState}: {setGlobalState: any}) => {
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
        const StoreComponent = createStoreComponent(store, setGlobalState);
        return <StoreComponent key={index} store={store} />;
      })}
    </React.Fragment>
  );
};
Object.defineProperty(Stores, "displayName", { value: "Stores" });
/* ########################## */

type SelectorFn<HookValue, SelectorValue> = (val: HookValue) => SelectorValue;
const identity = (val: any) => val;

/* ########################## */
function useStore<HookValue, SelectorValue>(
  fn: HookFn<HookValue>,
  selector: SelectorFn<HookValue, SelectorValue>,
  areEqual: AreEqual<SelectorValue>
) {
  const store = useContainer().getStore<HookValue>(fn);
  React.useDebugValue("reusable");
  const [localCopy, setLocalCopy] = useState<SelectorValue>(() =>
    selector(store.getCachedValue())
  );

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
/* ########################## */
export function createStore<HookValue>(fn: HookFn<HookValue>) {
  const store = getContainer().createStore(fn);

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
    React.useDebugValue(store.name);

    return useStore(fn, selector || identity, areEqual || shallowEqual);
  }
  return useStoreHook;
}

const DevTools = ({globalState}: {globalState: any}) => {
  useEffect(() => {
    console.log(globalState);
  })

  return (
    <ReusableContext.Consumer>
      {(value) => {
        console.log(value);
        return <div>{value?.stores.keys.toString()}</div>}}
    </ReusableContext.Consumer>
  );
};

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
