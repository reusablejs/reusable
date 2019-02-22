import React from "react";
import { reuseState } from "./reuse";
import {
  useTransactions,
  useBalance,
  useCurTransaction
} from "./transactions.state";

const One = () => {
  const [uiState, setUiState] = reuseState("ui");
  const { transactions, addTransaction } = useTransactions();
  const curTransaction = useCurTransaction();
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
      {curTransaction ? curTransaction.amount : 0}
      <h1>Balance {balance}</h1>
      {transactions.map(({ amount }, index) => (
        <div key={index}>{amount}</div>
      ))}
    </div>
  );
};

export default One;
