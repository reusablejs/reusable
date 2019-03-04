## What?!

Reuse is a library for reusing state between React components.

## Why?

Reuse solves the problems that state management is meant for, without unnecessary boilerplate or magic.

React hooks introduced new ways of thinking about state and side-effects.
These new ways made old habits obsolete, and require a new type of state management tool that embraces the same concepts:

- Separation of concerns
- Reusability
- Simplicity

While still providing the developers with structure and architecture with large-scale apps in mind.

## Features

- single-store
- immutable
- reactive
- simple
- predictable
- performant
- allow for reuse, encapsulation and modularity
- gradually adoptable
- SSR
- Time travelling
- extendable

## What about Context API?

The answer is pretty much the same for people asking about "Redux vs. Context API?"
Using Context API directly gives a simple API to share state between components, but it doesn't provide other benefits that reuse provides, such as:

- Time Travelling
- Single Store
- Compound Selectors
- Structure
- Easily reuse code that needs state management using custom hooks
- Easily provide open source components that allow control of state

## Is Reuse designed for large apps?

Reuse is built with large-scale apps in mind.
This is what affected most of the considerations when designing the solution:

- The benefits of a single store and immutable data:
  - Allow a maintainable architecture and prevent tangled cross-stores access
  - Easier to reach deep UI states during development by overriding initial state
  - Easier to achieve undo/redo, state persistence
- The ability to do code reuse using custom hooks to prevent code duplication
- Supporting Redux DevTools for better debugging & QA
- Support lazy-loaded modules

## Basic Usage

```javascript
// App.js:
import { ReuseProvider, createStore } from "reuse";
const initialState = {
  counter: 1
};
const store = createStore(initialState); // no reducer?!
const App = () => (
  <ReuseProvider store={store}>
);

// component #1:
import { reuseState } from "reuse";

const CompOne = () => {
  const [counter, setCounter] = reuseState('counter');
  return ...
}

// component #2:
import { reuseState } from "reuse";

const CompOne = () => {
  const [counter, setCounter] = reuseState('counter'); // Yup, same counter as above
  return ...
}
```

## Custom Hooks

```javascript
// counter.state.js:
import { reuseState } from "reuse";

const useCounterState = () => {
  const [counter, setCounter] = reuseState('counter');

  return {
    value: counter,
    increment: () => setCounter(val => val + 1),
    decrement: () => setCounter(val => val - 1),
    reset: () => setCounter(1)
  }
}

// component:
import {useCounterState} from '../states/counter.state';

const Comp = () => {
  const counterState = useCounterState();
  return ... // Just use it!
}
```

## Compound selectors, memoizing:

```javascript
// No special tricks - just use hooks
export const useCurrentUserBalance = () => {
  const [transactions] = reuseState("transactions");
  const [currentUser] = reuseState("currentUser");

  return useMemo(
    () =>
      transactions
        .filter(({ userId }) => userId === currentUser.id)
        .reduce((sum, { amount }) => amount + sum, 0),
    [transactions, currentUser.id]
  );
};
```

## Reusable components / NPM libraries:

library

```javascript
import React, { useCallback } from "react";
import { reuseState } from "reuse";

// ControlledComponent
export const Input = ({ value = "", setValue, placeholder = "" }) => {
  const onChange = useCallback(e => setValue(e.target.value), []);
  return <input value={value} onChange={onChange} placeholder={placeholder} />;
};

// Reusable State Controller:
export const reuseInputState = (path = "_my_lib_input_path") => {
  const state = reuseState(path);

  return controller(state);
};

// Local State Controller:
export const useInputState = () => {
  const state = useState('');

  return controller(state);
}

const controller = [value, setValue] => (
{
    value,
    setValue,
    clear: () => setValue("")
});
```

Consumer:

```javascript
// Using the lib with re-used state:
import { Input, reuseInputState } from "my-form-lib";

const Comp = () => {
  const inputState = reuseInputState("forms.user.0");

  return <Input {...inputState} />;
};

// Using the lib with local state:
import { Input, useInputState } from "my-form-lib";

const Comp = () => {
  const inputState = useInputState();

  return <Input {...inputState} />;
};
```

## Time Travelling, Undo/Redo

```javascript
// App.js:
import { ReuseProvider, createStore } from "reuse";
import { withHistory } from "reuse-history";

const initialState = {
  counter: 1
};
const store = withHistory(createStore)(initialState);  // Oooh, cool

const App = () => (
  <ReuseProvider store={store}>
);

// component:
import React from "react";
import { useHistory } from "reuse-history";

export const TimeTravel = () => {
  const { undo, redo, canUndo, canRedo } = useHistory(); // Oh! Even Cooler!!
  return (
    <div>
      <button disabled={!canUndo()} onClick={undo}>
        Undo
      </button>
      <button disabled={!canRedo()} onClick={redo}>
        Redo
      </button>
    </div>
  );
};
```

## Using a reducer (because why not)

```javascript
// counter.state.js:
export const useCounterState = () => {
  const [counter, dispatch] = reuseState("ui.counter", (state, action) => {
    switch (action.type) {
      case "DECREMENT":
        return state - 1;
      case "INCREMENT":
        return state + 1;
      default:
        return state;
    }
  });

  return {
    counter,
    decrement: () => dispatch({ type: "DECREMENT" }),
    increment: () => dispatch({ type: "INCREMENT" })
  };
};
```

## Feedback:

https://goo.gl/forms/Jza0XsM7F3shvWhD2

## What's missing:

- Release to NPM
- Support lazy-loaded modules
- Async actions example
- Tests
- Redux DevTools integrations
- Docs
- Examples

## Problems:

- Save/Load state without keys
