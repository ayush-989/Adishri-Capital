import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllLoans } from "../../../lib/services/loan.service";
import { formatCurrency } from "../../../utils/helpers";
import { ROUTES } from "../../../utils/constants";
import type { Loan, LoanStatus } from "../../../lib/models/loan.model";
import {
  ArrowLeft, Activity, Inbox, AlertCircle,
  Banknote, TrendingDown, SlidersHorizontal,
} from "lucide-react";

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CFG: Record<LoanStatus, { dot: string; badge: string; label: string }> = {
  active:    { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200",  label: "Active"    },
  closed:    { dot: "bg-slate-400",   badge: "bg-slate-50 text-slate-600 border-slate-200",        label: "Closed"    },
  defaulted: { dot: "bg-rose-400",    badge: "bg-rose-50 text-rose-700 border-rose-200",           label: "Defaulted" },
};

function StatusBadge({ status }: { status: LoanStatus }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.closed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
      {cfg.label}
    </span>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[20, 28, 24, 24, 24, 16].map((w, i) => (
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
    <div className={`${bg} rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-4`}>
      <div className={`p-2.5 rounded-xl bg-white/60 ${color}`}>{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── LoansPage ────────────────────────────────────────────────────────────────

const FILTER_OPTIONS: Array<{ label: string; value: LoanStatus | "all" }> = [
  { label: "All",       value: "all"      },
  { label: "Active",    value: "active"   },
  { label: "Closed",    value: "closed"   },
  { label: "Defaulted", value: "defaulted"},
];

export function LoansPage() {
  const navigate = useNavigate();
  const [loans,   setLoans]   = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [filter,  setFilter]  = useState<LoanStatus | "all">("all");

  useEffect(() => {
    getAllLoans()
      .then(setLoans)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() =>
    filter === "all" ? loans : loans.filter((l) => l.status === filter),
    [loans, filter]
  );

  const totalExposure  = loans.filter(l => l.status === "active").reduce((s, l) => s + l.totalAmount, 0);
  const totalRemaining = loans.filter(l => l.status === "active").reduce((s, l) => s + l.remainingBalance, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto"
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
           <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
             <span
               className="hover:text-blue-600 cursor-pointer transition-colors"
               onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
             >
               Dashboard
             </span>
             <span>/</span>
             <span className="text-slate-700 font-medium">Loans</span>
           </div>
           <h1 className="text-2xl font-bold text-slate-800 tracking-tight">All Loans</h1>
         </div>
       </div>

       {/* ── Summary cards ── */}
       {!loading && !error && (
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <SummaryCard
             icon={<Activity size={18} />}
             label="Total Loans"
             value={loans.length.toLocaleString("en-IN")}
             color="text-blue-600"
             bg="bg-gradient-to-br from-blue-50 to-indigo-50/50"
           />
           <SummaryCard
             icon={<Banknote size={18} />}
             label="Active Exposure"
             value={formatCurrency(totalExposure)}
             color="text-teal-600"
             bg="bg-gradient-to-br from-teal-50 to-cyan-50/50"
           />
           <SummaryCard
             icon={<TrendingDown size={18} />}
             label="Pending Recovery"
             value={formatCurrency(totalRemaining)}
             color="text-rose-600"
             bg="bg-gradient-to-br from-rose-50 to-pink-50/50"
           />
         </div>
       )}

       {/* ── Table card ── */}
       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

         {/* Toolbar */}
         <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
           <p className="text-sm font-semibold text-slate-800">
             Loan Portfolio
             {!loading && (
               <span className="ml-2 text-xs font-normal text-slate-500">
                 {filtered.length} of {loans.length}
               </span>
             )}
           </p>
           <div className="relative">
             <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
             <select
               value={filter}
               onChange={(e) => setFilter(e.target.value as LoanStatus | "all")}
               className="h-9 pl-8 pr-7 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 appearance-none cursor-pointer transition-all"
             >
               {FILTER_OPTIONS.map((o) => (
                 <option key={o.value} value={o.value}>{o.label}</option>
               ))}
             </select>
           </div>
         </div>

         {/* Error */}
         {error && (
           <div className="flex items-center gap-2 px-6 py-4 text-sm text-red-600 bg-red-50 border-b border-red-200">
             <AlertCircle size={16} />
             {error}
           </div>
         )}

         {/* Table */}
         <div className="overflow-x-auto">
           <table className="w-full text-sm text-left">
             <thead>
               <tr className="bg-slate-50 border-b border-slate-200">
                 {["Loan ID", "User ID", "Total Amount", "Remaining Balance", "Interest Rate", "Status"].map((h) => (
                   <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                     {h}
                   </th>
                 ))}
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Inbox size={32} className="opacity-30" />
                      <p className="text-sm font-medium text-slate-500">No loans found</p>
                      <p className="text-xs">Try changing the filter</p>
                    </div>
                  </td>
                </tr>
               ) : (
                 filtered.map((loan, idx) => (
                   <tr
                     key={loan.id}
                     className={`hover:bg-slate-50 transition-colors ${idx % 2 !== 0 ? "bg-slate-50/50" : ""}`}
                   >
                     <td className="px-6 py-4">
                       <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                         {loan.loanId}
                       </span>
                     </td>
                     <td className="px-6 py-4">
                       <span className="font-mono text-xs text-slate-500 truncate max-w-[120px] block">
                         {loan.userId}
                       </span>
                     </td>
                     <td className="px-6 py-4 font-semibold text-slate-800">
                       {formatCurrency(loan.totalAmount)}
                     </td>
                     <td className="px-6 py-4">
                       <span className={`text-sm font-semibold ${loan.remainingBalance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                         {formatCurrency(loan.remainingBalance)}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-sm text-slate-600">
                       {loan.interestRate}%
                     </td>
                     <td className="px-6 py-4">
                       <StatusBadge status={loan.status} />
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
           </table>
         </div>
       </div>
      
    </motion.div>
  );
}
