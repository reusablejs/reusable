import { useGlobalState } from "./useGlobalState";

export const useCounterState = () => {
  const [counter, setCounter] = useGlobalState("ui.counter");

  return {
    counter,
    decrement: () => setCounter(counter - 1),
    increment: () => setCounter(counter + 1)
  };
};
