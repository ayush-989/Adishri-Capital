import { updateApplication, getAllApplications } from "../services/application.service";
import { updateTransaction, getAllTransactions } from "../services/transaction.service";
import { getUserCount } from "../services/user.service";
import { calculateTotalPayable } from "../../utils/helpers";
import { LOAN_STATUS } from "../../utils/constants";

export const verifyProcessingFee = async (appId: string, txnId: string): Promise<void> => {
  await updateTransaction(txnId, { verified: true, status: "approved" });
  await updateApplication(appId, { status: LOAN_STATUS.PENDING_KYC });
};

export const approveKyc = (appId: string) =>
  updateApplication(appId, { status: LOAN_STATUS.PENDING_APPROVAL });

export const rejectApplication = (appId: string) =>
  updateApplication(appId, { status: LOAN_STATUS.REJECTED });

export const approveLoan = (appId: string, amount: number, rate: number) => {
  const remainingBalance = calculateTotalPayable(amount, rate);
  return updateApplication(appId, {
    status: LOAN_STATUS.APPROVED,
    finalAmount: amount,
    finalInterestRate: rate,
    remainingBalance,
  });
};

export const disburseLoan = (appId: string) =>
  updateApplication(appId, { status: LOAN_STATUS.DISBURSED });

export const verifyRepayment = async (txnId: string, loanId: string, amount: number): Promise<void> => {
  await updateTransaction(txnId, { verified: true, status: "approved" });

  const { getApplication } = await import("../services/application.service");
  const loan = await getApplication(loanId);
  if (!loan) return;

  const currentBalance = loan.remainingBalance ?? loan.finalAmount ?? 0;
  const newBalance = Math.max(0, currentBalance - amount);
  await updateApplication(loanId, { remainingBalance: newBalance });
};

/**
 * Reject a repayment transaction.
 * Sets status = "rejected" and stores the admin's reason.
 * Does NOT touch verified (stays false) or the loan balance.
 */
export const rejectRepayment = (txnId: string, reason: string): Promise<void> =>
  updateTransaction(txnId, {
    status: "rejected",
    rejectionReason: reason.trim(),
  });

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalExposure: number;
  activeLoans: number;
  pendingRecoveries: number;
  totalRecovered: number;
  totalUsers: number;
  pendingVerifications: number;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const [apps, txns, totalUsers] = await Promise.all([
    getAllApplications(),
    getAllTransactions(),
    getUserCount(),
  ]);

  const DISBURSED = [LOAN_STATUS.DISBURSED, "Disbursed", "disbursed"];
  const PENDING   = [
    LOAN_STATUS.PENDING_PAYMENT, "Pending Payment Verification",
    LOAN_STATUS.PENDING_KYC,     "Pending KYC Verification",
    LOAN_STATUS.PENDING_APPROVAL,"Pending Approval",
  ];

  let totalExposure = 0, pendingRecoveries = 0, activeLoans = 0, pendingVerifications = 0;

  apps.forEach((app) => {
    if (DISBURSED.includes(app.status)) {
      activeLoans++;
      totalExposure     += app.finalAmount ?? 0;
      pendingRecoveries += app.remainingBalance ?? app.finalAmount ?? 0;
    }
    if (PENDING.includes(app.status)) pendingVerifications++;
  });

  const totalRecovered = txns
    .filter((t) => t.verified && t.type === "repayment")
    .reduce((sum, t) => sum + t.amount, 0);

  return { totalExposure, activeLoans, pendingRecoveries, totalRecovered, totalUsers, pendingVerifications };
};
