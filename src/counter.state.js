import { reuseState } from "./reuse";

export const useCounterState = () => {
  const [counter, dispatch] = reuseState("ui.counter", (state, action) => {
    switch (action.type) {
      case "DECREMENT":
        return state - 1;
      case "INCREMENT":
        return state + 1;
      default:
        return state;
    }
  });

  return {
    counter,
    decrement: () => dispatch({ type: "DECREMENT" }),
    increment: () => dispatch({ type: "INCREMENT" })
  };
};
