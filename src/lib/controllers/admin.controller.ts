import { updateApplication, getAllApplications } from "../services/application.service";
import { updateTransaction, getFeeTransactionByLoanId, getAllTransactions } from "../services/transaction.service";
import { getUserCount } from "../services/user.service";
import { calculateTotalPayable } from "../../utils/helpers";
import { LOAN_STATUS } from "../../utils/constants";

export const verifyProcessingFee = async (appId: string, txnId: string): Promise<void> => {
  await updateTransaction(txnId, { verified: true });
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
  await updateTransaction(txnId, { verified: true });

  const { getApplication } = await import("../services/application.service");
  const loan = await getApplication(loanId);
  if (!loan) return;

  const currentBalance = loan.remainingBalance ?? loan.finalAmount ?? 0;
  const newBalance = Math.max(0, currentBalance - amount);
  await updateApplication(loanId, { remainingBalance: newBalance });
};

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

  let totalExposure = 0;
  let pendingRecoveries = 0;
  let activeLoans = 0;
  let pendingVerifications = 0;

  apps.forEach((app) => {
    if (app.status === LOAN_STATUS.DISBURSED) {
      activeLoans++;
      totalExposure += app.finalAmount ?? 0;
      pendingRecoveries += app.remainingBalance ?? app.finalAmount ?? 0;
    }
    if (
      app.status === LOAN_STATUS.PENDING_PAYMENT ||
      app.status === LOAN_STATUS.PENDING_KYC ||
      app.status === LOAN_STATUS.PENDING_APPROVAL
    ) {
      pendingVerifications++;
    }
  });

  const totalRecovered = txns
    .filter((t) => t.verified && t.type === "repayment")
    .reduce((sum, t) => sum + t.amount, 0);

  return { totalExposure, activeLoans, pendingRecoveries, totalRecovered, totalUsers, pendingVerifications };
};
