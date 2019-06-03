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
    expect(() => store.createUnit(fn)).toThrow();
  });
  it('should allow to unsubscribe from subscribing to creating a unit', () => {
    const callback = jest.fn();
    const fn = () => {};
    const unsubscribe = store.onUnitsChanged(callback);
    expect(callback.mock.calls.length).toBe(0);
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
    const callback = jest.fn();
    unit.subscribe(callback);
    unit.run();
    unit.notify();
    expect(callback.mock.calls.length).toBe(1);
    expect(callback.mock.calls[0][0]).toBe(value);
  });
  it('should allow to unsubscribe to value change', () => {
    const callback = jest.fn();
    const unsubscribe = unit.subscribe(callback);
    expect(callback.mock.calls.length).toBe(0);
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
  it('should return a unit value', () => {
    const useSomething = reusable(() => useState(1));
    const { result } = renderHook(useSomething, {
      wrapper: ReusableProvider
    });
    const [state] = result.current;

    expect(state).toBe(1);
  });
  it('should allow to set values on a unit', () => {
    const useSomething = reusable(() => useState(1));
    const {result} = renderHook(useSomething, {
      wrapper: ReusableProvider
    });
    const [_, setState] = result.current;

    act(() => setState(3));

    const [state] = result.current;

    expect(state).toBe(3);
  });
  it('should allow to set values twice (stale state bug)', () => {
    const useSomething = reusable(() => useState(false));
    const {result} = renderHook(useSomething, {
      wrapper: ReusableProvider
    });

    const [_, setState] = result.current;
    act(() => setState(prev => !prev));
    let state = result.current[0];
    expect(state).toBe(true);
    act(() => setState(prev => !prev));
    state = result.current[0];
    expect(state).toBe(false);
  });
  it('should share state between units', () => {
    const useSomething = reusable(() => useState(1));
    const {result} = renderHook(useSomething, {
      wrapper: ReusableProvider
    });
    const [_, setState] = result.current;

    const {result: result2} = renderHook(useSomething, {
      wrapper: ReusableProvider
    });
    
    act(() => setState(3));
    const [state] = result.current;
    expect(state).toBe(3);

    const [state2] = result2.current;

    expect(state2).toBe(3);
  });
  it('should fail without a provider', () => {
    const useSomething = reusable(() => useState(1));
    const {result} = renderHook(useSomething);

    expect(result.error.toString()).toMatchSnapshot();
  });
});
