import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  fetchDashboardStats,
  type DashboardStats,
} from "../../../lib/controllers/admin.controller";
import { formatCurrency } from "../../../utils/helpers";
import { ROUTES } from "../../../utils/constants";
import { StatCard } from "../../../shared/components/ui/StatCard";
import {
  Banknote, TrendingDown, TrendingUp, Users,
  AlertCircle, Activity, RefreshCw,
  ArrowRight, CheckCircle, Wallet,
} from "lucide-react";

// ─── Sparkline data ───────────────────────────────────────────────────────────

const SPARKLINE = [
  { month: "Feb", disbursed: 120000, recovered: 40000 },
  { month: "Mar", disbursed: 180000, recovered: 75000 },
  { month: "Apr", disbursed: 150000, recovered: 95000 },
  { month: "May", disbursed: 220000, recovered: 130000 },
  { month: "Jun", disbursed: 280000, recovered: 170000 },
  { month: "Jul", disbursed: 310000, recovered: 210000 },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const pageVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.3, delay: i * 0.08, ease: "easeOut" },
  }),
};

// ─── Card definitions ─────────────────────────────────────────────────────────

function buildCards(s: DashboardStats) {
  return [
    {
      label: "Total Exposure",
      value: formatCurrency(s.totalExposure),
      subtext: `${s.activeLoans} loan${s.activeLoans !== 1 ? "s" : ""} disbursed`,
      icon: Banknote,
      trend: "up" as const,
      trendLabel: "Active portfolio",
      gradient: "from-blue-50 to-indigo-50/50",
      iconClass: "text-blue-600 bg-blue-100",
      href: ROUTES.ADMIN_LOANS,
    },
    {
      label: "Pending Recovery",
      value: formatCurrency(s.pendingRecoveries),
      subtext: "Outstanding balance",
      icon: TrendingDown,
      trend: "down" as const,
      trendLabel: "Needs attention",
      gradient: "from-rose-50 to-pink-50/50",
      iconClass: "text-rose-600 bg-rose-100",
      valueClass: "text-rose-700",
      href: ROUTES.ADMIN_RECOVERY,
    },
    {
      label: "Total Recovered",
      value: formatCurrency(s.totalRecovered),
      subtext: "Verified repayments",
      icon: TrendingUp,
      trend: "up" as const,
      trendLabel: "On track",
      gradient: "from-emerald-50 to-teal-50/50",
      iconClass: "text-emerald-600 bg-emerald-100",
      valueClass: "text-emerald-700",
      href: ROUTES.ADMIN_RECOVERY,
    },
    {
      label: "Registered Users",
      value: s.totalUsers.toLocaleString("en-IN"),
      subtext: "Platform borrowers",
      icon: Users,
      trend: "up" as const,
      trendLabel: "Growing",
      gradient: "from-violet-50 to-purple-50/50",
      iconClass: "text-violet-600 bg-violet-100",
      href: ROUTES.ADMIN_USERS,
    },
    {
      label: "Pending Actions",
      value: s.pendingVerifications.toLocaleString("en-IN"),
      subtext: "Need review",
      icon: AlertCircle,
      trend: (s.pendingVerifications > 0 ? "down" : "neutral") as "down" | "neutral",
      trendLabel: s.pendingVerifications > 0 ? "Requires action" : "All clear",
      gradient: s.pendingVerifications > 0 ? "from-amber-50 to-orange-50/50" : "from-slate-50 to-gray-50/50",
      iconClass: s.pendingVerifications > 0 ? "text-amber-600 bg-amber-100" : "text-slate-400 bg-slate-100",
      valueClass: s.pendingVerifications > 0 ? "text-amber-700" : "text-slate-900",
      href: ROUTES.ADMIN_LEADS,
    },
    {
      label: "Active Loans",
      value: s.activeLoans.toLocaleString("en-IN"),
      subtext: "Currently disbursed",
      icon: Activity,
      trend: "up" as const,
      trendLabel: "Performing",
      gradient: "from-teal-50 to-cyan-50/50",
      iconClass: "text-teal-600 bg-teal-100",
      href: ROUTES.ADMIN_LOANS,
    },
  ];
}

const recoveryPct = (s: DashboardStats) =>
  s.totalExposure > 0
    ? Math.min(100, Math.round((s.totalRecovered / s.totalExposure) * 100))
    : 0;

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 animate-pulse"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-10 h-10 rounded-xl bg-slate-100" />
        <div className="w-20 h-4 rounded-full bg-slate-100" />
      </div>
      <div className="space-y-2.5">
        <div className="w-24 h-3 rounded-full bg-slate-100" />
        <div className="w-32 h-7 rounded-lg bg-slate-200" />
        <div className="w-20 h-3 rounded-full bg-slate-100" />
      </div>
    </motion.div>
  );
}

// ─── Chart tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3.5 py-2.5 text-xs">
      <p className="font-bold text-slate-700 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-slate-500 capitalize">{p.name}:</span>
          <span className="font-bold text-slate-800">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Animated recovery bar ────────────────────────────────────────────────────

function RecoveryBar({ stats }: { stats: DashboardStats }) {
  const pct = recoveryPct(stats);
  const barColor = pct >= 75 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-400" : "bg-rose-400";
  const textColor = pct >= 75 ? "text-emerald-600" : pct >= 40 ? "text-amber-500" : "text-rose-500";

  return (
    <motion.div
      custom={3}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-slate-800">Recovery Progress</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {formatCurrency(stats.totalRecovered)} of {formatCurrency(stats.totalExposure)}
          </p>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-black tabular-nums ${textColor}`}>{pct}%</span>
          <p className="text-[10px] text-slate-400 mt-0.5">recovered</p>
        </div>
      </div>

      <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </div>

      <div className="flex justify-between mt-2 text-[10px] text-slate-400">
        <span>₹0</span>
        <span>{formatCurrency(stats.totalExposure)}</span>
      </div>
    </motion.div>
  );
}

// ─── Quick actions ────────────────────────────────────────────────────────────

function QuickActions({ pendingCount }: { pendingCount: number }) {
  const actions = [
    {
      label: "Review Applications",
      desc: `${pendingCount} pending`,
      href: ROUTES.ADMIN_LEADS,
      icon: Users,
      colorClass: "text-blue-600 bg-blue-50 border-blue-100 hover:border-blue-200",
      dot: pendingCount > 0,
    },
    {
      label: "Approve Repayments",
      desc: "Check pending",
      href: ROUTES.ADMIN_REPAYMENTS,
      icon: CheckCircle,
      colorClass: "text-emerald-600 bg-emerald-50 border-emerald-100 hover:border-emerald-200",
      dot: false,
    },
  ];

  return (
    <motion.div
      custom={4}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 mb-3">
        Quick Actions
      </p>
      <div className="space-y-2">
        {actions.map((a) => (
          <motion.div key={a.href} whileHover={{ x: 2 }} transition={{ duration: 0.12 }}>
            <Link
              to={a.href}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm ${a.colorClass}`}
            >
              <a.icon size={15} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold truncate">{a.label}</p>
                <p className="text-[10px] opacity-60">{a.desc}</p>
              </div>
              {a.dot && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
              <ArrowRight size={13} className="opacity-30 shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Bottom metric pills ──────────────────────────────────────────────────────

function MetricPill({
  label, value, color, bg, border, index,
}: {
  label: string; value: number; color: string;
  bg: string; border: string; index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className={`${bg} border ${border} rounded-2xl px-5 py-4`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-black tabular-nums ${color}`}>
        {value.toLocaleString("en-IN")}
      </p>
    </motion.div>
  );
}

// ─── AdminDashboard ───────────────────────────────────────────────────────────

const EMPTY: DashboardStats = {
  totalExposure: 0, activeLoans: 0, pendingRecoveries: 0,
  totalRecovered: 0, totalUsers: 0, pendingVerifications: 0,
};

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-6 sm:p-8 space-y-6 max-w-[1400px] mx-auto"
    >

      {/* ── Header ── */}
      <motion.div
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5">Platform-wide financial summary</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </motion.button>
      </motion.div>

      {/* ── Error banner ── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3"
          >
            <div className="flex items-center gap-2 text-sm text-red-700">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
            <button onClick={load} className="text-xs font-semibold text-red-600 hover:underline shrink-0">
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stat cards grid ── */}
      <motion.div
        custom={1}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)
            : cards.map((card, i) => <StatCard key={card.label} {...card} index={i} />)
          }
        </div>
      </motion.div>

      {/* ── Chart + right panel ── */}
      {!loading && !error && (
        <motion.div
          custom={2}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        >
          {/* Area chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm font-semibold text-slate-800">Portfolio Trend</p>
                <p className="text-xs text-slate-400 mt-0.5">Disbursed vs Recovered — last 6 months</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-semibold">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-3 h-1.5 rounded-full bg-blue-500" />
                  Disbursed
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-3 h-1.5 rounded-full bg-emerald-500" />
                  Recovered
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={SPARKLINE} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }} />
                <Area type="monotone" dataKey="disbursed" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gD)" dot={false} activeDot={{ r: 4, fill: "#3b82f6" }} />
                <Area type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={2.5} fill="url(#gR)" dot={false} activeDot={{ r: 4, fill: "#10b981" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {stats.totalExposure > 0 && <RecoveryBar stats={stats} />}
            <QuickActions pendingCount={stats.pendingVerifications} />
          </div>
        </motion.div>
      )}

      {/* ── Bottom metric pills ── */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricPill
            label="Active Loans"
            value={stats.activeLoans}
            color="text-teal-600"
            bg="bg-teal-50"
            border="border-teal-100"
            index={5}
          />
          <MetricPill
            label="Pending Verifications"
            value={stats.pendingVerifications}
            color={stats.pendingVerifications > 0 ? "text-amber-600" : "text-slate-700"}
            bg={stats.pendingVerifications > 0 ? "bg-amber-50" : "bg-slate-50"}
            border={stats.pendingVerifications > 0 ? "border-amber-100" : "border-slate-100"}
            index={6}
          />
          <MetricPill
            label="Registered Users"
            value={stats.totalUsers}
            color="text-violet-600"
            bg="bg-violet-50"
            border="border-violet-100"
            index={7}
          />
        </div>
      )}

    </motion.div>
  );
}
