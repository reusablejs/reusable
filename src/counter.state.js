import { reuse } from "./reuse";

export const useCounterState = reuse(reuseState => {
  const [counter, setCounter] = reuseState(0);
  // const [counter, dispatch] = reuseState(0, (state, action) => {
  //   switch (action.type) {
  //     case "DECREMENT":
  //       return state - 1;
  //     case "INCREMENT":
  //       return state + 1;
  //     default:
  //       return state;
  //   }
  // });

  return {
    counter,
    decrement: () => setCounter(val => val - 1),
    increment: () => setCounter(val => val + 1)
    // decrement: () => dispatch({ type: "DECREMENT" }),
    // increment: () => dispatch({ type: "INCREMENT" })
  };
});
