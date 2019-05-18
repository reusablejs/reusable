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
      if (this.subscribers.length === 0) {
        this.destroy();
      }
    }
  }

  notify() {
    this.subscribers.forEach(sub => sub(this.cachedValue));
  }

  destroy() {
    this.onDestroy();
  }
}

class Store {
  units = new Map();
  subscribers = [];
  onUnitsChanged(callback) {
    this.subscribers = [...this.subscribers, callback];
    return () => this.subscribers = this.subscribers.filter(item => item !== callback);
  }
  getUnit(fn) {
    if (!this.units.has(fn)) {
      const unit = new Unit(fn, () => {
        this.units.delete(fn);
        this.notifyUnitsChanged();
      });
      this.units.set(fn, unit);
      this.notifyUnitsChanged();
    }
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
export const store = new Store();
