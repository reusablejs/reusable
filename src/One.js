import React from "react";
import { useGlobalState } from "./useGlobalState";
import { useTransactions, useBalance } from "./transactions.state";

const One = () => {
  const [uiState, setUiState] = useGlobalState("ui");
  const { transactions, addTransaction } = useTransactions();
  const balance = useBalance();

  const onClick = () =>
    setUiState({ ...uiState, counter: uiState.counter - 1 });

  return (
    <div>
      {uiState.counter}
      <button onClick={onClick}>Decrement</button>
      <button onClick={() => addTransaction(Math.round(Math.random() * 100))}>
        Add Transaction
      </button>
      <h1>Balance {balance}</h1>
      {transactions.map(({ amount }) => (
        <div>{amount}</div>
      ))}
    </div>
  );
};

export default One;
