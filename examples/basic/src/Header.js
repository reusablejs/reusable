import React from "react";
import {useReuse} from 'reusable';
import {counterUnit} from './units/counter.unit';

export function Header() {
  const [counter] = useReuse(counterUnit);

  return (
    <div>
        {counter}
    </div>
  );
}
