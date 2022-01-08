import useCounter from "./useCounter";

const Counter = () => {
  const { counter, increment, decrement } = useCounter();
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
