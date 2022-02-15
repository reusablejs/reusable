export type HookFn<HookValue = any> = () => HookValue;
export type StoreValueChangeCallback<HookValue> = (value: HookValue) => void;
export type StoresChangeCallback = () => void;

let storeNumber = 0;

export class Store<HookValue = any> {
  name: string;
  subscribers: StoreValueChangeCallback<HookValue>[] = [];
  cachedValue: HookValue | null = null;
  constructor(private fn: HookFn<HookValue>) {
    this.name = fn.name || "Store" + storeNumber;
    storeNumber++;
  }

  getCachedValue() {
    return this.cachedValue as HookValue;
  }

  useValue() {
    this.cachedValue = this.fn();
    return this.cachedValue as HookValue;
  }

  subscribe(callback: StoreValueChangeCallback<HookValue>) {
    this.subscribers = [...this.subscribers, callback];
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  notify() {
    this.subscribers.forEach((sub) => sub(this.cachedValue as HookValue));
  }
}

export class Container {
  stores = new Map<HookFn, Store>();
  subscribers: StoresChangeCallback[] = [];

  onStoresChanged(callback: StoresChangeCallback) {
    this.subscribers = [...this.subscribers, callback];
    return () => {
      this.subscribers = this.subscribers.filter((item) => item !== callback);
    };
  }

  createStore(fn: HookFn) {
    if (this.stores.has(fn)) {
      throw new Error("Store already exist");
    }
    const store = new Store(fn);
    this.stores.set(fn, store);
    this.notifyStoresChanged();

    return store;
  }

  getStore<HookValue>(fn: HookFn<HookValue>): Store<HookValue> {
    if (!this.stores.has(fn)) {
      throw new Error("Store doesn't exist");
    }
    return <Store<HookValue>>this.stores.get(fn);
  }

  notifyStoresChanged() {
    this.subscribers.forEach((sub) => sub());
  }

  getStoresArray() {
    const storesArray: Store<any>[] = [];

    this.stores.forEach((store) => {
      storesArray.push(store);
    });
    return storesArray;
  }
}

export const createContainer = () => new Container();
let defaultContainer = new Container();
export const getContainer = () => defaultContainer;
export const replaceContainer = (mockedContainer: Container) =>
  (defaultContainer = mockedContainer);
