import * as React from "react";
import { FunctionComponent, useState, useContext, useEffect } from "react";
import { shallowEqual, AreEqual } from "./shallow-equal";
import {
  Container,
  getContainer,
  Store as StoreClass,
  HookFn,
} from "./reusable";

const ReusableContext = React.createContext<Container | null>(null);

export const ReusableProvider: FunctionComponent<{}> = ({ children }) => {
  return (
    <ReusableContext.Provider value={getContainer()}>
      <React.Fragment>
        <Stores />
        <DevTools />
        {children}
      </React.Fragment>
    </ReusableContext.Provider>
  );
};
Object.defineProperty(ReusableProvider, "displayName", {
  value: "ReusableProvider",
});

const componentCache = new Map();

const createStoreComponent = (store: StoreClass<any>) => {
  if (!componentCache.has(store)) {
    const Component = React.memo(() => {
      store.useValue();
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
        const StoreComponent = createStoreComponent(store);
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

const DevTools = ({}) => {
  const [open, setOpen] = useState(false);
  const [stateHistory, setStateHistory] = useState<any[]>([]);
  const container = useContainer();
  const [state, setState] = useState({});

  container.getStoresArray().forEach((store, i, arr) => {
    store.subscribe((value) => {
      setState((old) => {
        return {
          ...old,
          [store.name]: value,
        };
      });
    });
    if (
      i === arr.length - 1 &&
      JSON.stringify(stateHistory[stateHistory.length - 1]) !==
        JSON.stringify(state)
    ) {
      setStateHistory((history) => {
        console.log(history);
        return history.concat(state);
      });
    }
  });

  const goBack = React.useCallback((newValue: any) => {
    let j: number = 0;
    container.getStoresArray().forEach((store) => {
      for (let storeKey in newValue) {
        if (storeKey === store.name) {
          store.cachedValue = newValue[store.name];
          store.notify();
          j++;
        }
      }
    });
    if (j > 0) {
      return true;
    }
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          setOpen(!open);
        }}
      >
        {open ? "close" : "open"} dev Tools
      </button>
      <dialog open={open}>
        <TravelBack
          stateHistory={stateHistory}
          setStateHistory={setStateHistory}
          goBack={goBack}
        />
        {JSON.stringify(state)}
        <ul>
          {container.getStoresArray().map((store) => (
            <li>
              {store.name} -{/* @ts-ignore  */}
              {JSON.stringify(state[store.name as keyof state])}
              {/* {JSON.stringify(store.subscribers)} */}
            </li>
          ))}
        </ul>
        <div>
          <button onClick={() => setOpen(false)}>close</button>
        </div>
      </dialog>
    </div>
  );
};

const TravelBack = ({
  stateHistory,
  setStateHistory,
  goBack,
}: {
  stateHistory: any[];
  setStateHistory: any;
  goBack: any;
}) => {
  const [counter, setCounter] = useState(2);

  return (
    <React.Fragment>
      <button
        onClick={() => {
          if (goBack(stateHistory[stateHistory.length - counter])) {
            setCounter((counter) => counter + 2);
          }
        }}
      >
        go back
      </button>
      <button
        onClick={() => {
          if (goBack(stateHistory[stateHistory.length + counter])) {
            setCounter((counter) => counter + 2);
          }
        }}
      >
        go forward
      </button>
    </React.Fragment>
  );
};

// };

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
