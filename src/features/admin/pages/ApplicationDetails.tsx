import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../../shared/components/ui/Card";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import { Spinner } from "../../../shared/components/ui/Spinner";
import { getApplication } from "../../../lib/services/application.service";
import { getFeeTransactionByLoanId } from "../../../lib/services/transaction.service";
import {
  verifyProcessingFee,
  approveKyc,
  rejectApplication,
  approveLoan,
  disburseLoan,
} from "../../../lib/controllers/admin.controller";
import { LOAN_STATUS, ROUTES } from "../../../utils/constants";
import { formatCurrency, calculateTotalPayable } from "../../../utils/helpers";
import type { LoanApplication } from "../../../lib/models/application.model";
import type { Transaction } from "../../../lib/models/transaction.model";

// ─── Status Progress ────────────────────────────────────────────────────────

const STEPS = [
  { label: "Payment",  status: LOAN_STATUS.PENDING_PAYMENT },
  { label: "KYC",      status: LOAN_STATUS.PENDING_KYC },
  { label: "Approval", status: LOAN_STATUS.PENDING_APPROVAL },
  { label: "Approved", status: LOAN_STATUS.APPROVED },
  { label: "Credited", status: LOAN_STATUS.DISBURSED },
] as const;

function getStepIndex(status: string) {
  const idx = STEPS.findIndex((s) => s.status === status);
  return idx === -1 ? STEPS.length : idx;
}

function StatusProgress({ status }: { status: string }) {
  const current = getStepIndex(status);
  const isRejected = status === LOAN_STATUS.REJECTED;

  if (isRejected) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200/60 rounded-xl text-red-700 font-semibold text-sm shadow-sm shadow-red-200/30">
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 shadow-sm shadow-red-500/30 inline-block animate-pulse" />
        Application Rejected
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold border-2 transition-all shadow-md ${
                  done
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500 text-white shadow-emerald-200/50"
                    : active
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 text-white shadow-blue-200/50"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {done ? <CheckCircle2 size={18} /> : i + 1}
              </div>
              <span
                className={`text-[11px] font-semibold whitespace-nowrap ${
                  done ? "text-emerald-600" : active ? "text-blue-600" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-1 w-14 sm:w-24 mb-5 mx-1 rounded-full transition-colors ${
                  i < current ? "bg-gradient-to-r from-emerald-400 to-emerald-500" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Doc Image ───────────────────────────────────────────────────────────────

function DocImage({ url, alt }: { url?: string; alt: string }) {
  if (!url) return <p className="text-xs text-slate-400 italic">Not uploaded</p>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group inline-block rounded-lg overflow-hidden border border-slate-200 h-32 w-48 shadow-sm hover:shadow-md transition-shadow"
    >
      <img src={url} alt={alt} className="object-cover w-full h-full" />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1.5 text-xs font-semibold">
        <ExternalLink size={14} /> View Full
      </div>
    </a>
  );
}

// ─── Info Row ────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-800 mt-1">{value || "—"}</p>
    </div>
  );
}

// ─── Success Banner ──────────────────────────────────────────────────────────

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5 text-sm font-semibold">
      <CheckCircle2 size={16} className="shrink-0" />
      {message}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [app, setApp] = useState<LoanApplication | null>(null);
  const [feeTxn, setFeeTxn] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  const [feeLoading, setFeeLoading] = useState(false);
  const [kycLoading, setKycLoading] = useState(false);
  const [loanLoading, setLoanLoading] = useState(false);
  const [disburseLoading, setDisburseLoading] = useState(false);

  const [feeSuccess, setFeeSuccess] = useState(false);
  const [kycSuccess, setKycSuccess] = useState(false);
  const [loanSuccess, setLoanSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [finalAmount, setFinalAmount] = useState("");
  const [interestRate, setInterestRate] = useState("10");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        console.log("[ApplicationDetails] Loading application:", id);
        const appData = await getApplication(id);
        if (!appData) { 
          console.log("[ApplicationDetails] Application not found, redirecting");
          navigate(ROUTES.ADMIN_LEADS); 
          return; 
        }
        setApp(appData);
        if (appData.finalAmount) setFinalAmount(appData.finalAmount.toString());
        if (appData.finalInterestRate) setInterestRate(appData.finalInterestRate.toString());
        console.log("[ApplicationDetails] Fetching fee transaction for:", appData.id);
        const txn = await getFeeTransactionByLoanId(appData.id);
        if (txn) setFeeTxn(txn);
        console.log("[ApplicationDetails] Fee transaction:", txn ? "found" : "not found");
      } catch (err) {
        console.error("[ApplicationDetails] Error loading application:", err);
        setError("Failed to load application details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleVerifyFee = async () => {
    if (!feeTxn || !app) return;
    setFeeLoading(true);
    setError(null);
    try {
      await verifyProcessingFee(app.id, feeTxn.id);
      setFeeTxn({ ...feeTxn, verified: true });
      setApp({ ...app, status: LOAN_STATUS.PENDING_KYC });
      setFeeSuccess(true);
    } catch (err) {
      console.error("[ApplicationDetails] Error verifying fee:", err);
      setError("Failed to verify payment");
    } finally {
      setFeeLoading(false);
    }
  };

  const handleApproveKyc = async () => {
    if (!app) return;
    setKycLoading(true);
    setError(null);
    try {
      await approveKyc(app.id);
      setApp({ ...app, status: LOAN_STATUS.PENDING_APPROVAL });
      setKycSuccess(true);
    } catch (err) {
      console.error("[ApplicationDetails] Error approving KYC:", err);
      setError("Failed to approve KYC");
    } finally {
      setKycLoading(false);
    }
  };

  const handleApproveLoan = async () => {
    if (!app || !finalAmount || !interestRate) return;
    const amount = Number(finalAmount);
    const rate = Number(interestRate);
    setLoanLoading(true);
    setError(null);
    try {
      await approveLoan(app.id, amount, rate);
      setApp({
        ...app,
        status: LOAN_STATUS.APPROVED,
        finalAmount: amount,
        finalInterestRate: rate,
        remainingBalance: calculateTotalPayable(amount, rate),
      });
      setLoanSuccess(true);
    } catch (err) {
      console.error("[ApplicationDetails] Error approving loan:", err);
      setError("Failed to approve loan");
    } finally {
      setLoanLoading(false);
    }
  };

  const handleDisburse = async () => {
    if (!app) return;
    setDisburseLoading(true);
    setError(null);
    try {
      await disburseLoan(app.id);
      setApp({ ...app, status: LOAN_STATUS.DISBURSED });
    } catch (err) {
      console.error("[ApplicationDetails] Error disbursing loan:", err);
      setError("Failed to disburse loan");
    } finally {
      setDisburseLoading(false);
    }
  };

  const handleReject = async () => {
    if (!app) return;
    setError(null);
    try {
      await rejectApplication(app.id);
      setApp({ ...app, status: LOAN_STATUS.REJECTED });
    } catch (err) {
      console.error("[ApplicationDetails] Error rejecting application:", err);
      setError("Failed to reject application");
    }
  };

  if (loading || !app) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const kyc = app.kycDetails;
  const basic = app.basicDetails;
  const isPendingPayment = app.status === LOAN_STATUS.PENDING_PAYMENT;
  const isPendingKyc = app.status === LOAN_STATUS.PENDING_KYC;
  const isPendingApproval = app.status === LOAN_STATUS.PENDING_APPROVAL;
  const isApproved = app.status === LOAN_STATUS.APPROVED;
  const isDisbursed = app.status === LOAN_STATUS.DISBURSED;

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate(ROUTES.ADMIN_LEADS)}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Application Details</h1>
              <p className="text-sm text-slate-500 font-mono font-medium mt-0.5">{app.appId}</p>
            </div>
          </div>
          <StatusProgress status={app.status} />
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-center gap-2.5 text-[13px] text-red-700">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-[12px] font-semibold text-red-600 hover:text-red-700 underline underline-offset-2 shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── 2-Column Grid ── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* ── Card 1: User Info ── */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-semibold text-slate-800">
                👤 Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 gap-4">
              <InfoRow label="Full Name" value={basic?.fullName} />
              <InfoRow label="Phone" value={basic?.phone} />
              <InfoRow label="Email" value={basic?.email} />
              <InfoRow label="Address" value={basic?.address} />
              <div className="col-span-2">
                <InfoRow label="Application Status" value={app.status} />
              </div>
              {(isApproved || isDisbursed) && (
                <>
                  <InfoRow label="Approved Amount" value={formatCurrency(app.finalAmount ?? 0)} />
                  <InfoRow label="Interest Rate" value={app.finalInterestRate ? `${app.finalInterestRate}%` : "—"} />
                  <InfoRow label="Total Repayable" value={formatCurrency(app.remainingBalance ?? 0)} />
                </>
              )}
            </CardContent>
          </Card>

          {/* ── Card 2: KYC Documents ── */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-800">
                  🪪 KYC Documents
                </CardTitle>
                {isPendingKyc && !kycSuccess && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={handleApproveKyc}
                      isLoading={kycLoading}
                      disabled={kycLoading}
                    >
                      Approve KYC
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={handleReject}
                      disabled={kycLoading}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
              {kycSuccess && <SuccessBanner message="KYC approved successfully!" />}

              {/* PAN */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">PAN Card</p>
                  <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {kyc?.panNumber || "—"}
                  </span>
                </div>
                <DocImage url={kyc?.panUrl} alt="PAN Card" />
              </div>

              {/* Aadhaar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Aadhaar Card</p>
                  <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {kyc?.aadhaarNumber || "—"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Front</p>
                    <DocImage url={kyc?.aadhaarFrontUrl} alt="Aadhaar Front" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Back</p>
                    <DocImage url={kyc?.aadhaarBackUrl} alt="Aadhaar Back" />
                  </div>
                </div>
              </div>

              {/* Bank */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Bank Details</p>
                <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <InfoRow label="Account No." value={kyc?.accountNumber} />
                  <InfoRow label="IFSC" value={kyc?.ifsc} />
                </div>
                <DocImage url={kyc?.passbookUrl} alt="Passbook" />
              </div>
            </CardContent>
          </Card>

          {/* ── Card 3: Payment Proof ── */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-800">
                  💳 Payment Proof
                </CardTitle>
                {feeTxn?.verified || feeSuccess ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                    <Clock size={12} /> Pending
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {feeSuccess && <SuccessBanner message="Payment verified successfully!" />}

              {feeTxn ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoRow label="UTR Number" value={feeTxn.utr} />
                    <InfoRow label="Amount" value={formatCurrency(feeTxn.amount)} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">Screenshot</p>
                    <DocImage url={feeTxn.screenshotUrl} alt="Payment Screenshot" />
                  </div>
                  {isPendingPayment && !feeSuccess && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleVerifyFee}
                      isLoading={feeLoading}
                      disabled={feeLoading}
                    >
                      Verify Payment
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                  <Clock size={32} className="opacity-40" />
                  <p className="text-sm">Awaiting payment from user</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Card 4: Loan Approval ── */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-semibold text-slate-800">
                🏦 Loan Approval
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {loanSuccess && <SuccessBanner message="Loan approved successfully!" />}
              {isDisbursed && <SuccessBanner message="Loan disbursed to applicant!" />}

              {isPendingApproval && !loanSuccess && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Loan Amount (₹)"
                      type="number"
                      value={finalAmount}
                      onChange={(e) => setFinalAmount(e.target.value)}
                      placeholder="e.g. 50000"
                    />
                    <Input
                      label="Interest Rate (%)"
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="e.g. 10"
                    />
                  </div>
                  {finalAmount && interestRate && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-800">
                      <span className="font-medium">Total Repayable: </span>
                      {formatCurrency(calculateTotalPayable(Number(finalAmount), Number(interestRate)))}
                    </div>
                  )}
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handleApproveLoan}
                    isLoading={loanLoading}
                    disabled={loanLoading || !finalAmount || !interestRate}
                  >
                    Approve Loan
                  </Button>
                </>
              )}

              {(isApproved || isDisbursed || loanSuccess) && (
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="Approved Amount" value={formatCurrency(app.finalAmount ?? 0)} />
                  <InfoRow label="Interest Rate" value={app.finalInterestRate ? `${app.finalInterestRate}%` : "—"} />
                  <InfoRow label="Total Repayable" value={formatCurrency(app.remainingBalance ?? 0)} />
                </div>
              )}

              {isApproved && !isDisbursed && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <p className="text-xs text-slate-500">
                    Transfer {formatCurrency(app.finalAmount ?? 0)} to{" "}
                    <span className="font-mono font-semibold text-slate-700">{kyc?.accountNumber}</span>{" "}
                    (IFSC: {kyc?.ifsc}), then mark as disbursed.
                  </p>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={handleDisburse}
                    isLoading={disburseLoading}
                    disabled={disburseLoading}
                  >
                    Mark as Disbursed
                  </Button>
                </div>
              )}

              {!isPendingApproval && !isApproved && !isDisbursed && !loanSuccess && (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
                  <Clock size={32} className="opacity-40" />
                  <p className="text-sm">
                    {app.status === LOAN_STATUS.REJECTED
                      ? "Application was rejected"
                      : "Waiting for prior steps to complete"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
  );
}
