import { useMemo } from "react";
import { useGlobalState } from "./useGlobalState";

export const useTransactions = () => {
  const [transactions = [], setTransactions] = useGlobalState("transactions");

  return {
    transactions,
    addTransaction: amount => setTransactions([...transactions, { amount }])
  };
};

export const useBalance = () => {
  const [transactions = []] = useGlobalState("transactions");
  return useMemo(
    () => transactions.reduce((sum, { amount }) => amount + sum, 0),
    [transactions]
  );
};
