export type TransactionType = "fee" | "repayment";
export type TransactionStatus = "pending" | "approved" | "rejected";

export interface Transaction {
  id: string;
  txnId: string;
  loanId: string;
  amount: number;
  utr: string;
  screenshotUrl: string;
  type: TransactionType;
  verified: boolean;
  status?: TransactionStatus;   // set on approval/rejection
  rejectionReason?: string;     // set only on rejection
  createdAt: string;
}
