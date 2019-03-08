import React from "react";
import { useCounterState } from "./counter.state";
import {
  useTransactions,
  useBalance,
  useCurTransaction
} from "./transactions.state";

export const One = () => {
  const { counter, decrement } = useCounterState();
  const { transactions, addTransaction } = useTransactions();
  const curTransaction = useCurTransaction();
  const balance = useBalance();

  return (
    <div>
      {counter}
      <button onClick={decrement}>Decrement</button>
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
