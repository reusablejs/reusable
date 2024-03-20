import React from "react";
import {useCounter} from './stores/counter.store';

export function Footer() {
  const [counter, setCounter] = useCounter();

  return (
    <div>
        <input autoFocus value={counter} onChange={e => setCounter(e.target.value)}/>
    </div>
  );
}
