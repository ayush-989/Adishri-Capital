import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../../components/layout/MainLayout";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { FileUpload } from "../../components/ui/FileUpload";
import { db } from "../../firebase/config";
import { uploadFile } from "../../firebase/storage-helper";
import { doc, setDoc } from "firebase/firestore";
import { generateLoanId } from "../../utils/helpers";
import { LOAN_STATUS, ROUTES } from "../../utils/constants";
import { toast } from "react-toastify";

export function LoanApplicationForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form Data
  const [basicDetails, setBasicDetails] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  const [kycDetails, setKycDetails] = useState({
    panNumber: "",
    aadhaarNumber: "",
    accountNumber: "",
    ifsc: "",
  });

  // Files
  const [files, setFiles] = useState<{
    panImage: File | null;
    aadhaarFront: File | null;
    aadhaarBack: File | null;
    passbook: File | null;
  }>({
    panImage: null,
    aadhaarFront: null,
    aadhaarBack: null,
    passbook: null,
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate files
    if (!files.panImage || !files.aadhaarFront || !files.aadhaarBack || !files.passbook) {
      return toast.error("Please upload all required KYC documents");
    }

    setLoading(true);
    try {
      const loanId = generateLoanId();

      // Upload files
      const panUrl = await uploadFile(files.panImage, `kyc/${loanId}/pan`);
      const aadhaarFrontUrl = await uploadFile(files.aadhaarFront, `kyc/${loanId}/aadhaarFront`);
      const aadhaarBackUrl = await uploadFile(files.aadhaarBack, `kyc/${loanId}/aadhaarBack`);
      const passbookUrl = await uploadFile(files.passbook, `kyc/${loanId}/passbook`);

      const applicationData = {
        appId: loanId,
        status: LOAN_STATUS.PENDING_PAYMENT,
        basicDetails,
        kycDetails: {
          ...kycDetails,
          panUrl,
          aadhaarFrontUrl,
          aadhaarBackUrl,
          passbookUrl,
        },
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "applications", loanId), applicationData);
      
      toast.success("Application details saved.");
      navigate(`${ROUTES.PROCESSING_FEE}?loanId=${loanId}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Loan Application</h1>
          <p className="text-slate-600">Complete your profile to get instant approval.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className={`text-sm font-medium ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>Basic Details</span>
            <span className={`text-sm font-medium ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>KYC Uploads</span>
            <span className={`text-sm font-medium ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>Review</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-semibold mb-4">Step 1: Basic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    label="Full Name (As per PAN)" 
                    required 
                    value={basicDetails.fullName}
                    onChange={(e) => setBasicDetails({...basicDetails, fullName: e.target.value})}
                  />
                  <Input 
                    label="Phone Number" 
                    required 
                    value={basicDetails.phone}
                    onChange={(e) => setBasicDetails({...basicDetails, phone: e.target.value})}
                  />
                  <Input 
                    label="Email Address" 
                    type="email" 
                    required 
                    value={basicDetails.email}
                    onChange={(e) => setBasicDetails({...basicDetails, email: e.target.value})}
                  />
                  <Input 
                    label="Residential Address" 
                    required 
                    value={basicDetails.address}
                    onChange={(e) => setBasicDetails({...basicDetails, address: e.target.value})}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-semibold mb-4">Step 2: KYC & Bank Details</h3>
                <div className="space-y-4">
                  <Input 
                    label="PAN Number" 
                    required 
                    value={kycDetails.panNumber}
                    onChange={(e) => setKycDetails({...kycDetails, panNumber: e.target.value})}
                    className="uppercase"
                  />
                  <FileUpload 
                    label="Upload PAN Card Image" 
                    onChange={(file) => setFiles({...files, panImage: file})} 
                  />
                </div>
                <hr className="border-slate-100" />
                <div className="space-y-4">
                  <Input 
                    label="Aadhaar Number" 
                    required 
                    maxLength={12}
                    value={kycDetails.aadhaarNumber}
                    onChange={(e) => setKycDetails({...kycDetails, aadhaarNumber: e.target.value})}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FileUpload 
                      label="Aadhaar Front Image" 
                      onChange={(file) => setFiles({...files, aadhaarFront: file})} 
                    />
                    <FileUpload 
                      label="Aadhaar Back Image" 
                      onChange={(file) => setFiles({...files, aadhaarBack: file})} 
                    />
                  </div>
                </div>
                <hr className="border-slate-100" />
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Bank Account Number" 
                      required 
                      value={kycDetails.accountNumber}
                      onChange={(e) => setKycDetails({...kycDetails, accountNumber: e.target.value})}
                    />
                    <Input 
                      label="IFSC Code" 
                      required 
                      className="uppercase"
                      value={kycDetails.ifsc}
                      onChange={(e) => setKycDetails({...kycDetails, ifsc: e.target.value})}
                    />
                  </div>
                  <FileUpload 
                    label="Bank Passbook/Statement Image" 
                    onChange={(file) => setFiles({...files, passbook: file})} 
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <h3 className="text-xl font-semibold mb-4">Step 3: Review Details</h3>
                <div className="bg-slate-50 p-6 rounded-lg space-y-4 text-sm text-slate-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="font-medium">Name:</span> {basicDetails.fullName}</div>
                    <div><span className="font-medium">Phone:</span> {basicDetails.phone}</div>
                    <div><span className="font-medium">PAN:</span> {kycDetails.panNumber.toUpperCase()}</div>
                    <div><span className="font-medium">Aadhaar:</span> {kycDetails.aadhaarNumber}</div>
                    <div className="col-span-2"><span className="font-medium">Account No:</span> {kycDetails.accountNumber}</div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-200">
                    <p className="text-slate-500 italic">By clicking submit, you confirm that all details provided are accurate and authorize Adishri Capitals to verify your information.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end gap-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack} disabled={loading}>
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button type="submit">Next</Button>
              ) : (
                <Button type="submit" isLoading={loading}>
                  Submit Application
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
