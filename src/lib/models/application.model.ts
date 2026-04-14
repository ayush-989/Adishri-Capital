export interface BasicDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
}

export interface KycDetails {
  panNumber: string;
  aadhaarNumber: string;
  accountNumber: string;
  ifsc: string;
  panUrl: string;
  aadhaarFrontUrl: string;
  aadhaarBackUrl: string;
  passbookUrl: string;
}

export interface LoanApplication {
  id: string;
  appId: string;
  status: string;
  basicDetails: BasicDetails;
  kycDetails: KycDetails;
  finalAmount?: number;
  finalInterestRate?: number;
  remainingBalance?: number;
  createdAt: string;
}
