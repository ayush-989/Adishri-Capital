import { useState, useEffect } from "react";
import { Button } from "../../../shared/components/ui/Button";
import { Modal } from "../../../shared/components/ui/Modal";
import { Spinner } from "../../../shared/components/ui/Spinner";
import { usePendingRepayments } from "../../../hooks/usePendingRepayments";
import { verifyRepayment } from "../../../lib/controllers/admin.controller";
import { formatCurrency } from "../../../utils/helpers";
import { CheckCircle2, Eye, IndianRupee, FileText, Inbox } from "lucide-react";

const HIGH_VALUE_THRESHOLD = 10_000;

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div className={`flex items-center gap-4 bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4`}>
      <div className={`p-2.5 rounded-lg ${accent}`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ScreenshotModal({
  url,
  utr,
  onClose,
}: {
  url: string;
  utr: string;
  onClose: () => void;
}) {
  return (
    <Modal isOpen onClose={onClose} title={`Payment Screenshot — UTR: ${utr}`}>
      <div className="flex items-center justify-center bg-slate-100 rounded-lg overflow-hidden min-h-48">
        <img
          src={url}
          alt="Payment screenshot"
          className="max-w-full max-h-[60vh] object-contain rounded"
        />
      </div>
      <p className="text-xs text-slate-400 text-center mt-3">
        Click outside or press ✕ to close
      </p>
    </Modal>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function RepaymentApprovals() {
  const repayments = usePendingRepayments();

  // null = still hydrating from Firestore real-time listener
  const [hydrated, setHydrated] = useState(false);
  const [approving, setApproving] = useState<Set<string>>(new Set());
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [preview, setPreview] = useState<{ url: string; utr: string } | null>(null);

  // Mark hydrated after first render cycle so we don't flash empty state
  useEffect(() => {
    const t = setTimeout(() => setHydrated(true), 600);
    return () => clearTimeout(t);
  }, []);

  const handleApprove = async (txnId: string, loanId: string, amount: number) => {
    setApproving((prev) => new Set(prev).add(txnId));
    try {
      await verifyRepayment(txnId, loanId, amount);
      setApproved((prev) => new Set(prev).add(txnId));
    } finally {
      setApproving((prev) => {
        const next = new Set(prev);
        next.delete(txnId);
        return next;
      });
    }
  };

  const visible = repayments.filter((t) => !approved.has(t.id));
  const totalPending = visible.reduce((s, t) => s + t.amount, 0);
  const highValueCount = visible.filter((t) => t.amount >= HIGH_VALUE_THRESHOLD).length;

  // ── Loading ──
  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Repayment Approvals</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review and approve pending loan repayments from borrowers.
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<FileText size={18} className="text-blue-600" />}
            label="Pending Approvals"
            value={visible.length}
            accent="bg-blue-50"
          />
          <StatCard
            icon={<IndianRupee size={18} className="text-emerald-600" />}
            label="Total Pending Amount"
            value={formatCurrency(totalPending)}
            accent="bg-emerald-50"
          />
          <StatCard
            icon={<Eye size={18} className="text-amber-600" />}
            label="High-Value (≥ ₹10k)"
            value={highValueCount}
            accent="bg-amber-50"
          />
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Pending Repayments</h2>
            {visible.length > 0 && (
              <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2.5 py-1 rounded-full">
                {visible.length} awaiting review
              </span>
            )}
          </div>

          {/* ── Empty State ── */}
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Inbox size={48} className="opacity-30" />
              <p className="text-base font-medium text-slate-500">No pending repayments</p>
              <p className="text-sm text-slate-400">All repayments have been reviewed.</p>
            </div>
          ) : (
            <>
              {/* ── Desktop Table ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide font-semibold">
                      <th className="text-left px-6 py-3">Loan ID</th>
                      <th className="text-left px-6 py-3">Amount</th>
                      <th className="text-left px-6 py-3">UTR Number</th>
                      <th className="text-left px-6 py-3">Date</th>
                      <th className="text-left px-6 py-3">Screenshot</th>
                      <th className="text-left px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visible.map((txn) => {
                      const isHighValue = txn.amount >= HIGH_VALUE_THRESHOLD;
                      const isApproving = approving.has(txn.id);
                      return (
                        <tr
                          key={txn.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            isHighValue ? "bg-amber-50/40" : ""
                          }`}
                        >
                          {/* Loan ID */}
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                              {txn.loanId}
                            </span>
                          </td>

                          {/* Amount */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">
                                {formatCurrency(txn.amount)}
                              </span>
                              {isHighValue && (
                                <span className="text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">
                                  High Value
                                </span>
                              )}
                            </div>
                          </td>

                          {/* UTR */}
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded select-all">
                              {txn.utr}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {txn.createdAt
                              ? new Date(txn.createdAt).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>

                          {/* Screenshot */}
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                setPreview({ url: txn.screenshotUrl, utr: txn.utr })
                              }
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <Eye size={13} /> Preview
                            </button>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-4">
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                              onClick={() => handleApprove(txn.id, txn.loanId, txn.amount)}
                              isLoading={isApproving}
                              disabled={isApproving}
                            >
                              {!isApproving && <CheckCircle2 size={14} />}
                              Approve
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ── Mobile Cards ── */}
              <div className="md:hidden divide-y divide-slate-100">
                {visible.map((txn) => {
                  const isHighValue = txn.amount >= HIGH_VALUE_THRESHOLD;
                  const isApproving = approving.has(txn.id);
                  return (
                    <div
                      key={txn.id}
                      className={`p-4 space-y-3 ${isHighValue ? "bg-amber-50/40" : ""}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-base">
                              {formatCurrency(txn.amount)}
                            </span>
                            {isHighValue && (
                              <span className="text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">
                                High Value
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs text-slate-500">{txn.loanId}</span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {txn.createdAt
                            ? new Date(txn.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                              })
                            : "—"}
                        </span>
                      </div>

                      <div className="bg-slate-50 rounded-lg px-3 py-2 text-xs text-slate-600 font-mono border border-slate-100">
                        UTR: {txn.utr}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setPreview({ url: txn.screenshotUrl, utr: txn.utr })
                          }
                          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-2 rounded-lg transition-colors"
                        >
                          <Eye size={13} /> View Screenshot
                        </button>
                        <Button
                          size="sm"
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                          onClick={() => handleApprove(txn.id, txn.loanId, txn.amount)}
                          isLoading={isApproving}
                          disabled={isApproving}
                        >
                          {!isApproving && <CheckCircle2 size={14} />}
                          Approve
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Screenshot Modal ── */}
      {preview && (
        <ScreenshotModal
          url={preview.url}
          utr={preview.utr}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}
