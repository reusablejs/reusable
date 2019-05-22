class Unit {
  subscribers = [];
  cachedValue = null;
  constructor(fn, onDestroy) {
    this.fn = fn;
    this.onDestroy = onDestroy;
  }

  getValue() {
    return this.cachedValue;
  }

  run() {
    this.cachedValue = this.fn();
    return this.cachedValue;
  }

  subscribe(callback) {
    this.subscribers = [...this.subscribers, callback];
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
      if (this.subscribers.length === 0 && this.onDestroy) {
        this.onDestroy();
      }
    }
  }

  notify() {
    this.subscribers.forEach(sub => sub(this.cachedValue));
  }
}

class Store {
  units = new Map();
  subscribers = [];
  onUnitsChanged(callback) {
    this.subscribers = [...this.subscribers, callback];
    return () => this.subscribers = this.subscribers.filter(item => item !== callback);
  }
  createUnit(fn, {isDestroyable = true} = {}) {
    if (this.units.has(fn)) {
      throw new Error('Unit already exist', fn);
    }
    const unit = new Unit(fn, isDestroyable && (() => {
      this.units.delete(fn);
      this.notifyUnitsChanged();
    }));
    this.units.set(fn, unit);
    this.notifyUnitsChanged();
  }
  getUnit(fn) {
    return this.units.get(fn);
  }
  notifyUnitsChanged() {
    this.subscribers.forEach(sub => sub());
  }
  getUnitsArray() {
    const unitsArray = [];

    this.units.forEach((key) => {
      unitsArray.push(key);
    })
    return unitsArray;
  }
}
export const createStore = () => new Store();
let defaultStore = new Store();
export const getStore = () => defaultStore;
export const replaceStore = (mockedStore) => defaultStore = mockedStore;
