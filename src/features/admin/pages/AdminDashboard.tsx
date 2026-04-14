import { useState, useEffect } from "react";
import { AdminLayout } from "../../../shared/components/layout/AdminLayout";
import { Card, CardContent } from "../../../shared/components/ui/Card";
import { Spinner } from "../../../shared/components/ui/Spinner";
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
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCardConfig {
  label: string;
  value: string;
  subtext: string;
  icon: React.ReactNode;
  valueColor: string;
  iconClass: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildStatCards(s: DashboardStats): StatCardConfig[] {
  return [
    {
      label: "Total Loan Exposure",
      value: formatCurrency(s.totalExposure),
      subtext: `${s.activeLoans} loan${s.activeLoans !== 1 ? "s" : ""} disbursed`,
      icon: <Banknote size={18} />,
      valueColor: "text-slate-900",
      iconClass: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending Recovery",
      value: formatCurrency(s.pendingRecoveries),
      subtext: "Outstanding across active loans",
      icon: <TrendingDown size={18} />,
      valueColor: "text-rose-600",
      iconClass: "bg-rose-50 text-rose-500",
    },
    {
      label: "Total Recovered",
      value: formatCurrency(s.totalRecovered),
      subtext: "From verified repayments",
      icon: <TrendingUp size={18} />,
      valueColor: "text-emerald-600",
      iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Active Users",
      value: s.totalUsers.toLocaleString("en-IN"),
      subtext: "Registered on platform",
      icon: <Users size={18} />,
      valueColor: "text-slate-900",
      iconClass: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Pending Verifications",
      value: s.pendingVerifications.toLocaleString("en-IN"),
      subtext: "Applications awaiting action",
      icon: <AlertCircle size={18} />,
      valueColor: s.pendingVerifications > 0 ? "text-amber-600" : "text-slate-900",
      iconClass:
        s.pendingVerifications > 0
          ? "bg-amber-50 text-amber-500"
          : "bg-slate-100 text-slate-400",
    },
    {
      label: "Active Loans",
      value: s.activeLoans.toLocaleString("en-IN"),
      subtext: "Currently disbursed & running",
      icon: <Activity size={18} />,
      valueColor: "text-slate-900",
      iconClass: "bg-teal-50 text-teal-600",
    },
  ];
}

const recoveryPercent = (s: DashboardStats): number =>
  s.totalExposure > 0
    ? Math.min(100, Math.round((s.totalRecovered / s.totalExposure) * 100))
    : 0;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between animate-pulse">
          <div className="space-y-3 flex-1">
            <div className="h-3 w-28 bg-slate-200 rounded" />
            <div className="h-7 w-36 bg-slate-200 rounded" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
          <div className="h-9 w-9 rounded-lg bg-slate-100" />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const INITIAL_STATS: DashboardStats = {
  totalExposure: 0,
  activeLoans: 0,
  pendingRecoveries: 0,
  totalRecovered: 0,
  totalUsers: 0,
  pendingVerifications: 0,
};

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => setError("Could not load dashboard data. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const cards = buildStatCards(stats);
  const pct = recoveryPercent(stats);

  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Platform-wide financial overview
            </p>
          </div>
          {loading && <Spinner className="h-5 w-5 text-slate-400" />}
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Stat Cards — skeleton while loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : cards.map((card) => (
                <Card
                  key={card.label}
                  className="hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 truncate">
                          {card.label}
                        </p>
                        <p className={`text-2xl font-bold leading-tight ${card.valueColor}`}>
                          {card.value}
                        </p>
                        <p className="text-xs text-slate-400">{card.subtext}</p>
                      </div>
                      <div
                        className={`shrink-0 h-9 w-9 rounded-lg flex items-center justify-center ${card.iconClass}`}
                      >
                        {card.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Recovery Progress */}
        {!loading && !error && stats.totalExposure > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Recovery Progress
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatCurrency(stats.totalRecovered)} recovered of{" "}
                    {formatCurrency(stats.totalExposure)} total exposure
                  </p>
                </div>
                <span
                  className={`text-lg font-bold tabular-nums ${
                    pct >= 75
                      ? "text-emerald-600"
                      : pct >= 40
                      ? "text-amber-500"
                      : "text-rose-500"
                  }`}
                >
                  {pct}%
                </span>
              </div>

              {/* Track */}
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    pct >= 75
                      ? "bg-emerald-500"
                      : pct >= 40
                      ? "bg-amber-400"
                      : "bg-rose-400"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                <span>₹0</span>
                <span>{formatCurrency(stats.totalExposure)}</span>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </AdminLayout>
  );
}
