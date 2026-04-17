import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../../../shared/components/layout/MainLayout";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { FadeUp } from "../../../shared/components/ui/FadeUp";
import { FileUpload } from "../../../shared/components/ui/FileUpload";
import { submitLoanApplication } from "../../../lib/controllers/application.controller";
import { ROUTES } from "../../../utils/constants";
import { toast } from "react-toastify";
import { ShieldCheck, Clock, Wallet, Check, ArrowRight } from "lucide-react";

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
      <div className="bg-[#fcfdff] min-h-[calc(100vh-64px)] py-12 sm:py-20 px-4 relative flex flex-col items-center overflow-hidden">
        {/* Modern Background Decorations */}
        <div className="absolute top-0 right-[-10%] w-[40rem] h-[40rem] bg-blue-400/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-400/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          
          {/* Left Column: Context & Trust (Visible on all screens) */}
          <div className="lg:col-span-4 flex flex-col space-y-8 pt-4">
            <FadeUp delay={0.1}>
              <div className="space-y-2 text-center lg:text-left">
                <span className="text-blue-600 font-black text-xs uppercase tracking-[0.2em]">Application Portal</span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-[1.1]">Complete Your <br className="hidden sm:block"/><span className="text-blue-600 underline decoration-blue-200 decoration-4 underline-offset-8">Dream Request</span></h2>
                <p className="text-slate-500 text-base sm:text-lg pt-4 leading-relaxed max-w-md mx-auto lg:mx-0">Join 10,000+ Indians who trust Adishri for transparent and fast funding.</p>
              </div>
            </FadeUp>

            <div className="space-y-4 pt-4">
              {[
                { icon: ShieldCheck, title: "100% Secure", desc: "Military-grade encryption for your documents.", color: "bg-blue-600" },
                { icon: Clock, title: "Fast Approval", desc: "Get sanctioned in as little as 24 hours.", color: "bg-indigo-600" },
                { icon: Wallet, title: "Zero Paperwork", desc: "No physical visits. Fully digital process.", color: "bg-slate-900" }
              ].map((item, i) => (
                <FadeUp key={item.title} delay={0.2 + (i * 0.1)}>
                  <div className="flex gap-5 p-5 rounded-3xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow ring-1 ring-slate-900/5">
                    <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/10`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-8 flex flex-col">
            <FadeUp delay={0.2}>
              <div className="bg-white p-6 sm:p-10 lg:p-14 rounded-[2.5rem] shadow-[0_20px_50px_rgba(30,41,59,0.04)] border border-slate-200 relative overflow-hidden ring-1 ring-slate-900/5">
                {/* Colorful top bar decoration */}
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900" />
                
                {/* Mobile Title (Hidden on Large) */}
                <div className="lg:hidden text-center mb-10 pt-4">
                  <h1 className="text-2xl font-black text-slate-400/30 uppercase tracking-[0.3em] mb-2 italic">Fill Details</h1>
                </div>

                {/* Beautiful 3-Dot Stepper */}
                <div className="mb-12 max-w-md mx-auto">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full" />
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full transition-all duration-500 ease-out" 
                      style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                    />

                    {[
                      { id: 1, label: "Profile" },
                      { id: 2, label: "Documents" },
                      { id: 3, label: "Review" }
                    ].map((s) => (
                      <div key={s.id} className="relative flex flex-col items-center z-10 w-10">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                            step >= s.id ? "bg-blue-600 text-white ring-8 ring-blue-50" : "bg-white text-slate-300 border-2 border-slate-100"
                          }`}
                        >
                          {step > s.id ? <Check className="w-5 h-5" strokeWidth={3} /> : s.id}
                        </div>
                        <span className={`absolute top-12 whitespace-nowrap text-[10px] font-black tracking-widest uppercase transition-colors duration-500 ${
                          step >= s.id ? "text-blue-600" : "text-slate-400"
                        }`}>
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 relative">
                  {/* Step Indicators in text */}
                  <div className="mb-10 text-center lg:text-left">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm mb-4 inline-block border border-blue-100">Step {step} of 3</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {step === 1 ? "Tell us about yourself" : step === 2 ? "Upload your documents" : "Verify and Submit"}
                    </h3>
                  </div>

                  <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }}>
                    {step === 1 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="Full Name (As per PAN)" required value={basicDetails.fullName} onChange={(e) => setBasicDetails({ ...basicDetails, fullName: e.target.value })} className="h-14 border-slate-200 rounded-xl focus:border-blue-500" />
                          <Input label="Phone Number" required value={basicDetails.phone} onChange={(e) => setBasicDetails({ ...basicDetails, phone: e.target.value })} className="h-14 border-slate-200 rounded-xl focus:border-blue-500" />
                          <Input label="Email Address" type="email" required value={basicDetails.email} onChange={(e) => setBasicDetails({ ...basicDetails, email: e.target.value })} className="h-14 border-slate-200 rounded-xl focus:border-blue-500" />
                          <Input label="Residential Address" required value={basicDetails.address} onChange={(e) => setBasicDetails({ ...basicDetails, address: e.target.value })} className="h-14 border-slate-200 rounded-xl focus:border-blue-500" />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-6">
                          <Input label="PAN Number" required value={kycDetails.panNumber} onChange={(e) => setKycDetails({ ...kycDetails, panNumber: e.target.value })} className="uppercase h-14 border-slate-200 rounded-xl" />
                          <FileUpload label="Upload PAN Card Image" onChange={(file) => setFiles({ ...files, panImage: file })} />
                        </div>
                        <div className="h-px bg-slate-100 w-full" />
                        <div className="space-y-6">
                          <Input label="Aadhaar Number" required maxLength={12} value={kycDetails.aadhaarNumber} onChange={(e) => setKycDetails({ ...kycDetails, aadhaarNumber: e.target.value })} className="h-14 border-slate-200 rounded-xl" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileUpload label="Aadhaar Front" onChange={(file) => setFiles({ ...files, aadhaarFront: file })} />
                            <FileUpload label="Aadhaar Back" onChange={(file) => setFiles({ ...files, aadhaarBack: file })} />
                          </div>
                        </div>
                        <div className="h-px bg-slate-100 w-full" />
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Bank Account Number" required value={kycDetails.accountNumber} onChange={(e) => setKycDetails({ ...kycDetails, accountNumber: e.target.value })} className="h-14 border-slate-200 rounded-xl" />
                            <Input label="IFSC Code" required className="uppercase h-14 border-slate-200 rounded-xl" value={kycDetails.ifsc} onChange={(e) => setKycDetails({ ...kycDetails, ifsc: e.target.value })} />
                          </div>
                          <FileUpload label="Bank Proof (Passbook/Statement)" onChange={(file) => setFiles({ ...files, passbook: file })} />
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-slate-50 border border-slate-100 p-8 sm:p-10 rounded-[2.5rem] space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <div className="flex flex-col"><span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Full Name</span><span className="font-bold text-slate-900 text-xl">{basicDetails.fullName}</span></div>
                            <div className="flex flex-col"><span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Phone Number</span><span className="font-bold text-slate-900 text-xl">{basicDetails.phone}</span></div>
                            <div className="flex flex-col"><span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">PAN Card</span><span className="font-bold text-slate-900 text-xl tracking-tight">{kycDetails.panNumber.toUpperCase()}</span></div>
                            <div className="flex flex-col"><span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Aadhaar No.</span><span className="font-bold text-slate-900 text-xl tracking-tight">{kycDetails.aadhaarNumber}</span></div>
                          </div>
                          
                          <div className="pt-8 border-t border-slate-200/60">
                            <div className="flex items-start gap-4 text-slate-600 bg-white/50 p-5 rounded-3xl border border-white/80">
                              <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                              <p className="text-sm leading-relaxed font-medium">By clicking confirm, you authorize Adishri Capitals to verify your identity and perform a secure credit assessment.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-50 pt-10">
                      <div className="order-2 sm:order-1">
                        {step > 1 && (
                          <Button type="button" variant="outline" onClick={() => setStep(step - 1)} disabled={loading} className="px-10 h-14 rounded-2xl border-slate-200 font-bold hover:bg-slate-50 text-slate-600">
                            Back
                          </Button>
                        )}
                      </div>
                      <Button type="submit" isLoading={loading} className="w-full sm:w-auto order-1 sm:order-2 px-12 h-14 font-black rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-900/20 text-lg transition-all active:scale-95 group">
                        {step === 3 ? "Confirm & Submit" : "Next Step"}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
