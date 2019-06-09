---
id: basic-usage
title: Getting Started with Reusable
sidebar_label: Getting Started
---

Reusable is a state management library that uses hooks.
It allows to transform your custom hooks to stores, that have a shared state and behavior.  
Just wrap your custom hooks with `createStore` and you're good to go.

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

Create a store
```javascript
import {useState} from "react";
import {createStore} from "reusable";

export const useTimer = createStore(() => useState(0));
```

Using inside components  
```javascript
// Header.js:
const Header = () => {
  const [timer, setTimer] = useTimer();

  return ...
}

const Footer = () => {
  const [timer, setTimer] = useTimer(); // Yup, same timer

  return ...
}
```

## Using stores inside other stores
No problem at all:

```javascript
import {createStore} from 'reusable';

const useTodos = createStore(() => useReducer(reducer, {items: [], filter: 'All'});
const useFilteredTasks = createStore(() => {
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

## Using selectors
Select a subset of the hook's return value using the 1st argument  

```javascript
import {createStore} from 'reusable';

const useTodos = createStore(() => {
  const [items, setItems] = useState([]);

  return {
    items,
    setItems
  }
});

const Comp = () => {
  const tasksCount = useTodos(
    (state) => state.items.length
  );
  ...
}
```

## Override areEqual
Override compare method (shallowCompare by default) using the 2nd argument

```javascript
import {createStore} from 'reusable';

const useTodos = createStore(() => {
  const [items, setItems] = useState([]);

  return {
    items,
    setItems
  }
});

const Comp = () => {
  const nextTask = useTodos(
    (state) => state.items.find(item => !item.isCompleted),
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
Reusable is in early stage and is being used (happily) in several projects.  
Follow your heart.

## Feedback / Discussions:

[Slack Community](https://reusableslack.herokuapp.com)

## Contributing

Please do!  
Please open an issue for discussion before submitting a PR

