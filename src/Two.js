import React, { useMemo } from "react";
import { useCounterState } from "./counter.state";

const Two = () => {
  console.log("ui.counter");

  const { counter, increment } = useCounterState();

  return (
    <div>
      {counter}
      <button onClick={increment}>Increment</button>
    </div>
  );
};

export default Two;
