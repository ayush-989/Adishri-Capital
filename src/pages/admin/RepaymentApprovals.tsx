import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { toast } from "react-toastify";
import { formatCurrency } from "../../utils/helpers";
import { ExternalLink, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export function RepaymentApprovals() {
  const [repayments, setRepayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "transactions"), where("type", "==", "repayment"), where("verified", "==", false));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRepayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleVerifyRepayment = async (txn: any) => {
    setLoading(true);
    try {
      // Mark txn as verified
      await updateDoc(doc(db, "transactions", txn.id), { verified: true });
      
      // Update Loan Balance
      const loanRef = doc(db, "applications", txn.loanId);
      const loanSnap = await getDoc(loanRef);
      if (loanSnap.exists()) {
        const loanData = loanSnap.data();
        const currentBalance = loanData.remainingBalance !== undefined ? loanData.remainingBalance : loanData.finalAmount;
        const newBalance = Math.max(0, currentBalance - txn.amount);
        
        await updateDoc(loanRef, { remainingBalance: newBalance });
      }
      
      toast.success("Repayment verified and loan balance updated");
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Pending Repayments</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repayments.map((txn) => (
            <Card key={txn.id} className="border-amber-200 bg-amber-50/30">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{formatCurrency(txn.amount)}</h3>
                    <p className="text-sm font-mono text-slate-500">Loan: {txn.loanId}</p>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    {format(new Date(txn.createdAt), "MMM dd, yyyy")}
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-slate-200 mb-4 text-sm">
                  <span className="font-semibold text-slate-700">UTR:</span> {txn.utr}
                </div>

                <div className="space-y-4">
                  <a href={txn.screenshotUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full p-2 border border-blue-200 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm font-medium">
                    <ExternalLink size={16} className="mr-2" /> View Screenshot
                  </a>
                  
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => handleVerifyRepayment(txn)} isLoading={loading}>
                    <CheckCircle size={16} className="mr-2" />
                    Verify Repayment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {repayments.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
              No pending repayment approvals.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
