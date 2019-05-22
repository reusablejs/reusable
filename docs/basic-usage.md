---
id: basic-usage
title: Getting Started with Reusable
sidebar_label: Getting Started
---

Reusable is a library for sharing state and side-effects between components using hooks.
Just wrap your custom hooks with `reusable` and you're good to go.

## Usage
```
npm install reusable
```
or
```
yarn add reusable
```

Provide  
```javascript
// App.js:
import { ReusableProvider } from "reusable";

const App = () => (
  <ReusableProvider> {/* no init code */}
    ...
  </ReusableProvider>
);

```

Create a unit (a reusable hook)  
```javascript
// units/timer.js
import { useState } from "react";
import { reusable } from "reusable";

export const useTimer = reusable(() => useState(0));
```

Using inside components  
```javascript
// Header.js:
import { useTimer } from "./units/timer";

const Header = () => {
  const [timer, setTimer] = useTimer();

  return ...
}

const Footer = () => {
  const [timer, setTimer] = useTimer(); // Yup, same timer

  return ...
}
```

## Using units inside other units
No problem at all:

```javascript
import {reusable} from 'reusable';

const useTodos = reusable(() => useReducer(reducer, {items: [], filter: 'All'});
const useFilteredTasks = reusable(() => {
  const [{items, filter}] = useTodos();

  return useMemo(
    () => items.filter(...),
    [items, filter]
  );
}

const Comp = () => {
  const filteredTasks = useFilteredTasks();
  ...
}
```

## Overriding selector and areEqual
- Select a subset of the unit's value using the 1st argument  
- Override compare method (shallowCompare by default) using the 2nd argument

```javascript
import {reusable} from 'reusable';

const useTodos = reusable(() => useState([]);

const Comp = () => {
  const nextTask = useTodos(
    ([items]) => items.find(item => !item.isCompleted),
    (item1, item2) => item1.id === item2.id
  );
  ...
}
```

## Demos
**basic**  
<a target="blank" href="https://codesandbox.io/s/github/reusablejs/reusable/tree/master/examples/basic?fontsize=14&module=%2Fsrc%2Findex.js">
  <img alt="Edit basic" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

**TodoMVC**  

<a target="blank" href="https://codesandbox.io/s/github/reusablejs/reusable/tree/master/examples/todomvc?fontsize=14&module=%2Fsrc%2Findex.js">
  <img alt="Edit basic" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

## Should I use this in production?

Follow your heart

## Feedback & Discussions:

[Slack Community](https://reusableslack.herokuapp.com)

## Contributing

Please do!  
Please open an issue for discussion before submitting a PR

What's missing:
- Tests
- TypeScript support
- SSR support
- Better error messages
- More Examples
  - lazy-loaded modules example
  - API requests
  - Keyed states
  - 3rd party
