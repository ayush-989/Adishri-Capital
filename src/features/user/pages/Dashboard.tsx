import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MainLayout } from "../../../shared/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/components/ui/Card";
import { Button } from "../../../shared/components/ui/Button";
import { Input } from "../../../shared/components/ui/Input";
import { trackApplication } from "../../../lib/controllers/application.controller";
import { LOAN_STATUS, ROUTES } from "../../../utils/constants";
import { formatCurrency, calculateTotalPayable } from "../../../utils/helpers";
import type { LoanApplication } from "../../../lib/models/application.model";
import { CheckCircle2, Clock, Upload, Search, ChevronRight, HandCoins } from "lucide-react";
import { toast } from "react-toastify";

export function Dashboard() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(false);

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

  const renderTimeline = (status: string) => {
    const steps = [
      { id: "Pending Payment Verification", label: "Payment Verification" },
      { id: "Pending KYC Verification", label: "KYC Verification" },
      { id: "Pending Approval", label: "Loan Approval" },
      { id: "Approved", label: "Ready to Disburse" },
      { id: "Disbursed", label: "Disbursed" },
    ];

    if (status === LOAN_STATUS.REJECTED) {
      return (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center">
          <h3 className="text-xl font-bold text-red-600 mb-2">Application Rejected</h3>
          <p className="text-red-500">Unfortunately, your application does not meet our current criteria.</p>
        </div>
      );
    }

    const currentStepIndex = steps.findIndex((s) => s.id === status);

    return (
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
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
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
        </div>
      </div>

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
                  </div>
                )}
              </CardContent>
            </Card>

            {application.finalAmount && (
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
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
