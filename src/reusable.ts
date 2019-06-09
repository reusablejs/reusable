export type HookFn<HookValue> = () => HookValue;
export type UnitValueChangeCallback<HookValue> = (value: HookValue | null) => void;
export type UnitsChangeCallback = () => void;

export class Unit<HookValue> {
  subscribers: UnitValueChangeCallback<HookValue>[] = [];
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

  subscribe(callback: UnitValueChangeCallback<HookValue>) {
    this.subscribers = [...this.subscribers, callback];
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
    }
  }

  notify() {
    this.subscribers.forEach(sub => sub(this.cachedValue));
  }
}

export class Store {
  units = new Map<HookFn<any>, Unit<any>>();
  subscribers: UnitsChangeCallback[] = [];
  onUnitsChanged(callback: UnitsChangeCallback) {
    this.subscribers = [...this.subscribers, callback];
    return () => {
      this.subscribers = this.subscribers.filter(item => item !== callback);
    }
  }
  createUnit(fn: HookFn<any>) {
    if (this.units.has(fn)) {
      throw new Error('Unit already exist');
    }
    const unit = new Unit(fn);
    this.units.set(fn, unit);
    this.notifyUnitsChanged();
  }
  getUnit(fn: HookFn<any>):Unit<any> {
    if (!this.units.has(fn)) {
      throw new Error('Unit doesn\'t exist');
    }
    return <Unit<any>>this.units.get(fn);
  }
  notifyUnitsChanged() {
    this.subscribers.forEach(sub => sub());
  }
  getUnitsArray() {
    const unitsArray: Unit<any>[] = [];

    this.units.forEach((unit) => {
      unitsArray.push(unit);
    })
    return unitsArray;
  }
}
export const createStore = () => new Store();
let defaultStore = new Store();
export const getStore = () => defaultStore;
export const replaceStore = (mockedStore: Store) => defaultStore = mockedStore;
