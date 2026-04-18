import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { Modal } from "../../../shared/components/ui/Modal";
import { Button } from "../../../shared/components/ui/Button";
import { usePendingRepayments } from "../../../hooks/usePendingRepayments";
import { verifyRepayment, rejectRepayment } from "../../../lib/controllers/admin.controller";
import { formatCurrency } from "../../../utils/helpers";
import {
  CheckCircle2, Eye, IndianRupee, FileText,
  Inbox, AlertTriangle, Zap, XCircle, X,
} from "lucide-react";

const HIGH_VALUE = 10_000;

// ─── Types ────────────────────────────────────────────────────────────────────

interface RejectTarget { txnId: string; loanId: string; amount: number }

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon, label, value, iconClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconClass: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4">
      <div className="flex items-center gap-3.5">
        <div className={`p-2.5 rounded-xl bg-blue-50 text-blue-600`}>{icon}</div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Screenshot modal ─────────────────────────────────────────────────────────

function ScreenshotModal({ url, utr, onClose }: { url: string; utr: string; onClose: () => void }) {
  return (
    <Modal isOpen onClose={onClose} title="Payment Screenshot">
      <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">UTR</span>
        <span className="font-mono text-[12px] font-semibold text-slate-700 select-all">{utr}</span>
      </div>
      <div className="flex items-center justify-center bg-slate-100 rounded-xl overflow-hidden min-h-52 border border-slate-200">
        <img src={url} alt="Payment screenshot" className="max-w-full max-h-[55vh] object-contain" />
      </div>
      <p className="text-[10px] text-slate-400 text-center mt-3">Click ✕ or outside to close</p>
    </Modal>
  );
}

// ─── Rejection modal ──────────────────────────────────────────────────────────

function RejectionModal({
  target,
  onConfirm,
  onClose,
}: {
  target: RejectTarget;
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea when modal opens
  useEffect(() => {
    const t = setTimeout(() => textareaRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, []);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      textareaRef.current?.focus();
      return;
    }
    setBusy(true);
    try {
      await onConfirm(reason);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Reject Repayment"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={busy}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={busy || !reason.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <XCircle size={15} />
            )}
            Confirm Rejection
          </button>
        </>
      }
    >
      {/* Transaction summary */}
      <div className="flex items-center justify-between p-3 mb-4 bg-red-50 border border-red-100 rounded-xl">
        <div>
          <p className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Transaction</p>
          <p className="text-sm font-bold text-slate-800 mt-0.5">{formatCurrency(target.amount)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Loan ID</p>
          <p className="font-mono text-[12px] font-semibold text-slate-700 mt-0.5">{target.loanId}</p>
        </div>
      </div>

      {/* Reason input */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Rejection Reason <span className="text-red-500">*</span>
        </label>
        <textarea
          ref={textareaRef}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. UTR not found, amount mismatch, duplicate submission…"
          rows={3}
          className="w-full px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400/40 focus:border-red-300 resize-none transition-all"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          This reason will be stored with the transaction record.
        </p>
      </div>
    </Modal>
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[24, 20, 32, 16, 12, 20].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className={`h-3.5 rounded-full bg-slate-100 w-${w}`} />
        </td>
      ))}
    </tr>
  );
}

// ─── Action buttons cell ──────────────────────────────────────────────────────

function ActionCell({
  txnId, loanId, amount,
  isApproving, isRejecting,
  onApprove, onReject,
}: {
  txnId: string; loanId: string; amount: number;
  isApproving: boolean; isRejecting: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const busy = isApproving || isRejecting;
  return (
    <div className="flex items-center gap-2">
      {/* Approve */}
      <Button
        size="sm"
        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm shadow-emerald-200 hover:shadow-emerald-300 transition-all"
        onClick={onApprove}
        isLoading={isApproving}
        disabled={busy}
      >
        {!isApproving && <CheckCircle2 size={13} />}
        Approve
      </Button>

      {/* Reject */}
      <button
        onClick={onReject}
        disabled={busy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 hover:border-red-300 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRejecting ? (
          <span className="w-3 h-3 border-2 border-red-400/40 border-t-red-500 rounded-full animate-spin" />
        ) : (
          <X size={13} />
        )}
        Reject
      </button>
    </div>
  );
}

// ─── RepaymentApprovals ───────────────────────────────────────────────────────

export function RepaymentApprovals() {
  const repayments = usePendingRepayments();
  const [hydrated, setHydrated]   = useState(false);
  const [approving, setApproving] = useState<Set<string>>(new Set());
  const [rejecting, setRejecting] = useState<Set<string>>(new Set());
  const [approved,  setApproved]  = useState<Set<string>>(new Set());
  const [rejected,  setRejected]  = useState<Set<string>>(new Set());
  const [preview,   setPreview]   = useState<{ url: string; utr: string } | null>(null);
  const [rejectTarget, setRejectTarget] = useState<RejectTarget | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setHydrated(true), 600);
    return () => clearTimeout(t);
  }, []);

  // ── Approve ──
  const handleApprove = async (txnId: string, loanId: string, amount: number) => {
    setApproving((p) => new Set(p).add(txnId));
    try {
      await verifyRepayment(txnId, loanId, amount);
      setApproved((p) => new Set(p).add(txnId));
      toast.success("Repayment approved and balance updated.");
    } catch {
      toast.error("Failed to approve repayment. Please try again.");
    } finally {
      setApproving((p) => { const n = new Set(p); n.delete(txnId); return n; });
    }
  };

  // ── Reject (called from modal confirm) ──
  const handleRejectConfirm = async (reason: string) => {
    if (!rejectTarget) return;
    const { txnId } = rejectTarget;
    setRejecting((p) => new Set(p).add(txnId));
    try {
      await rejectRepayment(txnId, reason);
      setRejected((p) => new Set(p).add(txnId));
      toast.error("Repayment rejected.");
      setRejectTarget(null);
    } catch {
      toast.error("Failed to reject repayment. Please try again.");
    } finally {
      setRejecting((p) => { const n = new Set(p); n.delete(txnId); return n; });
    }
  };

  // Filter out locally approved/rejected rows (real-time listener handles the rest)
  const visible = repayments.filter(
    (t) => !approved.has(t.id) && !rejected.has(t.id)
  );
  const totalPending   = visible.reduce((s, t) => s + t.amount, 0);
  const highValueCount = visible.filter((t) => t.amount >= HIGH_VALUE).length;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Repayment Approvals</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Review and approve or reject pending loan repayments</p>
      </div>

       {/* ── Stat cards ── */}
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <StatCard
           icon={<FileText size={18} className="text-blue-600" />}
           label="Pending Approvals"
           value={hydrated ? visible.length : "—"}
           iconClass="bg-blue-50/80"
         />
         <StatCard
           icon={<IndianRupee size={18} className="text-emerald-600" />}
           label="Total Pending Amount"
           value={hydrated ? formatCurrency(totalPending) : "—"}
           iconClass="bg-emerald-50/80"
         />
         <StatCard
           icon={<AlertTriangle size={18} className="text-amber-600" />}
           label={`High-Value (≥ ₹${(HIGH_VALUE / 1000).toFixed(0)}k)`}
           value={hydrated ? highValueCount : "—"}
           iconClass={highValueCount > 0 ? "bg-amber-50/80" : "bg-slate-50/80"}
         />
       </div>

       {/* ── Table card ── */}
       <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/40 overflow-hidden">

         {/* Toolbar */}
         <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100">
           <div className="flex items-center gap-2.5">
             <p className="text-sm font-semibold text-slate-800">Pending Repayments</p>
             {hydrated && visible.length > 0 && (
               <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50/80 border border-amber-200/60 px-2.5 py-1 rounded-full shadow-sm shadow-amber-200/30">
                 <Zap size={10} />
                 {visible.length} awaiting
               </span>
             )}
           </div>
         </div>

         {/* Empty state */}
         {hydrated && visible.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
             <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
               <Inbox size={24} className="opacity-40" />
             </div>
             <p className="text-sm font-semibold text-slate-600">No pending repayments</p>
             <p className="text-sm text-slate-500">All repayments have been reviewed.</p>
           </div>
         ) : (
           <>
{/* ── Desktop table ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/80">
                      {["Loan ID", "Amount", "UTR Number", "Date", "Screenshot", "Actions"].map((h) => (
                        <th key={h} className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/60">
                   {!hydrated
                     ? Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
                     : visible.map((txn, idx) => {
                         const isHigh      = txn.amount >= HIGH_VALUE;
                         const isApproving = approving.has(txn.id);
                         const isRejecting = rejecting.has(txn.id);
                         return (
                           <AnimatePresence key={txn.id}>
                             <motion.tr
                               initial={{ opacity: 1 }}
                               exit={{ opacity: 0, height: 0 }}
                               transition={{ duration: 0.2 }}
                               className={`group transition-colors ${
                                 isHigh
                                   ? "bg-amber-50/40 hover:bg-amber-50/60"
                                   : idx % 2 === 0
                                   ? "hover:bg-blue-50/20"
                                   : "bg-slate-50/30 hover:bg-blue-50/20"
                               }`}
                             >
                               {/* Loan ID */}
                               <td className="px-6 py-4">
                                 <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                                   {txn.loanId}
                                 </span>
                               </td>

                               {/* Amount */}
                               <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-bold text-slate-800">
                                     {formatCurrency(txn.amount)}
                                   </span>
                                   {isHigh && (
                                     <span className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">
                                       High Value
                                     </span>
                                   )}
                                 </div>
                               </td>

                               {/* UTR */}
                               <td className="px-6 py-4">
                                 <span className="font-mono text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg select-all">
                                   {txn.utr}
                                 </span>
                               </td>

                               {/* Date */}
                               <td className="px-6 py-4 text-sm text-slate-500">
                                 {txn.createdAt
                                   ? new Date(txn.createdAt).toLocaleDateString("en-IN", {
                                       day: "2-digit", month: "short", year: "numeric",
                                     })
                                   : "—"}
                               </td>

                               {/* Screenshot */}
                               <td className="px-6 py-4">
                                 <button
                                   onClick={() => setPreview({ url: txn.screenshotUrl, utr: txn.utr })}
                                   className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-2 rounded-xl transition-all hover:shadow-sm"
                                 >
                                   <Eye size={13} /> Preview
                                 </button>
                               </td>

                               {/* Actions */}
                               <td className="px-6 py-4">
                                <ActionCell
                                  txnId={txn.id}
                                  loanId={txn.loanId}
                                  amount={txn.amount}
                                  isApproving={isApproving}
                                  isRejecting={isRejecting}
                                  onApprove={() => handleApprove(txn.id, txn.loanId, txn.amount)}
                                  onReject={() => setRejectTarget({ txnId: txn.id, loanId: txn.loanId, amount: txn.amount })}
                                />
                              </td>
                            </motion.tr>
                          </AnimatePresence>
                        );
                      })}
                </tbody>
              </table>
            </div>

            {/* ── Mobile cards ── */}
            <div className="md:hidden divide-y divide-slate-100">
              {!hydrated ? (
                <div className="p-6 flex justify-center">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : visible.map((txn) => {
                const isHigh      = txn.amount >= HIGH_VALUE;
                const isApproving = approving.has(txn.id);
                const isRejecting = rejecting.has(txn.id);
                return (
                  <div key={txn.id} className={`p-4 space-y-3 ${isHigh ? "bg-amber-50/40" : ""}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-slate-900">{formatCurrency(txn.amount)}</span>
                          {isHigh && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">
                              High Value
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">{txn.loanId}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {txn.createdAt
                          ? new Date(txn.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
                          : "—"}
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-xl px-3 py-2 text-[11px] text-slate-600 font-mono border border-slate-100">
                      UTR: {txn.utr}
                    </div>

                       {/* Mobile action row */}
                       <div className="flex gap-2">
                         <button
                           onClick={() => setPreview({ url: txn.screenshotUrl, utr: txn.utr })}
                           className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-2.5 rounded-xl transition-colors"
                         >
                           <Eye size={13} /> Screenshot
                         </button>
                         <Button
                           size="sm"
                           className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                           onClick={() => handleApprove(txn.id, txn.loanId, txn.amount)}
                           isLoading={isApproving}
                           disabled={isApproving || isRejecting}
                         >
                           {!isApproving && <CheckCircle2 size={13} />}
                           Approve
                         </Button>
                         <button
                           onClick={() => setRejectTarget({ txnId: txn.id, loanId: txn.loanId, amount: txn.amount })}
                           disabled={isApproving || isRejecting}
                           className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                         >
                           {isRejecting
                             ? <span className="w-3 h-3 border-2 border-red-400/40 border-t-red-500 rounded-full animate-spin" />
                             : <X size={12} />
                           }
                           Reject
                         </button>
                       </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Screenshot modal ── */}
      {preview && (
        <ScreenshotModal url={preview.url} utr={preview.utr} onClose={() => setPreview(null)} />
      )}

      {/* ── Rejection modal ── */}
      {rejectTarget && (
        <RejectionModal
          target={rejectTarget}
          onConfirm={handleRejectConfirm}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
}
