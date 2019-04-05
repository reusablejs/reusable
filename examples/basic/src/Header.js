import React from "react";
import {useReuse} from 'reusable';
import {counter} from './reusables/counter';

export function Header() {
  const [counterVal] = useReuse(counter);

  return (
    <div>
        {counterVal}
    </div>
  );
}
