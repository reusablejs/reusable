import {useState} from 'react'
import {renderHook, act} from 'react-hooks-testing-library'
import {getStore, createStore, replaceStore} from '../src/reusable';
import {reusable, ReusableProvider} from '../src/react-reusable';

let store;
let unit;
const value = {title: 'Yo'};
const expectToBeAStore = (object) => {
  expect(object.units).toBeDefined();
}
const expectToBeAUnit = (object) => {
  expect(object.cachedValue).toBeDefined();
}
describe('public store API', () => {
  beforeEach(() => {
    store = getStore();
  });
  it('should allow to get a store', () => {
    expectToBeAStore(store);
  });
  it('should allow to create a store', () => {
    expectToBeAStore(createStore());
  });
  it('should allow to replace the store', () => {
    const newStore = createStore();
    replaceStore(newStore);
    expect(getStore()).toBe(newStore);
  });
  it('should allow to create a unit', () => {
    const fn = () => {};
    store.createUnit(fn);
    expectToBeAUnit(store.getUnit(fn));
  });
  it('should allow to subscribe to creating a unit', () => {
    const fn = () => {};
    let result;
    store.onUnitsChanged(() => {
      result = store.getUnit(fn);
    });
    store.createUnit(fn);
    expectToBeAUnit(result);
  });
  it('should not allow to get a unit without creating it', () => {
    const fn = () => {};

    expect(() => store.getUnit(fn)).toThrow();
  });
  it('should not allow to create a unit twice', () => {
    const fn = () => {};
    store.createUnit(fn);
    expect(() => store.createUnit(fn));
  });
  it('should allow to unsubscribe from subscribing to creating a unit', () => {
    expect.assertions(0);
    const fn = () => {};
    const unsubscribe = store.onUnitsChanged(() => {
      expect(true).toBe(false); // should not reach here
    });
    unsubscribe();
    store.createUnit(fn);
  });

});
describe('public unit API', () => {
  beforeEach(() => {
    const fn = () => value;
    store.createUnit(fn);
    unit = store.getUnit(fn);
  });

  it('should allow to get the cached value', () => {
    expect(unit.cachedValue).toBeDefined();
  });

  it('should allow to run the unit', () => {
    expect(unit.run()).toBe(value);
  });

  it('should cache the unit value', () => {
    unit.run();
    expect(unit.cachedValue).toBe(value);
  });
  it('should allow to subscribe to value change', () => {
    let result;
    unit.subscribe((cachedValue) => {
      result = cachedValue;
    });
    unit.run();
    unit.notify();
    expect(result).toBe(value);
  });
  it('should allow to unsubscribe to value change', () => {
    expect.assertions(0);
    const unsubscribe = unit.subscribe((cachedValue) => {
      expect(cachedValue).toBe(value);
    });
    unit.run();
    unsubscribe();
    unit.notify();
  });
});

describe('reusable', () => {
  beforeEach(() => {
    store = createStore();
    replaceStore(store);
  })
  it('should allow to define a reusable unit', () => {
    const useSomething = reusable(() => useState(0));

    expect(typeof useSomething).toBe('function');
  });
  it('should return a unit value', () => {
    const useSomething = reusable(() => useState(1));
    const { result } = renderHook(useSomething, {
      wrapper: ReusableProvider
    });

    expect(result.current[0]).toBe(1);
  });
  it('should allow to set values on a unit', () => {
    const useSomething = reusable(() => useState(1));
    const {result} = renderHook(useSomething, {
      wrapper: ReusableProvider
    });

    act(() => result.current[1](3));
    expect(result.current[0]).toBe(3);
  });
  it('should allow to set values twice (stale state bug)', () => {
    const useSomething = reusable(() => useState(false));
    const {result} = renderHook(useSomething, {
      wrapper: ReusableProvider
    });

    act(() => result.current[1](prev => !prev));
    expect(result.current[0]).toBe(true);
    act(() => result.current[1](prev => !prev));
    expect(result.current[0]).toBe(false);
  });
  it('should share state between units', () => {
    const useSomething = reusable(() => useState(1));
    const {result} = renderHook(useSomething, {
      wrapper: ReusableProvider
    });

    const {result: result2} = renderHook(useSomething, {
      wrapper: ReusableProvider
    });

    act(() => result.current[1](3));
    expect(result.current[0]).toBe(3);
    expect(result2.current[0]).toBe(3);
  });
  it('should fail without a provider', () => {
    const useSomething = reusable(() => useState(1));
    const {result} = renderHook(useSomething);

    expect(result.error.toString()).toMatchSnapshot();
  });
});
