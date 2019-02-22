## Features

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

## Basic Usage

```
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

```
// counter.state.js:
import { reuseState } from "reuse";

const useCounterState = () => {
  const [counter, setCounter] = reuseState('counter');

  return {
    counter,
    increment: () => setCounter(val => val + 1),
    decrement: () => setCounter(val => val - 1),
    reset: () => setCounter(1)
  }
}

// component:
import {useCounterState} from '../states/counter.state';

const Comp = () => {
  const counterState = useCounterState();
  return ...
}
```

## Time Travelling, Undo/Redo

```
// App.js:
import { withHistory, ReuseProvider, createStore } from "reuse";
const initialState = {
  counter: 1
};
const store = withHistory(createStore)(initialState);  // Oooh, cool!

const App = () => (
  <ReuseProvider store={store}>
);

// component:
import React from "react";
import { useHistory } from "./reuse";

export const TimeTravel = () => {
  const { undo, redo, canUndo, canRedo } = useHistory(); // Even Cooler!!
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

## Using a reducer

```
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

## Combining state, memoizing:

```
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
