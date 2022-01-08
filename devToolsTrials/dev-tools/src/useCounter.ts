import { createStore } from "./src/react-reusable";
import { useState, useEffect } from "react";

const useCounter = createStore(() => {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    console.log(`counter state: ${counter}`);
  });
  // const isOdd = useMemo(...);

  return {
    counter,
    increment: () => setCounter((prev) => prev + 1),
    decrement: () => setCounter((prev) => prev - 1),
  };
});

export default useCounter;
