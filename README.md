[![Build Status](https://circleci.com/gh/reusablejs/reusable.svg?style=svg)](https://circleci.com/gh/reusablejs/reusable)
[![npm version](https://badge.fury.io/js/reusable.svg)](https://badge.fury.io/js/reusable)

# Docs
[https://reusablejs.github.io/reusable](https://reusablejs.github.io/reusable)

# tl;dr
Reusable is a state management library that uses hooks.
It allows to transform your custom hooks to stores, that have a shared state and behavior.  
Just wrap your custom hooks with `createStore` and you're good to go.

```javascript
const useSomething = createStore(() => {
  //custom hook
});

const Comp1 = () => {
  const something = useSomething();
}

const Comp2 = () => {
  const something = useSomething(); // same something
}

const App = () => (
  <ReusableProvider> {/* no initialization code */}
    ...
  </ReusableProvider>
)
```

# What about hooks+Context
Using plain context is not a best solution for state management, that led us to write this library:
- When managing global state using Context in a large app, you will probably have many small, single-purpose providers. Soon enough you'll find a Provider wrapper hell.
- When you order the providers vertically, you can’t dynamically choose to depend on each other without changing the order, which might break things.
- Context doesn't support selectors, render bailout, or debouncing

## Feedback / Contributing:
We would love your feedback / suggestions
Please open an issue for discussion before submitting a PR
Thanks
