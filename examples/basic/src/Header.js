import React from "react";
import {useCounter} from './units/counter.unit';

export function Header() {
  const [counter] = useCounter();

  return (
    <div>
        {counter}
    </div>
  );
}
