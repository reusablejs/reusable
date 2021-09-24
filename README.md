[![Build Status](https://circleci.com/gh/reusablejs/reusable.svg?style=svg)](https://circleci.com/gh/reusablejs/reusable)
[![npm version](https://badge.fury.io/js/reusable.svg)](https://badge.fury.io/js/reusable)

# Reusable - state management with hooks
<img src="https://github.com/reusablejs/reusable/blob/master/website/static/img/reusable.png?raw=true" width="120"/>

- Use hooks to manage the store
  - One paradigm for both local and shared state
  - Easier transition between the two
- Use a single context provider and avoid nesting dozens of providers
- Allow direct subscriptions with selectors for better re-render control


# How to use
Pass a custom hook to `createStore`:

```javascript
const useCounter = createStore(() => {
  const [counter, setCounter] = useState(0);
  useEffect(...)
  const isOdd = useMemo(...);

  return {
    counter,
    isOdd,
    increment: () => setCounter(prev => prev + 1)
    decrement: () => setCounter(prev => prev - 1)
  }
});
```

and get a singleton store, with a hook that subscribes directly to that store:
```javascript
const MyComponent = () => {
  const {counter, increment, decrement} = useCounter();
}

const AnotherComponent = () => {
  const {counter, increment, decrement} = useCounter(); // same counter
}
```

then wrap your app with a provider:
```javascript
const App = () => (
  <ReusableProvider>
    ...
  </ReusableProvider>
)
```

Note there is no need to provide the store. Stores automatically plug into the top provider

## Selectors
For better control over re-renders, use selectors:

```javascript
const Comp1 = () => {
  const isOdd = useCounter(state => state.isOdd);
}
```
Comp1 will only re-render if counter switches between odd and even

useCounter can take a second parameter that will override the comparison function (defaults to shallow compare): 
```javascript
const Comp1 = () => {
  const counter = useCounter(state => state, (prevValue, newValue) => prevValue === newValue);
}
```


## Using stores from other stores
Each store can use any other store similar to how components use them:
```javascript
const useCurrentUser = createStore(() => ...);
const usePosts = createStore(() => ...);

const useCurrentUserPosts = createStore(() => {
  const currentUser = useCurrentUser();
  const posts = usePosts();
  
  return ...
});
```

# Demos
**basic**  
<a target="blank" href="https://codesandbox.io/s/github/reusablejs/reusable/tree/master/examples/basic?fontsize=14&module=%2Fsrc%2Findex.js">
  <img alt="Edit basic" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

**TodoMVC**  

<a target="blank" href="https://codesandbox.io/s/github/reusablejs/reusable/tree/master/examples/todomvc?fontsize=14&module=%2Fsrc%2Findex.js">
  <img alt="Edit basic" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>

# How does this compare to other state management solutions?
Current state management solutions don't let you manage state using hooks, which causes you to manage local and global state differently, and have a costly transition between the two.

Reusable solves this by seemingly transforming your custom hooks into global stores.

## What about hooks+Context?
Using plain context has some drawbacks and limitations, that led us to write this library:
- Context doesn't support selectors, render bailout, or debouncing
- When managing global state using Context in a large app, you will probably have many small, single-purpose providers. Soon enough you'll find a Provider wrapper hell.
- When you order the providers vertically, you can’t dynamically choose to depend on each other without changing the order, which might break things.

# How does it work
React hooks must run inside a component, and our store is based on a custom hook.  
So in order to have a store that uses a custom hook, we need to create a "host component" for each of our stores.  
The `ReusableProvider` component renders a `Stores` component, under which it will render one "host component" per store, which only runs the store's hook, and renders nothing to the DOM. Then, it uses an effect to update all subscribers with the new value. 
We use plain pubsub stores under the hood, and do shallowCompare on selector values to decide if we re-render the subscribing component or not.

Notice that the `ReusableProvider` uses a Context provider at the top-level, but it provides a stable ref that never changes. This means that changing store values, and even dynamically adding stores won't re-render your app.

## Feedback / Contributing:
We would love your feedback / suggestions
Please open an issue for discussion before submitting a PR
Thanks
