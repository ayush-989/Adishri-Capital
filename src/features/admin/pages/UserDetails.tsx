import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getUser } from "../../../lib/services/user.service";
import { getLoansByUser } from "../../../lib/services/loan.service";
import { getAllByLoanId } from "../../../lib/services/transaction.service";
import { formatCurrency } from "../../../utils/helpers";
import { ROUTES } from "../../../utils/constants";
import type { AppUser } from "../../../lib/models/user.model";
import type { Loan, LoanStatus } from "../../../lib/models/loan.model";
import type { Transaction } from "../../../lib/models/transaction.model";
import {
  ArrowLeft, UserCircle, Shield, Phone, Mail,
  Banknote, TrendingDown, Activity, CheckCircle2,
  Clock, XCircle, ChevronDown, ChevronUp, Inbox,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
];

function Avatar({ email, size = "lg" }: { email: string | null; size?: "sm" | "lg" }) {
  const letter = (email?.[0] ?? "U").toUpperCase();
  const color  = AVATAR_COLORS[(email?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
  const dim    = size === "lg" ? "w-16 h-16 text-2xl" : "w-9 h-9 text-[12px]";
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold shrink-0 shadow-md`}>
      {letter}
    </div>
  );
}

// ─── Loan status badge ────────────────────────────────────────────────────────

const LOAN_STATUS_CFG: Record<LoanStatus, { dot: string; badge: string; label: string }> = {
  active:    { dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200",  label: "Active"    },
  closed:    { dot: "bg-slate-400",   badge: "bg-slate-50 text-slate-600 border-slate-200",        label: "Closed"    },
  defaulted: { dot: "bg-rose-400",    badge: "bg-rose-50 text-rose-700 border-rose-200",           label: "Defaulted" },
};

function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const cfg = LOAN_STATUS_CFG[status] ?? LOAN_STATUS_CFG.closed;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── EMI row status ───────────────────────────────────────────────────────────

function EmiStatus({ txn }: { txn: Transaction }) {
  if (txn.status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
        <XCircle size={13} /> Rejected
      </span>
    );
  if (txn.verified)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
        <CheckCircle2 size={13} /> Paid
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
      <Clock size={13} /> Pending
    </span>
  );
}

function StatPill({ icon, label, value, bg, border }: {
  icon: React.ReactNode; label: string; value: string; bg: string; border: string;
}) {
  return (
    <div className={`${bg} ${border} rounded-2xl px-5 py-4 border`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
      </div>
      <p className={`text-xl font-bold text-slate-800`}>
        {value}
      </p>
    </div>
  );
}

// ─── Loan card with expandable EMI table ──────────────────────────────────────

function LoanCard({ loan }: { loan: Loan }) {
  const [txns,     setTxns]     = useState<Transaction[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [loaded,   setLoaded]   = useState(false);

  const handleExpand = async () => {
    if (!loaded) {
      setLoading(true);
      try {
        const all = await getAllByLoanId(loan.loanId);
        // Only repayments, sorted oldest-first for running balance
        setTxns(
          all
            .filter((t) => t.type === "repayment")
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        );
        setLoaded(true);
      } finally {
        setLoading(false);
      }
    }
    setExpanded((v) => !v);
  };

  // Build EMI rows with running balance
  const emiRows = (() => {
    let balance = loan.totalPayable;
    return txns.map((txn) => {
      const before = balance;
      if (txn.verified) balance = Math.max(0, balance - txn.amount);
      return { txn, balanceBefore: before, balanceAfter: balance };
    });
  })();

  const paidCount   = txns.filter((t) => t.verified).length;
  const totalPaid   = txns.filter((t) => t.verified).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* Loan header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg">
                {loan.loanId}
              </span>
              <LoanStatusBadge status={loan.status} />
            </div>
            <p className="text-xs text-slate-500">
              Disbursed {loan.disbursedAt
                ? new Date(loan.disbursedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                : "—"}
            </p>
          </div>
          <button
            onClick={handleExpand}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all hover:shadow-sm"
          >
            {loading ? (
              <span className="w-3 h-3 border-2 border-blue-400/40 border-t-blue-500 rounded-full animate-spin" />
            ) : expanded ? (
              <ChevronUp size={12} />
            ) : (
              <ChevronDown size={12} />
            )}
            {expanded ? "Hide EMI" : "View EMI"}
          </button>
        </div>

        {/* Loan stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
          <StatPill
            icon={<Banknote size={14} />}
            label="Principal"
            value={formatCurrency(loan.totalAmount)}
            bg="bg-blue-50"
            border="border-blue-100"
          />
          <StatPill
            icon={<Activity size={14} />}
            label="Total Payable"
            value={formatCurrency(loan.totalPayable)}
            bg="bg-violet-50"
            border="border-violet-100"
          />
          <StatPill
            icon={<CheckCircle2 size={14} />}
            label="Paid"
            value={formatCurrency(totalPaid)}
            bg="bg-emerald-50"
            border="border-emerald-100"
          />
          <StatPill
            icon={<TrendingDown size={14} />}
            label="Remaining"
            value={formatCurrency(loan.remainingBalance)}
            bg={loan.remainingBalance > 0 ? "bg-rose-50 border border-rose-100" : "bg-slate-50 border border-slate-200"}
            border={loan.remainingBalance > 0 ? "border-rose-100" : "border-slate-200"}
          />
        </div>

        {/* Progress bar */}
        {loan.totalPayable > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Repayment progress</span>
              <span>{Math.round((totalPaid / loan.totalPayable) * 100)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (totalPaid / loan.totalPayable) * 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* EMI table */}
      {expanded && (
        <div className="border-t border-slate-100">
          {emiRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
              <Inbox size={24} className="opacity-30" />
              <p className="text-[12px] font-medium">No repayments recorded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    {["#", "Date", "UTR", "EMI Amount", "Balance Before", "Balance After", "Status"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {emiRows.map(({ txn, balanceBefore, balanceAfter }, i) => (
                   <tr
                     key={txn.id}
                     className={`transition-colors ${
                       txn.verified
                         ? i % 2 === 0 ? "hover:bg-emerald-50/20" : "bg-slate-50/30 hover:bg-emerald-50/20"
                         : "bg-amber-50/20 hover:bg-amber-50/40"
                     }`}
                   >
                       <td className="px-4 py-3 text-xs font-bold text-slate-500">{i + 1}</td>
                       <td className="px-4 py-3 text-sm text-slate-600">
                        {txn.createdAt
                          ? new Date(txn.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit", month: "short", year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded select-all">
                          {txn.utr}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[13px] font-bold text-slate-900">
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-slate-500">
                        {formatCurrency(balanceBefore)}
                      </td>
                      <td className="px-4 py-3 text-[12px] font-semibold">
                        <span className={balanceAfter < balanceBefore ? "text-emerald-600" : "text-slate-500"}>
                          {formatCurrency(balanceAfter)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <EmiStatus txn={txn} />
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Summary footer */}
                <tfoot>
                  <tr className="bg-slate-50 border-t border-slate-200">
                    <td colSpan={3} className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Total ({paidCount} paid)
                    </td>
                    <td className="px-4 py-2.5 text-[13px] font-black text-slate-900">
                      {formatCurrency(totalPaid)}
                    </td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── UserDetails ──────────────────────────────────────────────────────────────

export function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user,    setUser]    = useState<AppUser | null>(null);
  const [loans,   setLoans]   = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([getUser(id), getLoansByUser(id)])
      .then(([u, l]) => {
        if (!u) { navigate(ROUTES.ADMIN_USERS); return; }
        setUser(u);
        setLoans(l);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const totalBorrowed  = loans.reduce((s, l) => s + l.totalAmount, 0);
  const totalRemaining = loans.reduce((s, l) => s + l.remainingBalance, 0);
  const activeLoans    = loans.filter((l) => l.status === "active").length;

  if (loading) {
    return (
      <div className="p-6 sm:p-8 space-y-5 max-w-[1400px] mx-auto animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-slate-100" />
        <div className="h-40 rounded-2xl bg-slate-100" />
        <div className="h-64 rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 sm:p-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
          <XCircle size={16} />
          <span className="text-sm font-medium">{error ?? "User not found"}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto"
    >
       {/* ── Header ── */}
       <div className="flex items-center gap-3.5">
         <button
           onClick={() => navigate(ROUTES.ADMIN_USERS)}
           className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-all"
         >
           <ArrowLeft size={18} />
         </button>
         <div>
           <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-medium">
             <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}>
               Dashboard
             </span>
             <span>/</span>
             <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate(ROUTES.ADMIN_USERS)}>
               Users
             </span>
             <span>/</span>
             <span className="text-slate-700 font-semibold truncate max-w-[120px]">
               {user.email?.split("@")[0] ?? id}
             </span>
           </div>
           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Profile</h1>
         </div>
       </div>

      {/* ── Profile card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
          <Avatar email={user.email} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-slate-800">
                {user.email?.split("@")[0] ?? "Unknown User"}
              </h2>
              {user.role === "admin" ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  <Shield size={9} /> Admin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200">
                  <UserCircle size={9} /> Borrower
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              {user.email && (
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Mail size={13} className="text-slate-400" />
                  {user.email}
                </div>
              )}
              {user.phoneNumber && (
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Phone size={13} className="text-slate-400" />
                  {user.phoneNumber}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">UID: {user.uid}</p>
          </div>
        </div>

        {/* Financial summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-slate-200">
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-1">Total Loans</p>
            <p className="text-2xl font-bold text-blue-700">{loans.length}</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1">Active Loans</p>
            <p className="text-2xl font-bold text-emerald-700">{activeLoans}</p>
          </div>
          <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-500 mb-1">Total Borrowed</p>
            <p className="text-xl font-bold text-violet-700">{formatCurrency(totalBorrowed)}</p>
          </div>
          <div className={`${totalRemaining > 0 ? "bg-rose-50 border border-rose-100" : "bg-slate-50 border border-slate-200"} rounded-2xl p-4`}>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${totalRemaining > 0 ? "text-rose-500" : "text-slate-500"}`}>
              Remaining
            </p>
            <p className={`text-xl font-bold ${totalRemaining > 0 ? "text-rose-700" : "text-slate-700"}`}>
              {formatCurrency(totalRemaining)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Loans section ── */}
      <div>
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
          Loan History ({loans.length})
        </h2>

        {loans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
            <Inbox size={32} className="opacity-30" />
            <p className="text-sm font-medium text-slate-500">No loans found for this user</p>
          </div>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
