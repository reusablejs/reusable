---
id: units
title: Creating and using data units
sidebar_label: Creating and using data units
---

## Hooks
Reusable API is based on React hooks API, and follows the same Rules of Hooks.
All of Reusable's hooks are equal in their API to React hooks.

There are 2 main differences:
1. Reusable hooks have a 're' prefix (e.g. `reuseState`, `reuseEffect` etc.).
2. Reusable hooks are scoped to the current **data unit** that is being reused, and not to the current element that is being rendered.

If you haven't heard of React hooks, you should first learn the motivation behind them, how to use them, and the rules of hooks before diving into Reusable:  
(https://reactjs.org/docs/hooks-intro.html)[https://reactjs.org/docs/hooks-intro.html]

## What's a data unit?
A *data unit* is just a function that returns data:

```javascript
const timer = () => {
  return 42;
}
```

This is a static unit with a constant state. Doesn't really make any sense.

## reuseState
Usually, you will reuse state inside of a data unit:

```javascript
import {reuseState} from "reusable";

export const timer = () => {
  const [counter, setCounter] = reuseState(0);

  return [counter, setCounter];
}
```

You can also call `reuseState` multiple times, and have multiple states inside your data unit:
```javascript
import {reuseState} from "reusable";

export const timer = () => {
  const [counter, setCounter] = reuseState(0);
  const [isRunning, setIsRunning] = reuseState(false);

  return {
    counter,
    isRunning,
    start: () => setIsRunning(false),
    stop: () => setIsRunning(true)
  }
}
```

You can return whatever you want from the data unit. That will be the unit's **value**

## reuseReducer
You can use a reducer, same as with React hooks, to manage complex objects and use actions to indicate a user intent:
```javascript
import {reuseState} from "reusable";

const timerReducer = (state, action) => {
  switch(action.type) {
    case 'START':
      return {...state, isRunning: true};
    case 'STOP':
      return {...state, isRunning: false};
    default: return state;
  }
}
export const timer = () => {
  const [state, dispatch] = reuseReducer(
    timerReducer,
    {
      counter: 0,
      isRunning: false
    }
  );

  return [state, dispatch];
}
```

## reuseEffect
Reusable allows to define side-effects that are scoped to the entire store, and not to a specific component's lifecycle.

```javascript
import {reuseState} from "reusable";

export const timer = () => {
  const [counter, setCounter] = reuseState(0);
  const [isRunning, setIsRunning] = reuseState(false);

  reuseEffect(() => {
    if (isRunning) {
      const id = setInterval(() => setCounter(prev => prev + 1), 1000);

      return () => clearInterval(id);
    }
  }, [isRunning, setCounter]);

  return {
    counter,
    isRunning,
    start: () => setIsRunning(false),
    stop: () => setIsRunning(true)
  }
}
```

The `reuseEffect` method takes a function and **deps** array, and behaves similarly to `useEffect`.  
Whenever the data unit is reused - the effects will check the deps array.
If one of the deps changed - the cleanup function will run, and then the effect.

There is currently no equivalent to _unmount_, and the final cleanup function will never run (WIP)

## Custom Reusable hooks
You can use the power of hooks for Reusable data units, and create custom hooks.

For example, let's create a `reuseInterval` custom hook, that will be used like this:
```javascript
export const timer = () => {
  const [counter, setCounter] = reuseState(0);
  const [isRunning, setIsRunning] = reuseState(false);

  reuseInterval(
    () => setCounter(prev => prev + 1),
    isRunning ? 1000 : null
  );

  return {
    counter,
    isRunning,
    start: () => setIsRunning(false),
    stop: () => setIsRunning(true)
  }
}
```

And this is the custom hook's code:

```javascript
export const reuseInterval = (callback, delay) => {
  // Set up the interval.
  reuseEffect(() => {
    if (delay !== null) {
      const id = setInterval(callback, delay);

      return () => clearInterval(id);
    }
  }, [delay]);
}
```

As you can see, a custom Reusable hook is just a function that uses Reusable's built-in hooks.  
Because Reusable keeps track of the execution context, they can easily be shared between data units (similar to React).

## reuseMemo and reuseCallback
You can create memoized values and callbacks using `reuseMemo` and `reuseCallback`.
These are memoized in the scope of the entire store, and not per component element:

```javascript
export const timer = () => {
  const [counter, setCounter] = reuseState(0);
  const [isRunning, setIsRunning] = reuseState(false);

  reuseInterval(
    () => setCounter(prev => prev + 1),
    isRunning ? 1000 : null
  );

  const start = reuseCallback(() => setIsRunning(false));
  const stop = reuseCallback(() => setIsRunning(true));

  const hours = Math.floor(counter / 3600);
  const minutes = Math.floor(counter / 60 % 60);
  const ellapsed = reuseMemo(() => `${hours}:${minutes}`, [hours, minutes]);

  return {
    counter,
    ellapsed,
    isRunning,
    start,
    stop
  }
}
```

## Reusing data units values
Sometimes, you want to reuse data from different reusable units.
Usually this is done to create a reusable memoized view of the data (agreggated/computed/filtered/etc.).
You might know this from other frameworks as selectors and computed values.

For example, let's extract the ellapsed time to a separate data unit:
```javascript
export const timer = () => {
  // ...
}
export const ellapsed = () => {
  const {counter} = reuse(timer);

  const hours = Math.floor(counter / 3600);
  const minutes = Math.floor(counter / 60 % 60);

  return reuseMemo(() => `${hours}:${minutes}`, [hours, minutes]);
}
```

Whe could also reuse multiple stores:

```javascript
export const currentUserTodos = () => {
  const [currentUser] = reuse(user);
  const [allProperties] = reuse(properties);

  return reuseMemo(
    () => allProperties.filter(property => property.userId === currentUser.id),
    [currentUser.id, allProperties]
  );
}
```

And also other Reusable hooks (`reuseState`, `reuseEffect`, etc.).
```javascript
export const filteredProperties = () => {
  const [allProperties] = reuse(properties);
  const [minPrice, setMinPrice] = reuse(1000);

  const filteredProperties = reuseMemo(
    () => allProperties.filter(property => property.price > minPrice),
    [minPrice, allProperties]
  );

  return {
    minPrice,
    setMinPrice,
    filteredProperties
  };
}
```

> It's very important to understand how this is different than just calling the `timer` function, like we did with `reuseInterval`;
When you just call a function, you are not reusing the data unit. Which means that as far as Reusable is concerned, the current running data unit hasn't changed.  
> You can compare this to using React's `createElement`. If you render `<Comp {...props}/>` - it's not like calling `Comp(props)`.  
The first tells React to create an element, and that element will have its own local hooks (state, effects, etc.) when it's time for it to render.  
The latter is just invoking a function, and as far as React is concerned, the currently rendered component hasn't changed.


## reuseRef
// TBD
