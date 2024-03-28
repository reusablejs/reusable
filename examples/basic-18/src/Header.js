import React from "react";
import {useCounter} from './stores/counter.store';

export function Header() {
  const [counter] = useCounter();

  return (
    <div>
        {counter}
    </div>
  );
}
