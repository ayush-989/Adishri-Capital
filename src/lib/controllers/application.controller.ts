import { uploadFile } from "../firebase/storage";
import { createApplication, getApplication, findApplicationByPhoneAndPan } from "../services/application.service";
import { createTransaction } from "../services/transaction.service";
import { generateLoanId, generateTxnId } from "../../utils/helpers";
import { LOAN_STATUS, PROCESSING_FEE_AMOUNT } from "../../utils/constants";
import type { BasicDetails, KycDetails } from "../models/application.model";

interface KycFiles {
  panImage: File;
  aadhaarFront: File;
  aadhaarBack: File;
  passbook: File;
}

export const submitLoanApplication = async (
  basicDetails: BasicDetails,
  kycDetails: Omit<KycDetails, "panUrl" | "aadhaarFrontUrl" | "aadhaarBackUrl" | "passbookUrl">,
  files: KycFiles
): Promise<string> => {
  const loanId = generateLoanId();

  const [panUrl, aadhaarFrontUrl, aadhaarBackUrl, passbookUrl] = await Promise.all([
    uploadFile(files.panImage, `kyc/${loanId}/pan`),
    uploadFile(files.aadhaarFront, `kyc/${loanId}/aadhaarFront`),
    uploadFile(files.aadhaarBack, `kyc/${loanId}/aadhaarBack`),
    uploadFile(files.passbook, `kyc/${loanId}/passbook`),
  ]);

  await createApplication(loanId, {
    appId: loanId,
    status: LOAN_STATUS.PENDING_PAYMENT,
    basicDetails,
    kycDetails: { ...kycDetails, panUrl, aadhaarFrontUrl, aadhaarBackUrl, passbookUrl },
    createdAt: new Date().toISOString(),
  });

  return loanId;
};

export const trackApplication = (id: string) =>
  getApplication(id.trim().toUpperCase());

export const trackByDetails = (phone: string, pan: string) =>
  findApplicationByPhoneAndPan(phone.trim(), pan.trim().toUpperCase());

export const submitProcessingFee = async (
  loanId: string,
  utr: string,
  screenshot: File
): Promise<void> => {
  const txnId = generateTxnId();
  const screenshotUrl = await uploadFile(screenshot, `payments/${loanId}/${txnId}`);

  await createTransaction(txnId, {
    txnId,
    loanId,
    amount: PROCESSING_FEE_AMOUNT,
    utr,
    screenshotUrl,
    type: "fee",
    verified: false,
    createdAt: new Date().toISOString(),
  });
};

export const submitRepayment = async (
  loanId: string,
  amount: number,
  utr: string,
  screenshot: File
): Promise<void> => {
  const txnId = generateTxnId();
  const screenshotUrl = await uploadFile(screenshot, `repayments/${loanId}/${txnId}`);

  await createTransaction(txnId, {
    txnId,
    loanId,
    amount,
    utr,
    screenshotUrl,
    type: "repayment",
    verified: false,
    createdAt: new Date().toISOString(),
  });
};

