import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllUsers } from "../../../lib/services/user.service";
import { getAllLoans } from "../../../lib/services/loan.service";
import { formatCurrency } from "../../../utils/helpers";
import { ROUTES } from "../../../utils/constants";
import type { AppUser } from "../../../lib/models/user.model";
import type { Loan } from "../../../lib/models/loan.model";
import {
  Search, Users, Shield, UserCircle,
  Eye, Inbox, AlertCircle, ArrowLeft,
} from "lucide-react";

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
];

function Avatar({ email }: { email: string | null }) {
  const letter = (email?.[0] ?? "U").toUpperCase();
  const color  = AVATAR_COLORS[(email?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
  return (
    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-[12px] font-bold shrink-0 shadow-sm`}>
      {letter}
    </div>
  );
}

// ─── Role badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: AppUser["role"] }) {
  return role === "admin" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-blue-50 text-blue-700 border-blue-200">
      <Shield size={9} /> Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-slate-50 text-slate-600 border-slate-200">
      <UserCircle size={9} /> Borrower
    </span>
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-3.5 rounded-full bg-slate-100 w-24" />
        </td>
      ))}
    </tr>
  );
}

// ─── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({ icon, label, value, gradient, iconColor }: {
  icon: React.ReactNode; label: string; value: string | number;
  gradient: string; iconColor: string;
}) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl border border-slate-200/60 shadow-sm px-5 py-4 flex items-center gap-4`}>
      <div className={`p-2.5 rounded-xl bg-white/60 ${iconColor}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
        <p className="text-xl font-black text-slate-900 tabular-nums mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── UsersPage ────────────────────────────────────────────────────────────────

interface UserRow extends AppUser {
  totalLoans: number;
  activeLoans: number;
  totalBorrowed: number;
}

export function UsersPage() {
  const navigate = useNavigate();
  const [users,   setUsers]   = useState<AppUser[]>([]);
  const [loans,   setLoans]   = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    Promise.all([getAllUsers(), getAllLoans()])
      .then(([u, l]) => { setUsers(u); setLoans(l); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Enrich each user with loan stats
  const rows: UserRow[] = useMemo(() =>
    users.map((u) => {
      const userLoans = loans.filter((l) => l.userId === u.uid);
      return {
        ...u,
        totalLoans:    userLoans.length,
        activeLoans:   userLoans.filter((l) => l.status === "active").length,
        totalBorrowed: userLoans.reduce((s, l) => s + l.totalAmount, 0),
      };
    }),
    [users, loans]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      r.email?.toLowerCase().includes(q) ||
      r.phoneNumber?.includes(q) ||
      r.uid.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const borrowerCount = users.filter((u) => u.role === "user").length;
  const adminCount    = users.filter((u) => u.role === "admin").length;

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
            <span className="text-slate-700 font-medium">Users</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">User Management</h1>
        </div>
      </div>

      {/* ── Summary cards ── */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            icon={<Users size={16} />}
            label="Total Users"
            value={users.length}
            gradient="from-violet-50 to-purple-50/50"
            iconColor="text-violet-600"
          />
          <SummaryCard
            icon={<UserCircle size={16} />}
            label="Borrowers"
            value={borrowerCount}
            gradient="from-blue-50 to-indigo-50/50"
            iconColor="text-blue-600"
          />
          <SummaryCard
            icon={<Shield size={16} />}
            label="Admins"
            value={adminCount}
            gradient="from-emerald-50 to-teal-50/50"
            iconColor="text-emerald-600"
          />
        </div>
      )}

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by email or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 focus:bg-white transition-all"
            />
          </div>
          {!loading && (
            <span className="ml-auto text-[11px] text-slate-400 font-medium shrink-0">
              {filtered.length} of {users.length} users
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-5 py-4 text-sm text-red-600 bg-red-50 border-b border-red-100">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                {["User", "Phone", "Role", "Total Loans", "Active Loans", "Total Borrowed", "Action"].map((h) => (
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
                  <td colSpan={7} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Inbox size={32} className="opacity-30" />
                      <p className="text-sm font-medium text-slate-500">No users found</p>
                      {search && (
                        <button
                          onClick={() => setSearch("")}
                          className="text-xs text-blue-500 hover:underline"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr
                    key={row.uid}
                    className={`group hover:bg-blue-50/20 transition-colors ${idx % 2 !== 0 ? "bg-slate-50/40" : ""}`}
                  >
                    {/* User */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar email={row.email} />
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-slate-800 truncate max-w-[140px]">
                            {row.email?.split("@")[0] ?? "—"}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {row.email ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-3.5 text-[12px] text-slate-600">
                      {row.phoneNumber ?? "—"}
                    </td>

                    {/* Role */}
                    <td className="px-5 py-3.5">
                      <RoleBadge role={row.role} />
                    </td>

                    {/* Total loans */}
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-bold text-slate-800">{row.totalLoans}</span>
                    </td>

                    {/* Active loans */}
                    <td className="px-5 py-3.5">
                      {row.activeLoans > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {row.activeLoans} active
                        </span>
                      ) : (
                        <span className="text-[12px] text-slate-400">—</span>
                      )}
                    </td>

                    {/* Total borrowed */}
                    <td className="px-5 py-3.5 text-[12px] font-semibold text-slate-700">
                      {row.totalBorrowed > 0 ? formatCurrency(row.totalBorrowed) : "—"}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => navigate(`${ROUTES.ADMIN_USER_DETAIL}/${row.uid}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all hover:shadow-sm group-hover:border-blue-200"
                      >
                        <Eye size={12} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100">
            <p className="text-[11px] text-slate-400">
              Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{" "}
              <span className="font-semibold text-slate-600">{users.length}</span> users
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
