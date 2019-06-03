Go here:  
[https://reusablejs.github.io/reusable](https://reusablejs.github.io/reusable)

# tl;dr
Reusable is a library for sharing state and side-effects between components using hooks.
Just wrap your custom hooks with `reusable` and you're good to go.

```javascript
const useSomething = reusable(() => {
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
Using plain context has some drawbacks, that led us to write this library:
- When managing global state using Context in a large app, you will probably have many small, single-purpose providers. Soon enough you'll find a Provider wrapper hell.
- When you order the providers vertically, you can’t dynamically choose to depend on each other without changing the order, which might break things.
- Context doesn't support selectors, render bailout, or debouncing
