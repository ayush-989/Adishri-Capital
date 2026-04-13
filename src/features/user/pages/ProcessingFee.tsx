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
        <div className="flex justify-center items-center h-96">
          <p className="text-slate-500">No application reference found. Please apply first.</p>
          <Button onClick={() => navigate(ROUTES.LOAN_APPLICATION)} className="ml-4">Apply Now</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-xl mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Processing Fee Application</CardTitle>
            <p className="text-slate-600 mt-2">
              Please pay the processing fee of <strong className="text-slate-900">₹{PROCESSING_FEE_AMOUNT}</strong> to continue with application{" "}
              <span className="font-mono bg-slate-100 px-2 py-1 rounded">{loanId}</span>.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col items-center">
              <div className="w-48 h-48 bg-white border-2 border-slate-300 rounded-xl flex items-center justify-center p-4 mb-4 shadow-sm">
                <QrCode className="w-full h-full text-slate-800" />
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">Scan to Pay via UPI</p>
              <div className="flex items-center gap-2 text-lg font-bold text-slate-900 bg-slate-200/50 px-4 py-2 rounded-lg">
                UPI ID: {ADMIN_UPI_ID}
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
              <Button type="submit" className="w-full h-12 text-md" isLoading={loading}>
                Submit Payment Verification
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
