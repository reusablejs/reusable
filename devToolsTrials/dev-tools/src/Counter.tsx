import useCounter from "./useCounter";
import useSomething from "./useSomethingElse";

const Counter = () => {
  const { counter, increment, decrement } = useCounter();
  const { something } = useSomething();
  return (
    <div>
      <div>{counter}</div>
      <button
        onClick={() => {
          increment();
        }}
      >
        increment
      </button>
      <button
        onClick={() => {
          decrement();
        }}
      >
        decrement
      </button>
    </div>
  );
};

export default Counter;
