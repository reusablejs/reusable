import React from "react";
import {useCounter} from './units/counter.unit';

export function Footer() {
  const [counter, setCounter] = useCounter();

  return (
    <div>
        <input autoFocus value={counter} onChange={e => setCounter(e.target.value)}/>
    </div>
  );
}
