import React, { useMemo } from "react";
import { useCounterState } from "./counter.state";

export const Two = () => {
  const { counter, increment } = useCounterState();

  return (
    <div>
      {counter}
      <button onClick={increment}>Increment</button>
    </div>
  );
};
