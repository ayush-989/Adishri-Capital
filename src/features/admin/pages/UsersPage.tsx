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

function SummaryCard({ icon, label, value, iconColor }: {
  icon: React.ReactNode; label: string; value: string | number;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex items-center gap-4">
      <div className={`p-2.5 rounded-xl bg-blue-50 ${iconColor}`}>{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="text-xl font-bold text-slate-800 mt-0.5">{value}</p>
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
             <span className="text-slate-700 font-medium">Users</span>
           </div>
           <h1 className="text-2xl font-bold text-slate-800 tracking-tight">User Management</h1>
         </div>
       </div>

       {/* ── Summary cards ── */}
       {!loading && !error && (
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
           <SummaryCard
             icon={<Users size={18} />}
             label="Total Users"
             value={users.length}
             iconColor="text-violet-600"
           />
           <SummaryCard
             icon={<UserCircle size={18} />}
             label="Borrowers"
             value={borrowerCount}
             iconColor="text-blue-600"
           />
           <SummaryCard
             icon={<Shield size={18} />}
             label="Admins"
             value={adminCount}
             iconColor="text-emerald-600"
           />
         </div>
       )}

{/* ── Table card ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/40 overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-6 py-4.5 border-b border-slate-100">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by email or phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200/80 bg-slate-50/50 text-sm text-slate-700 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 focus:bg-white transition-all"
              />
            </div>
            {!loading && (
              <span className="ml-auto text-xs text-slate-500 font-semibold shrink-0">
                {filtered.length} of {users.length} users
              </span>
            )}
          </div>

         {/* Error */}
         {error && (
           <div className="flex items-center gap-2 px-6 py-4 text-sm text-red-600 bg-red-50 border-b border-red-200">
             <AlertCircle size={16} /> {error}
           </div>
         )}

{/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/80">
                  {["User", "Phone", "Role", "Total Loans", "Active Loans", "Total Borrowed", "Action"].map((h) => (
                    <th key={h} className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
               {loading ? (
                 Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
               ) : filtered.length === 0 ? (
                 <tr>
                   <td colSpan={7} className="px-5 py-20 text-center">
                     <div className="flex flex-col items-center gap-2.5 text-slate-400">
                       <Inbox size={36} className="opacity-30" />
                       <p className="text-sm font-semibold text-slate-500">No users found</p>
                       {search && (
                         <button
                           onClick={() => setSearch("")}
                           className="text-xs text-blue-500 font-semibold hover:underline"
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
                     className={`group hover:bg-blue-50/30 transition-colors ${idx % 2 !== 0 ? "bg-slate-50/30" : ""}`}
                   >
                     {/* User */}
                     <td className="px-6 py-4">
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
                     <td className="px-6 py-4 text-sm text-slate-600">
                       {row.phoneNumber ?? "—"}
                     </td>

                     {/* Role */}
                     <td className="px-6 py-4">
                       <RoleBadge role={row.role} />
                     </td>

                     {/* Total loans */}
                     <td className="px-6 py-4">
                       <span className="text-sm font-semibold text-slate-800">{row.totalLoans}</span>
                     </td>

                     {/* Active loans */}
                     <td className="px-6 py-4">
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
                     <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                       {row.totalBorrowed > 0 ? formatCurrency(row.totalBorrowed) : "—"}
                     </td>

                     {/* Action */}
                     <td className="px-6 py-4">
                       <button
                         onClick={() => navigate(`${ROUTES.ADMIN_USER_DETAIL}/${row.uid}`)}
                         className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all hover:shadow-sm group-hover:border-blue-200"
                       >
                         <Eye size={13} />
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
           <div className="px-6 py-3 bg-slate-50/60 border-t border-slate-200">
             <p className="text-xs text-slate-500">
               Showing <span className="font-semibold text-slate-700">{filtered.length}</span> of{" "}
               <span className="font-semibold text-slate-700">{users.length}</span> users
             </p>
           </div>
         )}
      </div>
    </motion.div>
  );
}
