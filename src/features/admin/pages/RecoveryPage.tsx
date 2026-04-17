import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllTransactions } from "../../../lib/services/transaction.service";
import { formatCurrency } from "../../../utils/helpers";
import { ROUTES } from "../../../utils/constants";
import type { Transaction } from "../../../lib/models/transaction.model";
import {
  ArrowLeft, TrendingUp, TrendingDown, Inbox,
  AlertCircle, IndianRupee, SlidersHorizontal, AlertTriangle,
} from "lucide-react";

const HIGH_VALUE = 10_000;

type FilterType = "all" | "verified" | "pending" | "rejected";

// ─── Status badge ─────────────────────────────────────────────────────────────

function TxnBadge({ txn }: { txn: Transaction }) {
  if (txn.status === "rejected")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-red-50 text-red-700 border-red-200">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" /> Rejected
      </span>
    );
  if (txn.verified)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" /> Verified
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border bg-amber-50 text-amber-700 border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" /> Pending
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[20, 24, 28, 20, 16].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className={`h-3.5 rounded-full bg-slate-100 w-${w}`} />
        </td>
      ))}
    </tr>
  );
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({ icon, label, value, color, bg }: {
  icon: React.ReactNode; label: string; value: string; color: string; bg: string;
}) {
  return (
    <div className={`${bg} rounded-2xl border border-slate-200/60 shadow-sm px-5 py-4 flex items-center gap-4`}>
      <div className={`p-2.5 rounded-xl bg-white/60 ${color}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
        <p className="text-xl font-black text-slate-900 tabular-nums mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── RecoveryPage ─────────────────────────────────────────────────────────────

const FILTER_OPTIONS: Array<{ label: string; value: FilterType }> = [
  { label: "All",      value: "all"      },
  { label: "Verified", value: "verified" },
  { label: "Pending",  value: "pending"  },
  { label: "Rejected", value: "rejected" },
];

export function RecoveryPage() {
  const navigate = useNavigate();
  const [txns,    setTxns]    = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [filter,  setFilter]  = useState<FilterType>("all");

  useEffect(() => {
    getAllTransactions()
      .then((all) => setTxns(all.filter((t) => t.type === "repayment")))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all")      return txns;
    if (filter === "verified") return txns.filter((t) => t.verified);
    if (filter === "rejected") return txns.filter((t) => t.status === "rejected");
    return txns.filter((t) => !t.verified && t.status !== "rejected");
  }, [txns, filter]);

  const totalRecovered = txns.filter(t => t.verified).reduce((s, t) => s + t.amount, 0);
  const totalPending   = txns.filter(t => !t.verified && t.status !== "rejected").reduce((s, t) => s + t.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 sm:p-8 space-y-5 max-w-[1400px] mx-auto"
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-0.5">
            <span
              className="hover:text-blue-500 cursor-pointer transition-colors"
              onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
            >
              Dashboard
            </span>
            <span>/</span>
            <span className="text-slate-700 font-medium">Recovery</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Repayment Recovery</h1>
        </div>
      </div>

      {/* ── Summary cards ── */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            icon={<IndianRupee size={16} />}
            label="Total Repayments"
            value={txns.length.toLocaleString("en-IN")}
            color="text-blue-600"
            bg="bg-gradient-to-br from-blue-50 to-indigo-50/50"
          />
          <SummaryCard
            icon={<TrendingUp size={16} />}
            label="Total Recovered"
            value={formatCurrency(totalRecovered)}
            color="text-emerald-600"
            bg="bg-gradient-to-br from-emerald-50 to-teal-50/50"
          />
          <SummaryCard
            icon={<TrendingDown size={16} />}
            label="Pending Amount"
            value={formatCurrency(totalPending)}
            color="text-amber-600"
            bg="bg-gradient-to-br from-amber-50 to-orange-50/50"
          />
        </div>
      )}

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <p className="text-[13px] font-bold text-slate-800">
            Repayment Transactions
            {!loading && (
              <span className="ml-2 text-[11px] font-normal text-slate-400">
                {filtered.length} of {txns.length}
              </span>
            )}
          </p>
          <div className="relative">
            <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="h-8 pl-8 pr-7 rounded-xl border border-slate-200 bg-slate-50 text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 appearance-none cursor-pointer"
            >
              {FILTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-5 py-4 text-sm text-red-600 bg-red-50 border-b border-red-100">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                {["Loan ID", "Amount", "UTR Number", "Date", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Inbox size={32} className="opacity-30" />
                      <p className="text-sm font-medium text-slate-500">No transactions found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((txn, idx) => {
                  const isHigh    = txn.amount >= HIGH_VALUE;
                  const isPending = !txn.verified && txn.status !== "rejected";
                  return (
                    <tr
                      key={txn.id}
                      className={`transition-colors ${
                        isPending
                          ? "bg-amber-50/30 hover:bg-amber-50/60"
                          : idx % 2 !== 0
                          ? "bg-slate-50/40 hover:bg-blue-50/20"
                          : "hover:bg-blue-50/20"
                      }`}
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                          {txn.loanId}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-bold text-slate-900">
                            {formatCurrency(txn.amount)}
                          </span>
                          {isHigh && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded-full">
                              High Value
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[11px] text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg select-all">
                          {txn.utr}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-slate-500">
                        {txn.createdAt
                          ? new Date(txn.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit", month: "short", year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <TxnBadge txn={txn} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Rejection reason tooltip row */}
        {filtered.some(t => t.status === "rejected" && t.rejectionReason) && (
          <div className="px-5 py-3 bg-red-50/60 border-t border-red-100 flex items-center gap-2">
            <AlertTriangle size={12} className="text-red-400 shrink-0" />
            <p className="text-[11px] text-red-600">
              Hover a rejected row to see the rejection reason (stored in Firestore).
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
