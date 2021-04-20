[![Build Status](https://circleci.com/gh/reusablejs/reusable.svg?style=svg)](https://circleci.com/gh/reusablejs/reusable)
[![npm version](https://badge.fury.io/js/reusable.svg)](https://badge.fury.io/js/reusable)

# Reusable
<img src="https://github.com/reusablejs/reusable/blob/master/website/static/img/reusable.png?raw=true" width="120"/>

Reusable is a simple solution for state management in modern React applications.  

It is built on 2 main principles:
1. Use hooks to manage the global state (as opposed to just using hooks to subscribe to the state)
2. Allow to build libraries that use global state, and easily use that state from apps

# Motivation
## Hooks
State management needs to manage an immutable state, handle side-effects and memoization. Hooks already provide all these:
- immutable state: useState/useReducer
- side-effects: useEffect/useLayoutEffect
- memoization: useMemo/useCallback

So why invent a new paradigm for global state if we already have it for local state?
Reusable allows you to build stores using regular React hooks, and adds a layer of direct subscriptions and selectors. This way you can use any custom hooks you already have inside your stores. It's also easier to migrate from local state to global state, which is something that happens frequently when developing frontend applications.

## Libraries
One caveat of state management solutions is that it's hard to reuse libraries that have their own state management solutions built-in. Reusable allows to easily collaborate between libraries and your app, since all global state uses plain hooks. See more examples in this document.

# How to use
Pass a custom hook to `createStore`:

```javascript
const useCounter = createStore(() => {
  const [counter, setCounter] = useState(0);
  
  return {
    counter,
    increment: () => setCounter(prev => prev + 1)
  }
});
```

and get a singleton store, with a hook that subscribes directly to that store:
```javascript
const Comp1 = () => {
  const something = useCounter();
}

const Comp2 = () => {
  const something = useCounter(); // same counter
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
To make sure your components only re-render when stuff they need change, you can use selectors:  

```javascript
const Comp1 = () => {
  const isPositive = useCounter(state => state.counter > 0);
}
```
Comp1 will only re-render if counter switches between positive and negative


## Using stores from other stores
Every store can use any other store, without worrying about provider order (as opposed to using React Context).  
Just use the store's hook inside the other store:
```javascript
const useCurrentUser = createStore(() => ...);
const usePosts = createStore(() => ...);

const useCurrentUserPosts = createStore(() => {
  const currentUser = useCurrentUser();
  const posts = usePosts();
  
  return ...
});
```

## Libraries
Imagine a `reusable-i18n` library, that use Reusable, and manages a global state (current locale).
This is easily done with Reusable:

```
import {LocaleSwitcher, useTranslate} from 'reusable-i18n';

const App = () => {
  const translate = useTranslate();
  
  return <div>
    <h1>{translate('title')}</h1>
    <h2>{translate('subTitle')}</h2>
    <LocaleSwitcher/>
  </div>
}

...
ReactDOM.render(
  <ReusableProvider>
    <App />
  </ReusableProvider>,
  rootElement
);

```

In this example, App is unaware how reusable-i18n manages the state. The reactivity model is based on immutable data, like hooks, and there is no need to do any specific initialization, except for putting ReusableProvider around our app.

# Why do we need (yet) another state management library?
Most current state management solutions don't let you manage state using hooks, which causes you to manage local and global state differently, and have a costly transition between the two.

Reusable solves this by seemingly transforming your custom hooks into global stores.

# What about hooks+Context?
Using plain context has some drawbacks and limitations, that led us to write this library:
- Context doesn't support selectors, render bailout, or debouncing
- When managing global state using Context in a large app, you will probably have many small, single-purpose providers. Soon enough you'll find a Provider wrapper hell.
- When you order the providers vertically, you can’t dynamically choose to depend on each other without changing the order, which might break things.

# How does it work
React hooks must run inside a component, and our store is based on a custom hook.  
So in order to have a store that uses a custom hook, we need to create a component for each of our stores.  
The `ReusableProvider` component renders a `Stores` component, under which it will render one component per store, which only runs the store's hook, and renders nothing to the DOM. Then, it uses an effect to update all subscribers with the new value. 

Notice that the `ReusableProvider` uses a Context provider at the top-level, but it provides a stable ref that never changes. This means that changing store values, and even dynamically adding stores won't re-render your app.

# Docs
Check out the docs here:
[https://reusablejs.github.io/reusable/docs/basic-usage.html](https://reusablejs.github.io/reusable/docs/basic-usage.html)


## Feedback / Contributing:
We would love your feedback / suggestions
Please open an issue for discussion before submitting a PR
Thanks
