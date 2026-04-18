export type LoanStatus = "active" | "closed" | "defaulted";

export interface Loan {
  id: string;
  loanId: string;       // human-readable ID, e.g. "L-48271"
  applicationId: string; // links back to the applications collection
  userId: string;        // Firebase Auth UID of the borrower
  totalAmount: number;   // principal disbursed
  interestRate: number;  // percentage, e.g. 12 means 12%
  totalPayable: number;  // totalAmount + interest
  remainingBalance: number;
  status: LoanStatus;
  disbursedAt: string;   // ISO date string
  createdAt: string;
}
