import React from "react";
import {useReuse} from "reusable";
import {counterUnit} from './units/counter.unit';

export function Footer() {
  const {increment} = useReuse(counterUnit);
  console.log('render');
  return (
    <div>
        <button onClick={increment}>+</button>
    </div>
  );
}
