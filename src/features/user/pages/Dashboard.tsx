import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "../../../shared/components/layout/MainLayout";

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
  Search,
  HandCoins,
  QrCode,
  Copy,
  CreditCard,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Wallet
} from "lucide-react";
import { toast } from "react-toastify";
import { FadeUp } from "../../../shared/components/ui/FadeUp";

const ADMIN_UPI = "adishricapitals@upi"; // update to real UPI if needed

const STATUS_STEPS = [
  { id: LOAN_STATUS.PENDING_PAYMENT, label: "Payment" },
  { id: LOAN_STATUS.PENDING_KYC, label: "KYC" },
  { id: LOAN_STATUS.PENDING_APPROVAL, label: "Approval" },
  { id: LOAN_STATUS.APPROVED, label: "Approved" },
  { id: LOAN_STATUS.DISBURSED, label: "Disbursed" },
];

export function Dashboard() {
  const navigate = useNavigate();
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
    if (!searchId.trim()) return toast.error("Please enter Loan ID");
    
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
        <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100/50 text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-black text-red-700">Application Rejected</h3>
          <p className="text-red-600/70 text-sm mt-1">We're sorry, your application could not be approved at this time.</p>
        </div>
      );
    }
    const currentIdx = STATUS_STEPS.findIndex((s) => s.id === status);
    return (
 feature/admin-dashboard
      <div className="relative pl-4">
        <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-200 -translate-y-1/2 z-0 hidden md:block rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex || status === "Disbursed";
            const isCurrent = index === currentStepIndex && status !== "Disbursed";
            return (
              <div key={step.id} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 w-full md:w-36">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg transition-all duration-300 md:mx-auto ${isCompleted ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-200/50" : isCurrent ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200/50 animate-pulse" : "bg-slate-100 text-slate-400 shadow-slate-200/50"}`}>
                  {isCompleted ? <CheckCircle2 size={22} /> : <Clock size={22} />}
                </div>
                <div className="flex-1 md:text-center shrink-0">
                  <p className={`text-sm font-semibold ${isCompleted || isCurrent ? "text-slate-900" : "text-slate-400"}`}>
                    {step.label}
                  </p>
                </div>

      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 pt-4 px-2 no-scrollbar">
        {STATUS_STEPS.map((step, idx) => {
          const done = idx < currentIdx || status === LOAN_STATUS.DISBURSED;
          const active = idx === currentIdx && status !== LOAN_STATUS.DISBURSED;
          return (
            <div key={step.id} className="flex flex-col items-center gap-3 min-w-[70px] relative">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 shrink-0
                ${done ? "bg-green-500 border-green-50 text-white shadow-lg shadow-green-200"
                  : active ? "bg-blue-600 border-blue-50 text-white shadow-xl shadow-blue-200 animate-pulse"
                  : "bg-slate-50 border-slate-100 text-slate-300"}`}
              >
                {done ? <CheckCircle2 size={20} strokeWidth={3} /> : <Clock size={20} strokeWidth={3} />}
 main
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest text-center leading-tight transition-colors duration-500 ${done || active ? "text-slate-900" : "text-slate-400"}`}>
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
 feature/admin-dashboard
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 py-14 px-4 shadow-2xl shadow-slate-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight">Track Your Application</h1>
          <p className="text-slate-300 text-lg mb-8 font-medium">Enter your unique application ID to check the status of your loan</p>
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Input
              placeholder="Enter your Loan ID (e.g. L-12345)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="h-12 text-base shadow-lg shadow-slate-900/20 font-mono"
            />
            <Button type="submit" size="lg" className="h-12 shrink-0 px-8" isLoading={loading}>
              <Search className="mr-2 h-5 w-5" /> Track
            </Button>
          </form>

      <div className="bg-[#fcfdff] min-h-[calc(100vh-64px)] py-12 sm:py-20 px-4 relative overflow-hidden flex flex-col items-center">
        {/* Modern Background Decorations */}
        <div className="absolute top-0 right-[-10%] w-[40rem] h-[40rem] bg-blue-400/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-400/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Hero Search Area */}
        <div className="max-w-xl mx-auto w-full text-center relative z-10 mb-12 sm:mb-16">
          <FadeUp>
            <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-4 inline-block">Tracking Portal</span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">Track Your Status</h1>
            <p className="text-slate-500 text-base sm:text-lg max-w-sm mx-auto mb-10 leading-relaxed">Enter your unique Application ID to see your real-time processing status.</p>
          </FadeUp>
          
          <div className="bg-white p-2 sm:p-3 rounded-[2.5rem] shadow-[0_20px_50px_rgba(30,41,59,0.04)] border border-slate-200 overflow-hidden ring-1 ring-slate-900/5">
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Enter Loan ID (e.g. L-12345)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="h-14 text-lg font-bold border-none bg-slate-50 placeholder:text-slate-300 focus-visible:ring-0 shadow-none px-6"
              />
              <Button type="submit" className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-900/10 font-black transition-all active:scale-95" isLoading={loading}>
                <Search className="h-5 w-5 mr-2" strokeWidth={3} /> TRACK
              </Button>
            </form>
          </div>
 main
        </div>

 feature/admin-dashboard
      <div className="max-w-5xl mx-auto px-4 py-10">
        {!application ? (
          <div className="bg-white p-14 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-200/60 text-center mt-6">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Search size={44} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Enter your Application ID above</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium">
              You can find your Application ID in the confirmation screen after you submitted your loan form.
            </p>
            <Link to={ROUTES.LOAN_APPLICATION}>
              <Button size="sm" variant="outline" className="rounded-xl shadow-md">
                Haven't applied yet? Apply here.
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8 mt-6 animate-in fade-in slide-in-from-bottom-4">
            <Card className="shadow-lg shadow-slate-200/40">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-slate-100 rounded-t-2xl py-5">
                <div className="flex justify-between items-center">
                  <div>
                    <CardDescription className="text-slate-500 font-semibold">Application Reference</CardDescription>
                    <CardTitle className="font-mono text-xl mt-1.5 font-bold">{application.appId}</CardTitle>
                  </div>
                  <div className="px-4 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 text-sm font-bold rounded-full border border-blue-200/60 shadow-sm shadow-blue-200/20">
                    {application.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 pb-8">
                {renderTimeline(application.status)}
                {application.status === LOAN_STATUS.PENDING_PAYMENT && (
                  <div className="mt-10 bg-gradient-to-r from-amber-50 to-amber-100/30 border border-amber-200/60 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg shadow-amber-200/20">
                    <div>
                      <h4 className="font-bold text-amber-800 flex items-center gap-2.5 text-base">
                        <Upload size={20} /> Payment Verification Required
                      </h4>
                      <p className="text-amber-700/80 text-sm mt-1.5 font-medium">Please pay the ₹49 processing fee to proceed with KYC verification.</p>
                    </div>
                    <Link to={`${ROUTES.PROCESSING_FEE}?loanId=${application.appId}`}>
                      <Button className="shadow-lg shadow-amber-500/20">
                        Complete Payment
                      </Button>
                    </Link>

      <div className="max-w-4xl mx-auto w-full relative z-10 px-2 lg:px-0">
        {!application ? (
          <FadeUp delay={0.2}>
            <div className="bg-white p-12 sm:p-16 rounded-[3rem] shadow-[0_10px_40px_rgba(30,41,59,0.02)] border border-slate-200 text-center flex flex-col items-center ring-1 ring-slate-900/5">
              <div className="w-24 h-24 bg-blue-50 text-blue-100 rounded-[2rem] flex items-center justify-center mb-6">
                <Search size={48} strokeWidth={1} className="text-blue-200" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Ready to serve you</h2>
              <p className="text-slate-400 text-base mb-10 max-w-xs mx-auto font-medium">
                Enter your details above to pull your live loan records and status.
              </p>
              <Link to={ROUTES.LOAN_APPLICATION}>
                <div className="group inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all cursor-pointer shadow-xl shadow-slate-900/10">
                  New Application <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </FadeUp>
        ) : (
          <div className="space-y-8">

            {/* Status Card */}
            <FadeUp delay={0.1}>
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(30,41,59,0.04)] border border-slate-200 overflow-hidden ring-1 ring-slate-900/5">
                <div className="bg-slate-900 text-white p-8 sm:p-10 flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-8 -mt-8" />
                  <div className="relative z-10">
                    <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">Registration ID</span>
                    <h2 className="font-mono text-2xl sm:text-3xl font-black tracking-tight">{application.appId}</h2>
                  </div>
                  <div className="relative z-10">
                    <div className="px-5 py-2 bg-blue-600 text-[11px] font-black rounded-full shadow-lg shadow-blue-600/20 uppercase tracking-widest ring-4 ring-blue-600/10">
                      {application.status}
                    </div>
                  </div>
                </div>
                
                <div className="p-8 sm:p-12">
                  <div className="mb-4 text-center sm:text-left">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2 block">Process Timeline</span>
 main
                  </div>
                  {renderTimeline(application.status)}

                  {application.status === LOAN_STATUS.PENDING_PAYMENT && (
                    <div className="mt-10 bg-blue-50/50 border border-blue-100 rounded-[2rem] p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:shadow-lg hover:shadow-blue-900/5">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-blue-900/5 ring-1 ring-blue-50">
                          <CreditCard className="text-blue-600 w-7 h-7" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-lg">Payment Required</p>
                          <p className="text-slate-500 text-sm font-medium">Verify your processing fee to proceed.</p>
                        </div>
                      </div>
                      <Link to={`${ROUTES.PROCESSING_FEE}?loanId=${application.appId}`} className="shrink-0 w-full sm:w-auto">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white h-14 font-black px-10 rounded-2xl w-full sm:w-auto shadow-xl shadow-blue-900/10 transition-all active:scale-95 group">
                          Pay Fee <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </FadeUp>

            {/* Loan Overview Grid */}
            {application.finalAmount && (
 feature/admin-dashboard
              <Card className="shadow-lg shadow-slate-200/40">
                <CardHeader className="border-b border-slate-100 pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <HandCoins size={20} />
                    </div>
                    Loan Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Approved Amount</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(application.finalAmount)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-5 rounded-2xl border border-blue-200/60 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2">Interest Rate</p>
                      <p className="text-2xl font-bold text-blue-700">{application.finalInterestRate}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 p-5 rounded-2xl border border-emerald-200/60 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2">Total Payable</p>
                      <p className="text-2xl font-bold text-emerald-700">{formatCurrency(calculateTotalPayable(application.finalAmount, application.finalInterestRate ?? 0))}</p>
                    </div>
                    <div className="bg-gradient-to-br from-rose-50 to-rose-100/30 p-5 rounded-2xl border border-rose-200/60 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-rose-500 mb-2">Outstanding</p>
                      <p className="text-2xl font-bold text-rose-600">
                        {formatCurrency(application.remainingBalance ?? calculateTotalPayable(application.finalAmount, application.finalInterestRate ?? 0))}
                      </p>
                    </div>
                  </div>
                  {application.status === LOAN_STATUS.DISBURSED && (application.remainingBalance ?? 1) > 0 && (
                    <div className="mt-8 flex justify-end">
                      <Button onClick={() => navigate(`${ROUTES.PROCESSING_FEE}?loanId=${application.appId}&type=repayment`)} className="shadow-lg shadow-emerald-500/20 group">
                        Make Repayment <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <FadeUp delay={0.2}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Approved Amount", value: formatCurrency(application.finalAmount), icon: HandCoins, sub: "Sanctioned Value" },
                    { label: "Interest Rate", value: `${application.finalInterestRate}%`, icon: ShieldCheck, sub: "Fixed Monthly" },
                    { label: "Total Payable", value: formatCurrency(calculateTotalPayable(application.finalAmount, application.finalInterestRate ?? 0)), icon: CreditCard, sub: "Incl. Interests" },
                    { label: "Remaining", value: formatCurrency(outstanding), icon: Wallet, sub: "Outstanding", highlight: true },
                  ].map((s) => (
                    <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${s.highlight ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"}`}>
                        <s.icon size={20} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                      <p className={`text-xl font-black ${s.highlight ? "text-red-600" : "text-slate-900"}`}>{s.value}</p>
                      <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-tighter">{s.sub}</p>
                    </div>
                  ))}
                </div>

                {application.status === LOAN_STATUS.DISBURSED && outstanding > 0 && (
                  <div className="mt-6 bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-full -mr-12 -mt-12" />
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center shadow-2xl backdrop-blur-md ring-1 ring-white/20">
                        <CreditCard size={28} />
                      </div>
                      <div>
                        <p className="font-black text-white text-xl">Loan Active</p>
                        <p className="text-slate-400 text-sm font-medium mt-1">Outstanding: <span className="text-blue-400 font-black">{formatCurrency(outstanding)}</span></p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setRepayModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 h-16 px-10 font-black rounded-2xl w-full sm:w-auto shadow-2xl shadow-blue-900/20 text-white group relative z-10 transition-all active:scale-95"
                    >
                      Process Repayment <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                )}

                {application.status === LOAN_STATUS.DISBURSED && outstanding === 0 && (
                  <div className="mt-6 p-8 bg-green-50/50 border border-green-100 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                      <CheckCircle2 size={32} strokeWidth={3} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900">Successfully Repaid</h3>
                      <p className="text-slate-500 font-medium">Thank you for choosing Adishri Capitals. 🎉</p>
                    </div>
                  </div>
                )}
              </FadeUp>
 main
            )}
          </div>
        )}
      </div>
    </div>

    {/* Repayment Modal */}
      <Modal
        isOpen={repayModal}
        onClose={() => setRepayModal(false)}
        title="Repayment Portal"
        footer={
          <div className="flex gap-4 w-full">
            <Button variant="outline" onClick={() => setRepayModal(false)} disabled={repayLoading} className="flex-1 h-12 rounded-xl border-slate-200 font-bold">Cancel</Button>
            <Button form="repay-form" type="submit" className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-900/10" isLoading={repayLoading}>
              Confirm Payment
            </Button>
          </div>
        }
      >
        <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 flex flex-col items-center mb-6">
          <div className="w-32 h-32 bg-white border border-slate-100 rounded-3xl flex items-center justify-center mb-4 shadow-xl shadow-slate-900/5">
            <QrCode className="w-full h-full p-4 text-slate-900" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Pay via Scan or UPI</p>
          <button
            type="button"
            onClick={handleCopyUpi}
            className="flex items-center gap-3 bg-white border border-slate-100 px-6 py-3 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group active:scale-95"
          >
            <span className="font-mono font-black text-slate-900 text-sm tracking-widest">{ADMIN_UPI}</span>
            <Copy size={16} className="text-blue-600 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <form id="repay-form" onSubmit={handleRepaymentSubmit} className="space-y-5 px-1 pb-2">
          <Input label="Paid Amount (₹)" type="number" required value={repayAmount} onChange={(e) => setRepayAmount(e.target.value)} placeholder="e.g. 5000" className="h-12 rounded-xl border-slate-200" />
          <Input label="UTR / Transaction ID" required value={repayUtr} onChange={(e) => setRepayUtr(e.target.value)} placeholder="12-digit reference" className="h-12 rounded-xl border-slate-200" />
          <FileUpload label="Screenshot of Payment" onChange={setRepayScreenshot} />
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex gap-3">
             <AlertCircle size={18} className="text-blue-600 mt-0.5 shrink-0" />
             <p className="text-[11px] leading-relaxed text-blue-700 font-semibold">Our team will verify the UTR and update your balance within 2-4 working hours.</p>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
}
