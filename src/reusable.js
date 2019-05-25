class Unit {
  subscribers = [];
  cachedValue = null;
  constructor(fn) {
    this.fn = fn;
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
  createUnit(fn) {
    if (this.units.has(fn)) {
      throw new Error('Unit already exist', fn);
    }
    const unit = new Unit(fn);
    this.units.set(fn, unit);
    this.notifyUnitsChanged();
  }
  getUnit(fn) {
    if (!this.units.has(fn)) {
      throw new Error('Unit doesn\'t exist', fn);
    }
    return this.units.get(fn);
  }
  notifyUnitsChanged() {
    this.subscribers.forEach(sub => sub());
  }
  getUnitsArray() {
    const unitsArray = [];

    this.units.forEach((unit) => {
      unitsArray.push(unit);
    })
    return unitsArray;
  }
}
export const createStore = () => new Store();
let defaultStore = new Store();
export const getStore = () => defaultStore;
export const replaceStore = (mockedStore) => defaultStore = mockedStore;
