export const APP_NAME = "Adishri Capitals";

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

export const LOAN_STATUS = {
  PENDING_PAYMENT: "Pending Payment Verification",
  PENDING_KYC: "Pending KYC Verification",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  DISBURSED: "Disbursed",
  REJECTED: "Rejected",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  USER_DASHBOARD: "/dashboard",
  LOAN_APPLICATION: "/apply",
  PROCESSING_FEE: "/processing-fee",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_LEADS: "/admin/leads",
  ADMIN_REPAYMENTS: "/admin/repayments",
} as const;

export const PROCESSING_FEE_AMOUNT = 49;
export const ADMIN_UPI_ID = "adishricapitals@ybl"; // Mock UPI ID
