import { createStore } from "./src/react-reusable";
import { useState } from "react";

const useCounter = createStore(function useCounter() {
  const [counter, setCounter] = useState(0);

  return {
    counter,
    increment: () => setCounter((prev) => prev + 1),
    decrement: () => setCounter((prev) => prev - 1),
  };
});

export default useCounter;
