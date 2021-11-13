import {useState} from 'react'
import {renderHook, act} from 'react-hooks-testing-library'
import {getContainer, createContainer, replaceContainer} from '../src/reusable';
import {createStore, ReusableProvider} from '../src/react-reusable';

let container;
let store;
const value = {title: 'Yo'};
const expectToBeAContainer = (object) => {
  expect(object.stores).toBeDefined();
}
const expectToBeAStore = (object) => {
  expect(object.cachedValue).toBeDefined();
}
describe('public container API', () => {
  beforeEach(() => {
    container = getContainer();
  });
  it('should allow to get a container', () => {
    expectToBeAContainer(container);
  });
  it('should allow to create a container', () => {
    expectToBeAContainer(createContainer());
  });
  it('should allow to replace the container', () => {
    const newContainer = createContainer();
    replaceContainer(newContainer);
    expect(getContainer()).toBe(newContainer);
  });
  it('should allow to create a store', () => {
    const fn = () => {};
    container.createStore(fn);
    expectToBeAStore(container.getStore(fn));
  });
  it('should allow to subscribe to creating a store', () => {
    const fn = () => {};
    let result;
    container.onStoresChanged(() => {
      result = container.getStore(fn);
    });
    container.createStore(fn);
    expectToBeAStore(result);
  });
  it('should not allow to get a store without creating it', () => {
    const fn = () => {};

    expect(() => container.getStore(fn)).toThrow();
  });
  it('should not allow to create a store twice', () => {
    const fn = () => {};
    container.createStore(fn);
    expect(() => container.createStore(fn)).toThrow();
  });
  it('should allow to unsubscribe from subscribing to creating a store', () => {
    const callback = jest.fn();
    const fn = () => {};
    const unsubscribe = container.onStoresChanged(callback);
    expect(callback.mock.calls.length).toBe(0);
    unsubscribe();
    container.createStore(fn);
  });

});
describe('public store API', () => {
  beforeEach(() => {
    const fn = () => value;
    container.createStore(fn);
    store = container.getStore(fn);
  });

  it('should allow to get the cached value', () => {
    expect(store.cachedValue).toBeDefined();
  });

  it('should allow to calculate the stores value', () => {
    expect(store.useValue()).toBe(value);
  });

  it('should cache the store value', () => {
    store.useValue();
    expect(store.cachedValue).toBe(value);
  });
  it('should allow to subscribe to value change', () => {
    const callback = jest.fn();
    store.subscribe(callback);
    store.useValue();
    store.notify();
    expect(callback.mock.calls.length).toBe(1);
    expect(callback.mock.calls[0][0]).toBe(value);
  });
  it('should allow to unsubscribe to value change', () => {
    const callback = jest.fn();
    const unsubscribe = store.subscribe(callback);
    expect(callback.mock.calls.length).toBe(0);
    store.useValue();
    unsubscribe();
    store.notify();
  });
});

describe('reusable', () => {
  beforeEach(() => {
    container = createContainer();
    replaceContainer(container);
  })
  it('should return a store value', () => {
    const useSomething = createStore(() => useState(1));
    const { result } = renderHook(useSomething, {
      wrapper: ReusableProvider
    });
    const [state] = result.current;

    expect(state).toBe(1);
  });
  it('should allow to set values on a store', () => {
    const useSomething = createStore(() => useState(1));
    const {result} = renderHook(useSomething, {
      wrapper: ReusableProvider
    });
    const [_, setState] = result.current;

    act(() => setState(3));

    const [state] = result.current;

    expect(state).toBe(3);
  });
  it('should allow to set values twice (stale state bug)', () => {
    const useSomething = createStore(() => useState(false));
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
  it('should share state between stores', () => {
    const useSomething = createStore(() => useState(1));
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
    const useSomething = createStore(() => useState(1));
    const {result} = renderHook(useSomething);

    expect(result.error.toString()).toMatchSnapshot();
  });
  it('should allow to return a function value', () => {
    const callback = jest.fn();
    const useSomething = createStore(() => callback);
    const {result} = renderHook(useSomething, {
      wrapper: ReusableProvider
    });
    
    expect(result.current).toBe(callback);
    expect(callback.mock.calls.length).toBe(0);
  });
});
describe('selectors', () => {
  beforeEach(() => {
    container = createContainer();
    replaceContainer(container);
  });

  it('should allow to use a selector', () => {
    const useSomething = createStore(() => useState(1));
    const useSelector = () => useSomething(state => state[0]);
    const { result } = renderHook(useSelector, {
      wrapper: ReusableProvider
    });
    const state = result.current;
      
    expect(state).toBe(1);
  });
  
  it('should allow to use a selector that returns a function', () => {
    const callback = jest.fn();
    const useSomething = createStore(() => ({ callback }));
    const useSelector = () => useSomething(state => state.callback);
    const {result} = renderHook(useSelector, {
      wrapper: ReusableProvider
    });
    
    expect(result.current).toBe(callback);
    expect(callback.mock.calls.length).toBe(0);
  });

});
