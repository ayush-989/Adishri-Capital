import { useState, useEffect } from "react";
import { subscribeToPendingRepayments } from "../lib/services/transaction.service";
import type { Transaction } from "../lib/models/transaction.model";

export const usePendingRepayments = () => {
  const [repayments, setRepayments] = useState<Transaction[]>([]);

  useEffect(() => {
    console.log("[usePendingRepayments] Subscribing to pending repayments...");
    const unsubscribe = subscribeToPendingRepayments((txns) => {
      console.log(`[usePendingRepayments] Received ${txns.length} pending repayments`);
      console.log("[usePendingRepayments] Data:", JSON.stringify(txns.map(t => ({ id: t.id, loanId: t.loanId, amount: t.amount, verified: t.verified }))));
      setRepayments(txns);
    });
    return () => unsubscribe();
  }, []);

  return repayments;
};
