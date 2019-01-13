import React from "react";
import { useGlobalState } from "./useGlobalState";

const One = () => {
  console.log("ui");

  const [uiState, setUiState] = useGlobalState("ui");
  const onClick = () =>
    setUiState({ ...uiState, counter: uiState.counter - 1 });
  return (
    <div>
      {uiState.counter}
      <button onClick={onClick}>Decrement</button>
    </div>
  );
};

export default One;
