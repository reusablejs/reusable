## What?!

Reusable is a library for reusing state and business logic between components.

## Should I use this now?

This is a very early stage alpha
If you want to start experimenting with it and share feedback - yes
If you need it for a production app - no

## Why?

Reusable solves the problems that state management is meant for, with a simple and clean API, inspired and based on React hooks API.

React hooks introduced new ways of thinking about state and side-effects.
These new ways made old habits obsolete, and require a new type of state management tool that embraces the same concepts:

- Separation of concerns
- Reusability
- Composability
- Simplicity

While still providing the developers with structure and architecture with large-scale apps in mind.

## Features

- managing shareable state
- handling side effects
- memoization
- reactive (subscription)

## Design guidelines
- immutability
- reusability (duh)
- performance
- predictability
- encapsulation (for shared libraries / lazy loading)
- gradually adoptable

# Usage Guide

## Basic Usage
```javascript
// reusables/counter.js
import { reuseState } from "reusable";

export const counter = () => reuseState(0);
```

## React Integration
```javascript
// App.js:
import { ReuseProvider } from "reusable/react";

const App = () => (
  <ReuseProvider>
    ...
  </ReuseProvider>
);

// component #1:
import { useReusable } from "reusable/react";
import { counter } from "./reusables/counter";

const CompOne = () => {
  const [counter, setCounter] = useReusable(counter);

  return ...
}

// component #2:
import { useReusable } from "reusable/react";
import { counter } from "./reusables/counter";

const CompTwo = () => {
  const [counter, setCounter] = useReusable(counter); // Yup, same counter

  return ...
}
```
## Compound State

```javascript
// reusables/counterState.js:
import { reuseState } from "reusable";

export const counterState = () => {
  const [counter, setCounter] = reuseState(0);
  const [step, setStep] = reuseState(0);

  return {
    counter,
    step,
    setStep,
    increment: () => setCounter(val => val + step),
    decrement: () => setCounter(val => val - step)
  }
}

// component:
import { useReusable } from "reusable/react";
import { counterState } from './reusables/counterState';

const Comp = () => {
  const counterState = useReusable(counterState);

  return ... // Just use it!
}
```

## Using a Reducer
// TBD

## Compound selectors, memoizing:
// TBD

## Reusable components / NPM libraries:
// TBD

## Time Travelling, Undo/Redo
// TBD

## Using without a SPA (vanilla)
// TBD

# Commonly asked questions

## What about Context API?

The answer is pretty much the same for people asking about "Redux vs. Context API?"
Using Context API directly gives a simple API to share state between components, but it doesn't provide other benefits that reuse provides, such as:

- Time Travelling
- Single Store
- Compound Selectors
- Structure
- Easily reuse code that needs state management using custom hooks
- Easily provide open source components that allow control of state

## Is Reusable designed for large apps?

Reuse is built with large-scale apps in mind.
This is what affected most of the considerations when designing the solution:

- The benefits of a single store and immutable data:
  - Allow a maintainable architecture and prevent tangled cross-stores access
  - Easier to reach deep UI states during development by overriding initial state
  - Easier to achieve undo/redo, state persistence
- The ability to do code reuse using custom hooks to prevent code duplication
- Supporting Redux DevTools for better debugging & QA
- Support lazy-loaded modules

# Feedback:

https://goo.gl/forms/Jza0XsM7F3shvWhD2

# What's missing:

- Support lazy-loaded modules
- Tests
- DevTools integrations
- Docs
- Fallback to local state
- More Examples
- Time Travelling
- TypeScript Support
