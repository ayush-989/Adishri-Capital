import { useState, useEffect } from "react";
import { subscribeToPendingRepayments } from "../lib/services/transaction.service";
import type { Transaction } from "../lib/models/transaction.model";

export const usePendingRepayments = () => {
  const [repayments, setRepayments] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToPendingRepayments(setRepayments);
    return () => unsubscribe();
  }, []);

  return repayments;
};
