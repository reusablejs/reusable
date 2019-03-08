import { useMemo } from "react";
import { reuse } from "./reuse";
import { useCounterState } from "./counter.state";

export const useTransactions = reuse(reuseState => {
  const [transactions, setTransactions] = reuseState([]);

  return {
    transactions,
    addTransaction: amount => setTransactions(prev => [...prev, { amount }])
  };
});

export const useCurTransaction = () => {
  const { counter } = useCounterState();
  const { transactions } = useTransactions();

  return transactions[counter];
};

export const useBalance = () => {
  const { transactions } = useTransactions();

  return useMemo(
    () => transactions.reduce((sum, { amount }) => amount + sum, 0),
    [transactions]
  );
};
