import React from "react";
import {useReuse} from 'reusable';
import {counterUnit} from './units/counter.unit';

export function Footer() {
  const [counter, setCounter] = useReuse(counterUnit);

  return (
    <div>
        <input autoFocus value={counter} onChange={e => setCounter(e.target.value)}/>
    </div>
  );
}
