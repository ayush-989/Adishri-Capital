import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../shared/components/layout/AdminLayout";
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
import { toast } from "react-toastify";
import { Check, ArrowLeft, ExternalLink } from "lucide-react";

export function ApplicationDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [app, setApp] = useState<LoanApplication | null>(null);
  const [feeTxn, setFeeTxn] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [finalAmount, setFinalAmount] = useState("");
  const [interestRate, setInterestRate] = useState("10");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const appData = await getApplication(id);
        if (!appData) {
          toast.error("Application not found");
          navigate(ROUTES.ADMIN_LEADS);
          return;
        }
        setApp(appData);
        if (appData.finalAmount) setFinalAmount(appData.finalAmount.toString());
        if (appData.finalInterestRate) setInterestRate(appData.finalInterestRate.toString());

        const txn = await getFeeTransactionByLoanId(appData.id);
        if (txn) setFeeTxn(txn);
      } catch {
        toast.error("Error fetching details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const withLoading = async (fn: () => Promise<void>) => {
    setActionLoading(true);
    try {
      await fn();
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyFee = () =>
    withLoading(async () => {
      if (!feeTxn || !app) return;
      await verifyProcessingFee(app.id, feeTxn.id);
      setFeeTxn({ ...feeTxn, verified: true });
      setApp({ ...app, status: LOAN_STATUS.PENDING_KYC });
      toast.success("Fee verified");
    });

  const handleApproveKyc = () =>
    withLoading(async () => {
      if (!app) return;
      await approveKyc(app.id);
      setApp({ ...app, status: LOAN_STATUS.PENDING_APPROVAL });
      toast.success("KYC approved");
    });

  const handleReject = () =>
    withLoading(async () => {
      if (!app) return;
      await rejectApplication(app.id);
      setApp({ ...app, status: LOAN_STATUS.REJECTED });
      toast.success("Application rejected");
    });

  const handleApproveLoan = () =>
    withLoading(async () => {
      if (!app || !finalAmount || !interestRate) {
        toast.error("Enter amount and interest rate");
        return;
      }
      const amount = Number(finalAmount);
      const rate = Number(interestRate);
      await approveLoan(app.id, amount, rate);
      setApp({ ...app, status: LOAN_STATUS.APPROVED, finalAmount: amount, finalInterestRate: rate, remainingBalance: calculateTotalPayable(amount, rate) });
      toast.success("Loan approved");
    });

  const handleDisburse = () =>
    withLoading(async () => {
      if (!app) return;
      await disburseLoan(app.id);
      setApp({ ...app, status: LOAN_STATUS.DISBURSED });
      toast.success("Loan disbursed");
    });

  if (loading || !app) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(ROUTES.ADMIN_LEADS)} className="px-2">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-3xl font-bold text-slate-900">Application: {app.appId}</h1>
          </div>
          <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 font-medium text-slate-700">
            {app.status}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Applicant Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-slate-500">Full Name</p><p className="font-semibold text-slate-900">{app.basicDetails?.fullName}</p></div>
                <div><p className="text-sm text-slate-500">Phone</p><p className="font-semibold text-slate-900">{app.basicDetails?.phone}</p></div>
                <div><p className="text-sm text-slate-500">Email</p><p className="font-semibold text-slate-900">{app.basicDetails?.email || "N/A"}</p></div>
                <div><p className="text-sm text-slate-500">Address</p><p className="font-semibold text-slate-900">{app.basicDetails?.address}</p></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>KYC Documents</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Identity Proof (PAN: {app.kycDetails?.panNumber})</h4>
                  <a href={app.kycDetails?.panUrl} target="_blank" rel="noopener noreferrer" className="inline-block relative group border rounded-lg overflow-hidden h-32 w-48">
                    <img src={app.kycDetails?.panUrl} className="object-cover w-full h-full" alt="PAN" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><ExternalLink /></div>
                  </a>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Address Proof (Aadhaar: {app.kycDetails?.aadhaarNumber})</h4>
                  <div className="flex gap-4">
                    <a href={app.kycDetails?.aadhaarFrontUrl} target="_blank" rel="noopener noreferrer" className="inline-block relative group border rounded-lg overflow-hidden h-32 w-48">
                      <img src={app.kycDetails?.aadhaarFrontUrl} className="object-cover w-full h-full" alt="Aadhaar Front" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><ExternalLink /></div>
                    </a>
                    <a href={app.kycDetails?.aadhaarBackUrl} target="_blank" rel="noopener noreferrer" className="inline-block relative group border rounded-lg overflow-hidden h-32 w-48">
                      <img src={app.kycDetails?.aadhaarBackUrl} className="object-cover w-full h-full" alt="Aadhaar Back" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"><ExternalLink /></div>
                    </a>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-2">Bank Details (A/C: {app.kycDetails?.accountNumber}, IFSC: {app.kycDetails?.ifsc})</h4>
                  <a href={app.kycDetails?.passbookUrl} target="_blank" rel="noopener noreferrer" className="inline-block relative group border rounded-lg overflow-hidden h-32 w-48">
                    <img src={app.kycDetails?.passbookUrl} className="object-cover w-full h-full" alt="Passbook" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><ExternalLink /></div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle>Verification Pipeline</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Step 1: Fee */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                  <h4 className="font-bold text-slate-900 mb-2">Step 1: Processing Fee</h4>
                  {app.status === LOAN_STATUS.PENDING_PAYMENT ? (
                    feeTxn ? (
                      <div className="space-y-3">
                        <div className="text-sm bg-yellow-50 p-2 rounded text-yellow-800 border border-yellow-200">
                          <strong>UTR:</strong> {feeTxn.utr}
                        </div>
                        <a href={feeTxn.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                          <ExternalLink size={14} /> View Screenshot
                        </a>
                        <Button className="w-full" onClick={handleVerifyFee} isLoading={actionLoading}>Verify Payment</Button>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">User has not uploaded fee proof yet.</p>
                    )
                  ) : (
                    <div className="flex items-center text-emerald-600 text-sm font-medium"><Check size={16} className="mr-1" /> Verified</div>
                  )}
                </div>

                {/* Step 2: KYC */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                  <h4 className="font-bold text-slate-900 mb-2">Step 2: KYC Verification</h4>
                  {app.status === LOAN_STATUS.PENDING_KYC && (
                    <div className="space-y-2 mt-4">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={handleApproveKyc} isLoading={actionLoading}>
                        Approve KYC Documents
                      </Button>
                      <Button variant="danger" className="w-full" onClick={handleReject} isLoading={actionLoading}>
                        Reject Application
                      </Button>
                    </div>
                  )}
                  {![LOAN_STATUS.PENDING_PAYMENT, LOAN_STATUS.PENDING_KYC].includes(app.status) && (
                    <div className="flex items-center text-emerald-600 text-sm font-medium"><Check size={16} className="mr-1" /> Verified</div>
                  )}
                </div>

                {/* Step 3: Approval */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                  <h4 className="font-bold text-slate-900 mb-4">Step 3: Loan Approval</h4>
                  {app.status === LOAN_STATUS.PENDING_APPROVAL && (
                    <div className="space-y-4">
                      <Input label="Approved Amount (₹)" type="number" value={finalAmount} onChange={(e) => setFinalAmount(e.target.value)} />
                      <Input label="Interest Rate (%)" type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} />
                      <div className="text-sm bg-slate-50 p-2 rounded">
                        <strong>Total Repayable: </strong>
                        {formatCurrency(calculateTotalPayable(Number(finalAmount) || 0, Number(interestRate) || 0))}
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleApproveLoan} isLoading={actionLoading}>
                        Approve Loan
                      </Button>
                    </div>
                  )}
                  {[LOAN_STATUS.APPROVED, LOAN_STATUS.DISBURSED].includes(app.status) && (
                    <div className="flex items-center text-emerald-600 text-sm font-medium">
                      <Check size={16} className="mr-1" /> Approved: {formatCurrency(app.finalAmount ?? 0)} @ {app.finalInterestRate}%
                    </div>
                  )}
                </div>

                {/* Step 4: Disburse */}
                {app.status === LOAN_STATUS.APPROVED && (
                  <div className="border border-slate-200 rounded-lg p-4 bg-emerald-50">
                    <h4 className="font-bold text-slate-900 mb-2">Step 4: Disbursal</h4>
                    <p className="text-xs text-slate-500 mb-4">Transfer {formatCurrency(app.finalAmount ?? 0)} to the user's bank account, then mark as disbursed.</p>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handleDisburse} isLoading={actionLoading}>
                      Mark as Disbursed
                    </Button>
                  </div>
                )}
                {app.status === LOAN_STATUS.DISBURSED && (
                  <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4 flex items-center text-emerald-700 font-bold">
                    <Check size={20} className="mr-2" /> Loan is Active (Disbursed)
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
