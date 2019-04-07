import React from "react";
import {useReuse} from 'reusable';
import {counter} from './reusables/counter';

export function Footer() {
  const [counterVal, setCounter] = useReuse(counter);

  return (
    <div>
        <input value={counterVal} onChange={e => setCounter(e.target.value)}/>
    </div>
  );
}
