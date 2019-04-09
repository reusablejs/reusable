---
id: full-demo
title: Quick overview
sidebar_label: Quick overview
---

> This is a quick overview for people who prefer to read code, and not text.
For a deeper (yet still short) explanation of this library, please read the [Usage Guide](units)

## Units
Units are the main building block in Reusable. They are just functions that return data.
Units can subscribe to other units via the `reuse` method.

## Hooks
Reusable is based heavily on React hooks API, but with 're' prefix.
They are scoped to a single store, and not to a specific component.

You have the following hooks available:
- `reuseState`
- `reuseReducer`
- `reuseEffect`
- `reuseMemo`
- `reuseCallback`
- `reuseRef`

## Other API
- `Memo` - determines when the unit notifies updates to others units/components that use it

## React Integration
- `ReuseProvider` - Must be present in top-level component
- `useReuse` - subscribes to a certain unit of data

## Live Demo

And here is a **TodoMVC** example using (almost) all of the features:

<a target="blank" href="https://codesandbox.io/s/github/reusablejs/reusable/tree/todomvc-example/examples/all?fontsize=14&module=%2Fsrc%2Findex.js">
  <img alt="Edit basic" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

<iframe src="https://codesandbox.io/embed/github/reusablejs/reusable/tree/todomvc-example/examples/all?fontsize=14&module=%2Fsrc%2Findex.js" title="basic" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>