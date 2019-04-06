import { reuseState, reuseCallback, reuseMemo, Memo } from "reusable";

export const counterUnit = Memo(() => {
  const [counter, setCounter] = reuseState(0);
  
  return {
    counter: reuseMemo(() => Math.floor(counter / 5)),
    increment: reuseCallback(() => setCounter(prev => prev + 1), [setCounter])
  };
});
