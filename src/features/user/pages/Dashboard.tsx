import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "../../../shared/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/components/ui/Card";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import { Modal } from "../../../shared/components/ui/Modal";
import { FileUpload } from "../../../shared/components/ui/FileUpload";
import { trackApplication, submitRepayment } from "../../../lib/controllers/application.controller";
import { LOAN_STATUS, ROUTES } from "../../../utils/constants";
import { formatCurrency, calculateTotalPayable } from "../../../utils/helpers";
import type { LoanApplication } from "../../../lib/models/application.model";
import {
  CheckCircle2,
  Clock,
  Upload,
  Search,
  ChevronRight,
  HandCoins,
  QrCode,
  Copy,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const ADMIN_UPI = "adishricapitals@upi"; // update to real UPI if needed

const STATUS_STEPS = [
  { id: LOAN_STATUS.PENDING_PAYMENT, label: "Payment" },
  { id: LOAN_STATUS.PENDING_KYC, label: "KYC" },
  { id: LOAN_STATUS.PENDING_APPROVAL, label: "Approval" },
  { id: LOAN_STATUS.APPROVED, label: "Approved" },
  { id: LOAN_STATUS.DISBURSED, label: "Disbursed" },
];

export function Dashboard() {
  const [searchId, setSearchId] = useState("");
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(false);

  // Repayment modal state
  const [repayModal, setRepayModal] = useState(false);
  const [repayAmount, setRepayAmount] = useState("");
  const [repayUtr, setRepayUtr] = useState("");
  const [repayScreenshot, setRepayScreenshot] = useState<File | null>(null);
  const [repayLoading, setRepayLoading] = useState(false);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchId.trim()) return;
    setLoading(true);
    try {
      const app = await trackApplication(searchId);
      if (app) {
        setApplication(app);
      } else {
        setApplication(null);
        toast.error("No application found with this ID.");
      }
    } catch {
      toast.error("Failed to fetch application status.");
    } finally {
      setLoading(false);
    }
  };

  const handleRepaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;
    if (!repayAmount || Number(repayAmount) <= 0) return toast.error("Enter a valid amount.");
    if (!repayUtr.trim()) return toast.error("Enter the UTR / Transaction ID.");
    if (!repayScreenshot) return toast.error("Upload the payment screenshot.");
    setRepayLoading(true);
    try {
      await submitRepayment(application.appId, Number(repayAmount), repayUtr.trim(), repayScreenshot);
      toast.success("Repayment submitted! Admin will verify and update your balance shortly.");
      setRepayModal(false);
      setRepayAmount(""); setRepayUtr(""); setRepayScreenshot(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit repayment.");
    } finally {
      setRepayLoading(false);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(ADMIN_UPI);
    toast.info("UPI ID copied!");
  };

  const renderTimeline = (status: string) => {
    if (status === LOAN_STATUS.REJECTED) {
      return (
        <div className="bg-red-50 p-5 rounded-2xl border border-red-200 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-red-700">Application Rejected</h3>
          <p className="text-red-500 text-sm mt-1">Your application doesn't meet our current criteria.</p>
        </div>
      );
    }
    const currentIdx = STATUS_STEPS.findIndex((s) => s.id === status);
    return (
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
        {STATUS_STEPS.map((step, idx) => {
          const done = idx < currentIdx || status === LOAN_STATUS.DISBURSED;
          const active = idx === currentIdx && status !== LOAN_STATUS.DISBURSED;
          return (
            <div key={step.id} className="flex flex-col items-center gap-1.5 min-w-[50px]">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors shrink-0
                ${done ? "bg-emerald-500 border-emerald-500 text-white"
                  : active ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                  : "bg-slate-100 border-slate-200 text-slate-400"}`}
              >
                {done ? <CheckCircle2 size={16} /> : <Clock size={16} />}
              </div>
              <p className={`text-[10px] font-medium text-center leading-tight ${done || active ? "text-slate-800" : "text-slate-400"}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  const outstanding = application
    ? (application.remainingBalance !== undefined
        ? application.remainingBalance
        : (application.finalAmount ? calculateTotalPayable(application.finalAmount, application.finalInterestRate ?? 0) : 0))
    : 0;

  return (
    <MainLayout>
      {/* Hero Search */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 px-4 py-10 sm:py-14">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">Loan Tracking</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Track Your Application</h1>
          <form onSubmit={handleTrack} className="flex gap-2">
            <Input
              placeholder="Enter Loan ID (e.g. L-12345)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="h-12 font-mono text-sm flex-1"
            />
            <Button type="submit" className="h-12 px-5 bg-blue-600 hover:bg-blue-500 shrink-0" isLoading={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
        {!application ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-100 text-center mt-2">
            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} />
            </div>
            <h2 className="text-base font-semibold text-slate-700 mb-1">Enter your Application ID above</h2>
            <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
              You'll find your ID in the confirmation screen after submitting your form.
            </p>
            <Link to={ROUTES.LOAN_APPLICATION}>
              <Button size="sm" variant="outline" className="rounded-full">
                Haven't applied yet? Apply here →
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5 mt-2 animate-in fade-in slide-in-from-bottom-4">

            {/* Status Card */}
            <Card>
              <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
                <div className="flex justify-between items-start gap-3 flex-wrap">
                  <div>
                    <CardDescription>Application Reference</CardDescription>
                    <CardTitle className="font-mono text-lg mt-0.5">{application.appId}</CardTitle>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200 whitespace-nowrap">
                    {application.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-5">
                {renderTimeline(application.status)}

                {application.status === LOAN_STATUS.PENDING_PAYMENT && (
                  <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Upload size={16} className="text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-amber-800 text-sm">Payment Verification Required</p>
                        <p className="text-amber-700/80 text-xs mt-0.5">Pay ₹49 processing fee to proceed.</p>
                      </div>
                    </div>
                    <Link to={`${ROUTES.PROCESSING_FEE}?loanId=${application.appId}`} className="shrink-0 w-full sm:w-auto">
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white text-sm w-full sm:w-auto">
                        Complete Payment
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Loan Overview */}
            {application.finalAmount && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <HandCoins className="text-blue-600 w-5 h-5" />
                    Loan Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Approved Amount", value: formatCurrency(application.finalAmount), color: "text-slate-900" },
                      { label: "Interest Rate", value: `${application.finalInterestRate}%`, color: "text-slate-900" },
                      { label: "Total Payable", value: formatCurrency(calculateTotalPayable(application.finalAmount, application.finalInterestRate ?? 0)), color: "text-slate-900" },
                      { label: "Outstanding", value: formatCurrency(outstanding), color: "text-rose-600" },
                    ].map((s) => (
                      <div key={s.label} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-400 font-medium mb-1">{s.label}</p>
                        <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  {application.status === LOAN_STATUS.DISBURSED && outstanding > 0 && (
                    <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                          <CreditCard size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-900 text-sm">Loan Active</p>
                          <p className="text-xs text-emerald-700">Outstanding: <strong>{formatCurrency(outstanding)}</strong></p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setRepayModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 group text-sm py-2.5 w-full sm:w-auto"
                      >
                        Pay Due <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  )}

                  {application.status === LOAN_STATUS.DISBURSED && outstanding === 0 && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800">
                      <CheckCircle2 size={20} className="text-green-600 shrink-0" />
                      <p className="font-semibold text-sm">Loan Fully Repaid — Congratulations! 🎉</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Repayment Modal */}
      <Modal
        isOpen={repayModal}
        onClose={() => setRepayModal(false)}
        title="Make a Repayment"
        footer={
          <>
            <Button variant="outline" onClick={() => setRepayModal(false)} disabled={repayLoading}>Cancel</Button>
            <Button form="repay-form" type="submit" className="bg-emerald-600 hover:bg-emerald-700" isLoading={repayLoading}>
              Submit Payment
            </Button>
          </>
        }
      >
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center mb-4">
          <div className="w-24 h-24 bg-white border-2 border-slate-300 rounded-xl flex items-center justify-center mb-3 shadow-sm">
            <QrCode className="w-full h-full p-3 text-slate-700" />
          </div>
          <p className="text-xs text-slate-500 mb-2">Scan QR or pay to UPI ID</p>
          <button
            type="button"
            onClick={handleCopyUpi}
            className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span className="font-mono font-bold text-slate-900 text-sm">{ADMIN_UPI}</span>
            <Copy size={14} className="text-blue-600" />
          </button>
        </div>
        <form id="repay-form" onSubmit={handleRepaymentSubmit} className="space-y-4">
          <Input label="Amount Paid (₹)" type="number" required value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)} placeholder="Enter exact amount" />
          <Input label="UTR / Transaction ID" required value={repayUtr} onChange={(e) => setRepayUtr(e.target.value)} placeholder="12-digit UPI reference" />
          <FileUpload label="Upload Payment Screenshot" onChange={setRepayScreenshot} />
          <p className="text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-xl p-3">
            ⚠️ Admin will verify your payment and update your outstanding balance.
          </p>
        </form>
      </Modal>
    </MainLayout>
  );
}
