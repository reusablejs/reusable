---
id: basic-usage
title: Getting Started with Reusable in React
sidebar_label: Basic Usage with React
---

## Installation
```
npm install reusable
```
or
```
yarn add reusable
```

## Create a data unit
```javascript
// units/counter.js
import { reuseState } from "reusable";

export const timer = () => reuseState(0);
```

## React Provider
```javascript
// App.js:
import { ReuseProvider } from "reusable/react";

const App = () => (
  <ReuseProvider>
    <Footer/>
    <Header/>
  </ReuseProvider>
);

```
## Using inside a component
```javascript
// Header.js:
import { useReuse } from "reusable/react";
import { timer } from "./units/counter";

const Header = () => {
  const [counter, setCounter] = useReuse(timer);

  return ... // Use it like regular hooks
}
```

## Using the same unit inside another component
```javascript
// Footer.js:
import { useReuse } from "reusable/react";
import { timer } from "./units/timer";

const Footer = () => {
  const [counter, setCounter] = useReuse(timer); // Yup, same counter

  return ...
}
```

## Live Demo
<a target="blank" href="https://codesandbox.io/s/github/reusablejs/reusable/tree/master/examples/basic?fontsize=14&module=%2Fsrc%2Findex.js">
  <img alt="Edit basic" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

<iframe src="https://codesandbox.io/embed/github/reusablejs/reusable/tree/master/examples/basic?fontsize=14&module=%2Fsrc%2Findex.js" title="basic" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>