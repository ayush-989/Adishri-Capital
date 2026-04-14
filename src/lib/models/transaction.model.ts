export type TransactionType = "fee" | "repayment";

export interface Transaction {
  id: string;
  txnId: string;
  loanId: string;
  amount: number;
  utr: string;
  screenshotUrl: string;
  type: TransactionType;
  verified: boolean;
  createdAt: string;
}
