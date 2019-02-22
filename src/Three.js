import React from "react";
import { reuseState } from "./reuse";
import { Input, useInputState } from "./Controlled";

export const Three = () => {
  const [random, setRandom] = reuseState("ui.random");
  const inputState = useInputState("forms.user.0");
  const onClick = () => setRandom(Math.round(Math.random() * 10));
  return (
    <div>
      {random}
      <button onClick={onClick}>Random</button>
      {inputState.value}
      <Input {...inputState} placeholder="Controlled" />
    </div>
  );
};
