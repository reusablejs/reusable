Go here:  
[https://reusablejs.github.io/reusable](https://reusablejs.github.io/reusable)

# tl;dr
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
