import { useMemo } from "react";
import { reuseState } from "./reuse";
import { useCounterState } from "./counter.state";

export const useTransactions = () => {
  const [transactions, setTransactions] = reuseState("transactions", []);

  return {
    transactions,
    addTransaction: amount => setTransactions(prev => [...prev, { amount }])
  };
};

export const useCurTransaction = () => {
  const { counter = 0 } = useCounterState();
  const [transactions = []] = reuseState("transactions", []);

  return transactions[counter];
};

export const useBalance = () => {
  const [transactions = []] = reuseState("transactions", []);
  return useMemo(
    () => transactions.reduce((sum, { amount }) => amount + sum, 0),
    [transactions]
  );
};
