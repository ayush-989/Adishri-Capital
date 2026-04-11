import { useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { MainLayout } from "../../components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LOAN_STATUS, ROUTES } from "../../utils/constants";
import { formatCurrency, calculateTotalPayable } from "../../utils/helpers";
import { CheckCircle2, Clock, Upload, Search, ChevronRight, HandCoins } from "lucide-react";
import { toast } from "react-toastify";

export function Dashboard() {
  const [searchId, setSearchId] = useState("");
  const [application, setApplication] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    try {
      const appRef = doc(db, "applications", searchId.trim().toUpperCase());
      const appSnap = await getDoc(appRef);
      if (appSnap.exists()) {
        setApplication({ id: appSnap.id, ...appSnap.data() });
      } else {
        setApplication(null);
        toast.error("No application found with this ID.");
      }
    } catch (error) {
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

    const currentStepIndex = steps.findIndex((s) => s.id === status);
    const isRejected = status === LOAN_STATUS.REJECTED;

    if (isRejected) {
      return (
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center">
          <h3 className="text-xl font-bold text-red-600 mb-2">Application Rejected</h3>
          <p className="text-red-500">Unfortunately, your application does not meet our current criteria.</p>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0 hidden md:block" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex || status === "Disbursed";
            const isCurrent = index === currentStepIndex && status !== "Disbursed";

            return (
              <div key={step.id} className="flex flex-row md:flex-col items-center gap-4 md:gap-2 w-full md:w-32">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-300 md:mx-auto
                    ${isCompleted ? "bg-green-500 text-white" : isCurrent ? "bg-blue-500 text-white animate-pulse" : "bg-slate-200 text-slate-400"}
                  `}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                <div className="flex-1 md:text-center shrink-0">
                  <p className={`text-sm font-medium ${isCompleted || isCurrent ? "text-slate-900" : "text-slate-500"}`}>
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
      <div className="bg-slate-900 py-12 px-4 shadow-inner">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Track Your Application</h1>
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Input 
              placeholder="Enter your Loan ID (e.g. L-12345)" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="h-12 text-lg shadow-sm font-mono"
            />
            <Button type="submit" size="lg" className="h-12 shrink-0 px-8 bg-blue-600 hover:bg-blue-500" isLoading={loading}>
              <Search className="mr-2 h-5 w-5"/> Track
            </Button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {!application ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 text-center mt-4">
            <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} />
            </div>
            <h2 className="text-xl font-medium text-slate-600 mb-2">Enter your Application ID above</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              You can find your Application ID in the confirmation screen after you submitted your loan form.
            </p>
            <Link to={ROUTES.LOAN_APPLICATION}>
              <Button size="sm" variant="outline" className="rounded-full shadow-sm">
                Haven't applied yet? Apply here.
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8 mt-4 animate-in fade-in slide-in-from-bottom-4">
            <Card>
              <CardHeader className="bg-slate-50 border-b border-slate-100 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <CardDescription>Application Reference</CardDescription>
                    <CardTitle className="font-mono text-xl mt-1">{application.appId}</CardTitle>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full border border-blue-200">
                    {application.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 pb-6">
                {renderTimeline(application.status)}
                
                {application.status === LOAN_STATUS.PENDING_PAYMENT && (
                  <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-amber-800 flex items-center gap-2">
                        <Upload size={18} /> Payment Verification Required
                      </h4>
                      <p className="text-amber-700/80 text-sm mt-1">Please pay the ₹49 processing fee to proceed with KYC verification.</p>
                    </div>
                    <Link to={`${ROUTES.PROCESSING_FEE}?loanId=${application.appId}`}>
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white shadow-none">
                        Complete Payment
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Loan Details Section */}
            {(application.finalAmount) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HandCoins className="text-blue-600" />
                    Loan Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-500 font-medium mb-1">Approved Amount</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(application.finalAmount)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-500 font-medium mb-1">Interest Rate</p>
                      <p className="text-2xl font-bold text-slate-900">{application.finalInterestRate}%</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-500 font-medium mb-1">Total Payable</p>
                      <p className="text-2xl font-bold text-slate-900">{formatCurrency(calculateTotalPayable(application.finalAmount, application.finalInterestRate))}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-500 font-medium mb-1">Outstanding</p>
                      <p className="text-2xl font-bold text-rose-600">{formatCurrency(application.remainingBalance !== undefined ? application.remainingBalance : calculateTotalPayable(application.finalAmount, application.finalInterestRate))}</p>
                    </div>
                  </div>

                  {application.status === LOAN_STATUS.DISBURSED && (application.remainingBalance > 0 || application.remainingBalance === undefined) && (
                    <div className="mt-6 flex justify-end">
                      <Button onClick={() => alert("Repayment modal opens here")} className="bg-emerald-600 hover:bg-emerald-700 group">
                        Make Repayment <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
