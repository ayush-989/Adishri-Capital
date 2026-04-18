import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../../../shared/components/layout/MainLayout";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { FileUpload } from "../../../shared/components/ui/FileUpload";
import { submitLoanApplication } from "../../../lib/controllers/application.controller";
import { ROUTES } from "../../../utils/constants";
import { toast } from "react-toastify";

export function LoanApplicationForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [basicDetails, setBasicDetails] = useState({
    fullName: "", phone: "", email: "", address: "",
  });

  const [kycDetails, setKycDetails] = useState({
    panNumber: "", aadhaarNumber: "", accountNumber: "", ifsc: "",
  });

  const [files, setFiles] = useState<{
    panImage: File | null;
    aadhaarFront: File | null;
    aadhaarBack: File | null;
    passbook: File | null;
  }>({ panImage: null, aadhaarFront: null, aadhaarBack: null, passbook: null });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.panImage || !files.aadhaarFront || !files.aadhaarBack || !files.passbook) {
      return toast.error("Please upload all required KYC documents");
    }
    setLoading(true);
    try {
      const loanId = await submitLoanApplication(
        basicDetails,
        kycDetails,
        files as { panImage: File; aadhaarFront: File; aadhaarBack: File; passbook: File }
      );
      toast.success("Application details saved.");
      navigate(`${ROUTES.PROCESSING_FEE}?loanId=${loanId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-14">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Loan Application</h1>
          <p className="text-slate-500 text-lg font-medium">Complete your profile to get instant approval.</p>
        </div>

        <div className="mb-10">
          <div className="flex justify-between mb-3">
            <span className={`text-sm font-bold ${step >= 1 ? "text-blue-600" : "text-slate-400"}`}>Basic Details</span>
            <span className={`text-sm font-bold ${step >= 2 ? "text-blue-600" : "text-slate-400"}`}>KYC Uploads</span>
            <span className={`text-sm font-bold ${step >= 3 ? "text-blue-600" : "text-slate-400"}`}>Review</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 shadow-sm shadow-blue-500/30" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200/60">
          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
                  Basic Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name (As per PAN)" required value={basicDetails.fullName} onChange={(e) => setBasicDetails({ ...basicDetails, fullName: e.target.value })} />
                  <Input label="Phone Number" required value={basicDetails.phone} onChange={(e) => setBasicDetails({ ...basicDetails, phone: e.target.value })} />
                  <Input label="Email Address" type="email" required value={basicDetails.email} onChange={(e) => setBasicDetails({ ...basicDetails, email: e.target.value })} />
                  <Input label="Residential Address" required value={basicDetails.address} onChange={(e) => setBasicDetails({ ...basicDetails, address: e.target.value })} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
                  KYC & Bank Details
                </h3>
                <div className="space-y-6">
                  <div className="p-5 rounded-xl bg-slate-50/50 border border-slate-200/60">
                    <p className="text-sm font-bold text-slate-700 mb-4">PAN Details</p>
                    <Input label="PAN Number" required value={kycDetails.panNumber} onChange={(e) => setKycDetails({ ...kycDetails, panNumber: e.target.value })} className="uppercase" />
                    <div className="mt-4"><FileUpload label="Upload PAN Card Image" onChange={(file) => setFiles({ ...files, panImage: file })} /></div>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-700">Aadhaar Details</p>
                    <Input label="Aadhaar Number" required maxLength={12} value={kycDetails.aadhaarNumber} onChange={(e) => setKycDetails({ ...kycDetails, aadhaarNumber: e.target.value })} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FileUpload label="Aadhaar Front Image" onChange={(file) => setFiles({ ...files, aadhaarFront: file })} />
                      <FileUpload label="Aadhaar Back Image" onChange={(file) => setFiles({ ...files, aadhaarBack: file })} />
                    </div>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="space-y-4">
                    <p className="text-sm font-bold text-slate-700">Bank Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Bank Account Number" required value={kycDetails.accountNumber} onChange={(e) => setKycDetails({ ...kycDetails, accountNumber: e.target.value })} />
                      <Input label="IFSC Code" required className="uppercase" value={kycDetails.ifsc} onChange={(e) => setKycDetails({ ...kycDetails, ifsc: e.target.value })} />
                    </div>
                    <FileUpload label="Bank Passbook/Statement Image" onChange={(file) => setFiles({ ...files, passbook: file })} />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">3</span>
                  Review Details
                </h3>
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/20 p-6 rounded-2xl border border-slate-200/60 space-y-5 text-sm">
                  <div className="grid grid-cols-2 gap-5">
                    <div><span className="font-bold text-slate-600">Name:</span> <span className="text-slate-800 font-semibold">{basicDetails.fullName}</span></div>
                    <div><span className="font-bold text-slate-600">Phone:</span> <span className="text-slate-800 font-semibold">{basicDetails.phone}</span></div>
                    <div><span className="font-bold text-slate-600">Email:</span> <span className="text-slate-800 font-semibold">{basicDetails.email}</span></div>
                    <div><span className="font-bold text-slate-600">PAN:</span> <span className="text-slate-800 font-semibold uppercase">{kycDetails.panNumber}</span></div>
                    <div><span className="font-bold text-slate-600">Aadhaar:</span> <span className="text-slate-800 font-semibold">{kycDetails.aadhaarNumber}</span></div>
                    <div className="col-span-2"><span className="font-bold text-slate-600">Account No:</span> <span className="text-slate-800 font-semibold">{kycDetails.accountNumber}</span></div>
                  </div>
                  <div className="pt-5 mt-5 border-t border-slate-200">
                    <p className="text-slate-500 italic text-xs leading-relaxed">By clicking submit, you confirm that all details provided are accurate and authorize Adishri Capitals to verify your information.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 flex justify-end gap-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} disabled={loading} className="px-6">Back</Button>
              )}
              {step < 3 ? (
                <Button type="submit" className="px-8">Next</Button>
              ) : (
                <Button type="submit" isLoading={loading} className="px-8">Submit Application</Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
