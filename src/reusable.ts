export type HookFn<HookValue> = () => HookValue;
export type StoreValueChangeCallback<HookValue> = (value: HookValue | null) => void;
export type StoresChangeCallback = () => void;

export class Store<HookValue> {
  subscribers: StoreValueChangeCallback<HookValue>[] = [];
  cachedValue: HookValue | null = null;
  constructor(private fn: HookFn<HookValue>) {
  }

  getValue() {
    return this.cachedValue;
  }

  run() {
    this.cachedValue = this.fn();
    return this.cachedValue;
  }

  subscribe(callback: StoreValueChangeCallback<HookValue>) {
    this.subscribers = [...this.subscribers, callback];
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
    }
  }

  notify() {
    this.subscribers.forEach(sub => sub(this.cachedValue));
  }
}

export class Container {
  stores = new Map<HookFn<any>, Store<any>>();
  subscribers: StoresChangeCallback[] = [];
  onStoresChanged(callback: StoresChangeCallback) {
    this.subscribers = [...this.subscribers, callback];
    return () => {
      this.subscribers = this.subscribers.filter(item => item !== callback);
    }
  }
  createStore(fn: HookFn<any>) {
    if (this.stores.has(fn)) {
      throw new Error('Store already exist');
    }
    const store = new Store(fn);
    this.stores.set(fn, store);
    this.notifyStoresChanged();
  }
  getStore(fn: HookFn<any>):Store<any> {
    if (!this.stores.has(fn)) {
      throw new Error('Store doesn\'t exist');
    }
    return <Store<any>>this.stores.get(fn);
  }
  notifyStoresChanged() {
    this.subscribers.forEach(sub => sub());
  }
  getStoresArray() {
    const storesArray: Store<any>[] = [];

    this.stores.forEach((store) => {
      storesArray.push(store);
    })
    return storesArray;
  }
}
export const createContainer = () => new Container();
let defaultContainer = new Container();
export const getContainer = () => defaultContainer;
export const replaceContainer = (mockedContainer: Container) => defaultContainer = mockedContainer;
