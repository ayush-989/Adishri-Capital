import { updateApplication, getAllApplications } from "../services/application.service";
import { updateTransaction, getAllTransactions } from "../services/transaction.service";
import { getUserCount } from "../services/user.service";
import { createLoan, updateLoan, getLoan } from "../services/loan.service";
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

/**
 * Mark application as Disbursed AND create a corresponding loans document.
 * The loans collection is what LoansPage / UsersPage / UserDetails read from.
 */
export const disburseLoan = async (appId: string): Promise<void> => {
  const { getApplication } = await import("../services/application.service");
  const app = await getApplication(appId);
  if (!app) throw new Error(`Application not found: ${appId}`);

  const totalPayable = calculateTotalPayable(
    app.finalAmount ?? 0,
    app.finalInterestRate ?? 0
  );

  await Promise.all([
    updateApplication(appId, { status: LOAN_STATUS.DISBURSED }),
    createLoan(appId, {
      loanId:           app.appId,
      applicationId:    appId,
      userId:           app.userId ?? "",
      totalAmount:      app.finalAmount ?? 0,
      interestRate:     app.finalInterestRate ?? 0,
      totalPayable,
      remainingBalance: app.remainingBalance ?? totalPayable,
      status:           "active",
      disbursedAt:      new Date().toISOString(),
      createdAt:        new Date().toISOString(),
    }),
  ]);
};

export const rejectRepayment = async (txnId: string, reason: string): Promise<void> => {
  await updateTransaction(txnId, {
    verified: false,
    status: "rejected",
    rejectionReason: reason,
  } as any);
};

export const verifyRepayment = async (
  txnId: string,
  loanId: string,
  amount: number
): Promise<void> => {
  await updateTransaction(txnId, { verified: true });

  // Update remaining balance on the loans document (primary source of truth)
  const loan = await getLoan(loanId);
  if (loan) {
    const newBalance = Math.max(0, loan.remainingBalance - amount);
    await updateLoan(loanId, {
      remainingBalance: newBalance,
      status: newBalance === 0 ? "closed" : "active",
    });
  }

  // Also keep application.remainingBalance in sync for the user dashboard
  const { getApplication } = await import("../services/application.service");
  const app = await getApplication(loanId);
  if (app) {
    const currentBalance = app.remainingBalance ?? app.finalAmount ?? 0;
    await updateApplication(loanId, {
      remainingBalance: Math.max(0, currentBalance - amount),
    });
  }
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

  console.log("Loans:", apps.filter(a => a.status === LOAN_STATUS.DISBURSED));
  console.log("Transactions:", txns);

  const DISBURSED_STATUSES = [LOAN_STATUS.DISBURSED, "Disbursed", "disbursed"];
  const PENDING_STATUSES = [
    LOAN_STATUS.PENDING_PAYMENT,
    LOAN_STATUS.PENDING_KYC,
    LOAN_STATUS.PENDING_APPROVAL,
  ];

  let totalExposure = 0;
  let pendingRecoveries = 0;
  let activeLoans = 0;
  let pendingVerifications = 0;

  apps.forEach((app) => {
    if (DISBURSED_STATUSES.includes(app.status)) {
      activeLoans++;
      totalExposure += app.finalAmount ?? 0;
      pendingRecoveries += app.remainingBalance ?? app.finalAmount ?? 0;
    }
    if (PENDING_STATUSES.includes(app.status)) {
      pendingVerifications++;
    }
  });

  const totalRecovered = txns
    .filter((t) => t.verified && t.type === "repayment")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalExposure,
    activeLoans,
    pendingRecoveries,
    totalRecovered,
    totalUsers,
    pendingVerifications,
  };
};
