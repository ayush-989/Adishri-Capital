import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { LOAN_STATUS, ROUTES } from "../../utils/constants";
import { formatCurrency, calculateTotalPayable } from "../../utils/helpers";
import { toast } from "react-toastify";
import { Check, ArrowLeft, ExternalLink } from "lucide-react";

export function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState<any>(null);
  const [feeTxn, setFeeTxn] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Approval form state
  const [finalAmount, setFinalAmount] = useState("");
  const [interestRate, setInterestRate] = useState("10");

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const appSnap = await getDoc(doc(db, "applications", id));
        if (appSnap.exists()) {
          const appData = appSnap.data();
          setApp({ id: appSnap.id, ...appData });
          
          if (appData.finalAmount) setFinalAmount(appData.finalAmount.toString());
          if (appData.finalInterestRate) setInterestRate(appData.finalInterestRate.toString());

          // Fetch fee transaction if exists
          const txnsQuery = query(collection(db, "transactions"), where("loanId", "==", appSnap.id), where("type", "==", "fee"));
          const txnsSnap = await getDocs(txnsQuery);
          if (!txnsSnap.empty) {
            setFeeTxn({ id: txnsSnap.docs[0].id, ...txnsSnap.docs[0].data() });
          }
        } else {
          toast.error("Application not found");
          navigate(ROUTES.ADMIN_LEADS);
        }
      } catch (error) {
        toast.error("Error fetching details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const handleUpdateStatus = async (status: string, additionalData: any = {}) => {
    setActionLoading(true);
    try {
      await updateDoc(doc(db, "applications", app.id), {
        status,
        ...additionalData
      });
      setApp({ ...app, status, ...additionalData });
      toast.success(`Application updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyFee = async () => {
    if (!feeTxn) return;
    setActionLoading(true);
    try {
      await updateDoc(doc(db, "transactions", feeTxn.id), { verified: true });
      setFeeTxn({ ...feeTxn, verified: true });
      await handleUpdateStatus(LOAN_STATUS.PENDING_KYC);
    } catch (e) {
      toast.error("Failed to verify fee");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveLoan = async () => {
    if (!finalAmount || !interestRate) return toast.error("Enter amount and interest rate");
    const amount = Number(finalAmount);
    const rate = Number(interestRate);
    const totalPayable = calculateTotalPayable(amount, rate);
    
    await handleUpdateStatus(LOAN_STATUS.APPROVED, {
      finalAmount: amount,
      finalInterestRate: rate,
      remainingBalance: totalPayable
    });
  };

  if (loading || !app) {
    return <AdminLayout><div className="flex h-screen items-center justify-center"><Spinner /></div></AdminLayout>;
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
            
            {/* Applicant Details */}
            <Card>
              <CardHeader>
                <CardTitle>Applicant Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Full Name</p>
                  <p className="font-semibold text-slate-900">{app.basicDetails?.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Phone</p>
                  <p className="font-semibold text-slate-900">{app.basicDetails?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-semibold text-slate-900">{app.basicDetails?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Address</p>
                  <p className="font-semibold text-slate-900">{app.basicDetails?.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* KYC Documents */}
            <Card>
              <CardHeader>
                <CardTitle>KYC Documents</CardTitle>
              </CardHeader>
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
            
            {/* Actions Pipeline */}
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
                        <a href={feeTxn.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1"><ExternalLink size={14}/> View Screenshot</a>
                        <Button className="w-full" onClick={handleVerifyFee} isLoading={actionLoading}>Verify Payment</Button>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">User has not uploaded fee proof yet.</p>
                    )
                  ) : (
                    <div className="flex items-center text-emerald-600 text-sm font-medium"><Check size={16} className="mr-1"/> Verified</div>
                  )}
                </div>

                {/* Step 2: KYC */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white outline-indigo-500 outline outline-offset-0 disabled:opacity-50">
                  <h4 className="font-bold text-slate-900 mb-2">Step 2: KYC Verification</h4>
                  {app.status === LOAN_STATUS.PENDING_KYC && (
                    <div className="space-y-2 mt-4">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => handleUpdateStatus(LOAN_STATUS.PENDING_APPROVAL)} isLoading={actionLoading}>
                        Approve KYC Documents
                      </Button>
                      <Button variant="danger" className="w-full" onClick={() => handleUpdateStatus(LOAN_STATUS.REJECTED)} isLoading={actionLoading}>
                        Reject application
                      </Button>
                    </div>
                  )}
                  {(![LOAN_STATUS.PENDING_PAYMENT, LOAN_STATUS.PENDING_KYC].includes(app.status)) && (
                    <div className="flex items-center text-emerald-600 text-sm font-medium"><Check size={16} className="mr-1"/> Verified</div>
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
                  {([LOAN_STATUS.APPROVED, LOAN_STATUS.DISBURSED].includes(app.status)) && (
                    <div className="flex items-center text-emerald-600 text-sm font-medium"><Check size={16} className="mr-1"/> Approved: {formatCurrency(app.finalAmount)} @ {app.finalInterestRate}%</div>
                  )}
                </div>

                {/* Step 4: Disburse */}
                {app.status === LOAN_STATUS.APPROVED && (
                  <div className="border border-slate-200 rounded-lg p-4 bg-emerald-50">
                    <h4 className="font-bold text-slate-900 mb-2">Step 4: Disbursal</h4>
                    <p className="text-xs text-slate-500 mb-4">Transfer {formatCurrency(app.finalAmount)} to the user's bank account, then mark as disbursed.</p>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => handleUpdateStatus(LOAN_STATUS.DISBURSED)} isLoading={actionLoading}>
                      Mark as Disbursed
                    </Button>
                  </div>
                )}
                {app.status === LOAN_STATUS.DISBURSED && (
                    <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4 flex items-center text-emerald-700 font-bold">
                        <Check size={20} className="mr-2"/> Loan is Active (Disbursed)
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
