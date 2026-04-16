import { useState, useEffect } from "react";
import {
  fetchDashboardStats,
  type DashboardStats,
} from "../../../lib/controllers/admin.controller";
import { formatCurrency } from "../../../utils/helpers";
import {
  Banknote,
  TrendingDown,
  TrendingUp,
  Users,
  AlertCircle,
  Activity,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  accent: string;       // value text colour
  iconBg: string;       // icon wrapper bg
  iconColor: string;    // icon colour
  border: string;       // card top-border accent
}

// ─── Card config ──────────────────────────────────────────────────────────────

function buildCards(s: DashboardStats): StatCard[] {
  return [
    {
      label:     "Total Loan Exposure",
      value:     formatCurrency(s.totalExposure),
      subtext:   `${s.activeLoans} loan${s.activeLoans !== 1 ? "s" : ""} disbursed`,
      icon:      Banknote,
      accent:    "text-slate-900",
      iconBg:    "bg-blue-50",
      iconColor: "text-blue-600",
      border:    "border-t-blue-500",
    },
    {
      label:     "Pending Recovery",
      value:     formatCurrency(s.pendingRecoveries),
      subtext:   "Outstanding balance",
      icon:      TrendingDown,
      accent:    "text-rose-600",
      iconBg:    "bg-rose-50",
      iconColor: "text-rose-500",
      border:    "border-t-rose-500",
    },
    {
      label:     "Total Recovered",
      value:     formatCurrency(s.totalRecovered),
      subtext:   "Verified repayments",
      icon:      TrendingUp,
      accent:    "text-emerald-600",
      iconBg:    "bg-emerald-50",
      iconColor: "text-emerald-600",
      border:    "border-t-emerald-500",
    },
    {
      label:     "Active Users",
      value:     s.totalUsers.toLocaleString("en-IN"),
      subtext:   "Registered on platform",
      icon:      Users,
      accent:    "text-slate-900",
      iconBg:    "bg-indigo-50",
      iconColor: "text-indigo-600",
      border:    "border-t-indigo-500",
    },
    {
      label:     "Pending Actions",
      value:     s.pendingVerifications.toLocaleString("en-IN"),
      subtext:   "Applications need review",
      icon:      AlertCircle,
      accent:    s.pendingVerifications > 0 ? "text-amber-600" : "text-slate-900",
      iconBg:    s.pendingVerifications > 0 ? "bg-amber-50" : "bg-slate-100",
      iconColor: s.pendingVerifications > 0 ? "text-amber-500" : "text-slate-400",
      border:    s.pendingVerifications > 0 ? "border-t-amber-500" : "border-t-slate-300",
    },
    {
      label:     "Active Loans",
      value:     s.activeLoans.toLocaleString("en-IN"),
      subtext:   "Currently disbursed",
      icon:      Activity,
      accent:    "text-slate-900",
      iconBg:    "bg-teal-50",
      iconColor: "text-teal-600",
      border:    "border-t-teal-500",
    },
  ];
}

const recoveryPct = (s: DashboardStats) =>
  s.totalExposure > 0
    ? Math.min(100, Math.round((s.totalRecovered / s.totalExposure) * 100))
    : 0;

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-9 w-9 rounded-xl bg-slate-100" />
        <div className="h-4 w-16 rounded-full bg-slate-100" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-24 rounded bg-slate-100" />
        <div className="h-7 w-32 rounded bg-slate-200" />
        <div className="h-3 w-20 rounded bg-slate-100" />
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ card }: { card: StatCard }) {
  const Icon = card.icon;
  return (
    <div
      className={`
        group relative bg-white rounded-2xl border border-slate-100 border-t-2 shadow-sm
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5
        ${card.border}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg}`}>
          <Icon size={18} className={card.iconColor} />
        </div>
        <ArrowUpRight
          size={15}
          className="text-slate-300 group-hover:text-slate-400 transition-colors"
        />
      </div>

      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
        {card.label}
      </p>
      <p className={`text-[22px] font-bold leading-tight tracking-tight ${card.accent}`}>
        {card.value}
      </p>
      <p className="text-[12px] text-slate-400 mt-1">{card.subtext}</p>
    </div>
  );
}

// ─── Recovery bar ─────────────────────────────────────────────────────────────

function RecoveryBar({ stats }: { stats: DashboardStats }) {
  const pct = recoveryPct(stats);
  const barColor =
    pct >= 75 ? "bg-emerald-500" :
    pct >= 40 ? "bg-amber-400"  :
                "bg-rose-400";
  const textColor =
    pct >= 75 ? "text-emerald-600" :
    pct >= 40 ? "text-amber-500"   :
                "text-rose-500";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[13px] font-bold text-slate-800">Recovery Progress</p>
          <p className="text-[12px] text-slate-400 mt-0.5">
            {formatCurrency(stats.totalRecovered)} recovered of{" "}
            {formatCurrency(stats.totalExposure)} total exposure
          </p>
        </div>
        <span className={`text-2xl font-extrabold tabular-nums ${textColor}`}>
          {pct}%
        </span>
      </div>

      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between mt-2.5 text-[11px] text-slate-400">
        <span>₹0</span>
        <span>{formatCurrency(stats.totalExposure)}</span>
      </div>
    </div>
  );
}

// ─── Secondary metrics row ────────────────────────────────────────────────────

function MetricPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </p>
      <p className={`text-xl font-bold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}

// ─── AdminDashboard ───────────────────────────────────────────────────────────

const EMPTY: DashboardStats = {
  totalExposure: 0,
  activeLoans: 0,
  pendingRecoveries: 0,
  totalRecovered: 0,
  totalUsers: 0,
  pendingVerifications: 0,
};

export function AdminDashboard() {
  const [stats, setStats]   = useState<DashboardStats>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    fetchDashboardStats()
      .then(setStats)
      .catch(() => setError("Could not load dashboard data."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cards = buildCards(stats);

  return (
    <div className="space-y-6">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-bold text-slate-800 leading-tight">
              Overview
            </h2>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Platform-wide financial summary
            </p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <div className="flex items-center gap-2.5 text-[13px] text-red-700">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
            <button
              onClick={load}
              className="text-[12px] font-semibold text-red-600 hover:text-red-700 underline underline-offset-2 shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : cards.map((card) => <StatCard key={card.label} card={card} />)
          }
        </div>

        {/* ── Recovery progress ── */}
        {!loading && !error && stats.totalExposure > 0 && (
          <RecoveryBar stats={stats} />
        )}

        {/* ── Secondary metrics ── */}
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row gap-4">
            <MetricPill
              label="Active Loans"
              value={stats.activeLoans.toLocaleString("en-IN")}
              color="text-teal-600"
            />
            <MetricPill
              label="Pending Verifications"
              value={stats.pendingVerifications.toLocaleString("en-IN")}
              color={stats.pendingVerifications > 0 ? "text-amber-600" : "text-slate-700"}
            />
            <MetricPill
              label="Registered Users"
              value={stats.totalUsers.toLocaleString("en-IN")}
              color="text-indigo-600"
            />
          </div>
        )}

      </div>
  );
}
