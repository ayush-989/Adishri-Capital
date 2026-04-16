import { updateApplication, getAllApplications } from "../services/application.service";
import { updateTransaction, getAllTransactions } from "../services/transaction.service";
import { getUserCount } from "../services/user.service";
import { calculateTotalPayable } from "../../utils/helpers";
import { LOAN_STATUS } from "../../utils/constants";

export const verifyProcessingFee = async (appId: string, txnId: string): Promise<void> => {
  console.log(`[admin.controller] verifyProcessingFee called: appId=${appId}, txnId=${txnId}`);
  await updateTransaction(txnId, { verified: true });
  console.log(`[admin.controller] Transaction ${txnId} verified`);
  await updateApplication(appId, { status: LOAN_STATUS.PENDING_KYC });
  console.log(`[admin.controller] Application ${appId} status updated to PENDING_KYC`);
};

export const approveKyc = (appId: string) => {
  console.log(`[admin.controller] approveKyc called: appId=${appId}`);
  return updateApplication(appId, { status: LOAN_STATUS.PENDING_APPROVAL });
};

export const rejectApplication = (appId: string) => {
  console.log(`[admin.controller] rejectApplication called: appId=${appId}`);
  return updateApplication(appId, { status: LOAN_STATUS.REJECTED });
};

export const approveLoan = (appId: string, amount: number, rate: number) => {
  const remainingBalance = calculateTotalPayable(amount, rate);
  console.log(`[admin.controller] approveLoan called: appId=${appId}, amount=${amount}, rate=${rate}, totalPayable=${remainingBalance}`);
  return updateApplication(appId, {
    status: LOAN_STATUS.APPROVED,
    finalAmount: amount,
    finalInterestRate: rate,
    remainingBalance,
  });
};

export const disburseLoan = (appId: string) => {
  console.log(`[admin.controller] disburseLoan called: appId=${appId}`);
  return updateApplication(appId, { status: LOAN_STATUS.DISBURSED });
};

export const verifyRepayment = async (txnId: string, loanId: string, amount: number): Promise<void> => {
  console.log(`[admin.controller] verifyRepayment called: txnId=${txnId}, loanId=${loanId}, amount=${amount}`);
  await updateTransaction(txnId, { verified: true });
  console.log(`[admin.controller] Transaction ${txnId} verified`);

  const { getApplication } = await import("../services/application.service");
  const loan = await getApplication(loanId);
  if (!loan) {
    console.error(`[admin.controller] Loan not found: ${loanId}`);
    return;
  }

  const currentBalance = loan.remainingBalance ?? loan.finalAmount ?? 0;
  const newBalance = Math.max(0, currentBalance - amount);
  console.log(`[admin.controller] Balance update: ${currentBalance} -> ${newBalance}`);
  await updateApplication(loanId, { remainingBalance: newBalance });
  console.log(`[admin.controller] Loan ${loanId} remainingBalance updated`);
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
  console.log("[admin.controller] fetchDashboardStats: Starting...");

  const [apps, txns, totalUsers] = await Promise.all([
    getAllApplications(),
    getAllTransactions(),
    getUserCount(),
  ]);

  console.log(`[admin.controller] fetchDashboardStats: apps=${apps.length}, txns=${txns.length}, totalUsers=${totalUsers}`);
  console.log("[admin.controller] Applications:", JSON.stringify(apps.map(a => ({ id: a.id, status: a.status, finalAmount: a.finalAmount, remainingBalance: a.remainingBalance }))));
  console.log("[admin.controller] Transactions:", JSON.stringify(txns.map(t => ({ id: t.id, type: t.type, amount: t.amount, verified: t.verified }))));

  let totalExposure = 0;
  let pendingRecoveries = 0;
  let activeLoans = 0;
  let pendingVerifications = 0;

  // Support both "Disbursed" and LOAN_STATUS.DISBURSED formats
  const DISBURSED_STATUSES = [LOAN_STATUS.DISBURSED, "Disbursed", "disbursed"];
  const PENDING_STATUSES = [
    LOAN_STATUS.PENDING_PAYMENT, "Pending Payment Verification",
    LOAN_STATUS.PENDING_KYC, "Pending KYC Verification", 
    LOAN_STATUS.PENDING_APPROVAL, "Pending Approval"
  ];

  apps.forEach((app) => {
    const isDisbursed = DISBURSED_STATUSES.includes(app.status);
    const isPending = PENDING_STATUSES.includes(app.status);
    
    if (isDisbursed) {
      activeLoans++;
      totalExposure += app.finalAmount ?? 0;
      pendingRecoveries += app.remainingBalance ?? app.finalAmount ?? 0;
    }
    if (isPending) {
      pendingVerifications++;
    }
  });

  const totalRecovered = txns
    .filter((t) => t.verified && t.type === "repayment")
    .reduce((sum, t) => sum + t.amount, 0);

  console.log(`[admin.controller] fetchDashboardStats: totalExposure=${totalExposure}, pendingRecoveries=${pendingRecoveries}, totalRecovered=${totalRecovered}, activeLoans=${activeLoans}, pendingVerifications=${pendingVerifications}`);

  return { totalExposure, activeLoans, pendingRecoveries, totalRecovered, totalUsers, pendingVerifications };
};
