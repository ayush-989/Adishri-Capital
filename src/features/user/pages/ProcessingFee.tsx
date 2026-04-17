import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MainLayout } from "../../../shared/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../../../shared/components/ui/Card";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { FileUpload } from "../../../shared/components/ui/FileUpload";
import { submitProcessingFee } from "../../../lib/controllers/application.controller";
import { ADMIN_UPI_ID, PROCESSING_FEE_AMOUNT, ROUTES } from "../../../utils/constants";
import { toast } from "react-toastify";
import { QrCode } from "lucide-react";
import { FadeUp } from "../../../shared/components/ui/FadeUp";

export function ProcessingFee() {
  const [searchParams] = useSearchParams();
  const loanId = searchParams.get("loanId");
  const navigate = useNavigate();

  const [utr, setUtr] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loanId) return toast.error("Missing Loan ID");
    if (!screenshot) return toast.error("Please upload payment screenshot");

    setLoading(true);
    try {
      await submitProcessingFee(loanId, utr, screenshot);
      toast.success("Payment submitted for verification");
      navigate(ROUTES.USER_DASHBOARD);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit payment");
    } finally {
      setLoading(false);
    }
  };

  if (!loanId) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-96 gap-4">
          <p className="text-gray-500 font-medium">No application reference found. Please apply first.</p>
          <Button onClick={() => navigate(ROUTES.LOAN_APPLICATION)}>Apply Now</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-[#f8fafc] min-h-[calc(100vh-64px)] py-12 sm:py-20 px-4 relative flex flex-col items-center overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-blue-400/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-indigo-400/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center mb-10 w-full relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">Processing Fee</h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto">Verify your payment to complete the application process.</p>
        </div>

        <div className="max-w-xl w-full relative z-10">
          <FadeUp delay={0.1}>
            <Card className="rounded-[2.5rem] shadow-[0_20px_50px_rgba(30,41,59,0.04)] border border-slate-200 ring-1 ring-slate-900/5 overflow-hidden">
              <CardHeader className="text-center pb-2 border-b border-gray-50/50 bg-slate-50/50 pt-8">
                <CardTitle className="text-xl font-bold text-slate-900">Payment Verification</CardTitle>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed px-4">
                  Please pay the processing fee of <strong className="text-slate-900 border-b-2 border-blue-500/30 font-bold">₹{PROCESSING_FEE_AMOUNT}</strong> for application{" "}
                  <span className="font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold tracking-tight">{loanId}</span>.
                </p>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center">
              <div className="w-48 h-48 bg-white border border-gray-200 rounded-2xl flex items-center justify-center p-4 mb-4 shadow-sm">
                <QrCode className="w-full h-full text-gray-800" />
              </div>
              <p className="text-sm text-gray-500 font-semibold mb-2 uppercase tracking-wide">Scan to Pay via UPI</p>
              <div className="flex items-center gap-2 text-lg font-bold text-gray-900 bg-white border border-gray-200 px-5 py-2.5 rounded-xl shadow-sm">
                UPI ID: <span className="font-mono tracking-tight text-blue-600">{ADMIN_UPI_ID}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Enter UTR / Transaction ID"
                required
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                placeholder="12-digit UPI reference number"
              />
              <FileUpload label="Upload Payment Screenshot" onChange={setScreenshot} />
                  <Button type="submit" className="w-full h-12 text-md font-bold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-sm" isLoading={loading}>
                    Complete Verification
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FadeUp>
        </div>
      </div>
    </MainLayout>
  );
}
