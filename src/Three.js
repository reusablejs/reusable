import React from "react";
import { useGlobalState } from "./useGlobalState";

const Three = () => {
  console.log("ui.random");
  const [random, setRandom] = useGlobalState("ui.random");
  const onClick = () => setRandom(Math.round(Math.random() * 10));
  return (
    <div>
      {random}
      <button onClick={onClick}>Random</button>
    </div>
  );
};

export default Three;
