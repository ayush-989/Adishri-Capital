import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useApplications } from "../../../hooks/useApplications";
import { useSearch } from "../../../context/SearchContext";
import { LOAN_STATUS, ROUTES } from "../../../utils/constants";
import { Badge } from "../../../shared/components/ui/Badge";
import { Search, SlidersHorizontal, Eye, Users, AlertCircle, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_VARIANT: Record<string, "success" | "info" | "danger" | "warning" | "orange"> = {
  [LOAN_STATUS.APPROVED]:         "success",
  [LOAN_STATUS.DISBURSED]:        "info",
  [LOAN_STATUS.REJECTED]:         "danger",
  [LOAN_STATUS.PENDING_APPROVAL]: "warning",
  [LOAN_STATUS.PENDING_KYC]:      "warning",
  [LOAN_STATUS.PENDING_PAYMENT]:  "orange",
};

const STATUS_LABEL: Record<string, string> = {
  [LOAN_STATUS.APPROVED]:         "Approved",
  [LOAN_STATUS.DISBURSED]:        "Disbursed",
  [LOAN_STATUS.REJECTED]:         "Rejected",
  [LOAN_STATUS.PENDING_APPROVAL]: "Pending Approval",
  [LOAN_STATUS.PENDING_KYC]:      "Pending KYC",
  [LOAN_STATUS.PENDING_PAYMENT]:  "Pending Payment",
};

const STATUS_OPTIONS = ["All", ...Object.values(LOAN_STATUS)];
const PAGE_SIZE = 10;

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
];

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm`}>
      {initials}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, total, pageSize, onChange }: {
  page: number; total: number; pageSize: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={14} />
      </button>
      <span className="text-[11px] text-slate-500 font-medium">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[40, 28, 32, 24, 20, 16].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className={`h-3.5 rounded-full bg-slate-100 w-${w}`} />
        </td>
      ))}
    </tr>
  );
}

// ─── LeadManagement ───────────────────────────────────────────────────────────

export function LeadManagement() {
  const { applications, loading, error } = useApplications();
  const { searchTerm, setSearchTerm } = useSearch();
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return applications.filter((a) => {
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      const matchesSearch =
        !q ||
        a.appId.toLowerCase().includes(q) ||
        a.basicDetails?.fullName?.toLowerCase().includes(q) ||
        a.basicDetails?.phone?.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [applications, searchTerm, statusFilter]);

  // Reset to page 1 when filters change
  const prevFiltered = useMemo(() => filtered, [filtered]);
  useMemo(() => { setPage(1); }, [searchTerm, statusFilter]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 sm:p-8 space-y-5 max-w-[1400px] mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Applications</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {loading ? "Loading…" : `${applications.length} total applications`}
          </p>
        </div>

        {/* Summary pills */}
        {!loading && !error && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl text-xs font-semibold text-amber-700">
              <AlertCircle size={12} />
              {applications.filter(a =>
                [LOAN_STATUS.PENDING_PAYMENT, LOAN_STATUS.PENDING_KYC, LOAN_STATUS.PENDING_APPROVAL].includes(a.status as any)
              ).length} pending
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-semibold text-emerald-700">
              <Users size={12} />
              {applications.filter(a => a.status === LOAN_STATUS.DISBURSED).length} active
            </div>
          </div>
        )}
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-slate-100">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, ID, phone…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-[12px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 focus:bg-white transition-all"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <SlidersHorizontal size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 pl-8 pr-8 rounded-xl border border-slate-200 bg-slate-50 text-[12px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 appearance-none cursor-pointer transition-all"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
              ))}
            </select>
          </div>

          {filtered.length > 0 && (
            <span className="ml-auto text-[11px] text-slate-400 font-medium shrink-0">
              {filtered.length} of {applications.length}
            </span>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                {["Applicant", "Loan ID", "Contact", "Applied On", "Status", "Action"].map((h) => (
                  <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={28} className="text-red-300" />
                      <p className="text-sm font-medium text-red-500">Failed to load</p>
                      <p className="text-xs text-slate-400">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Inbox size={32} className="opacity-30" />
                      <p className="text-sm font-medium text-slate-500">No applications found</p>
                      <p className="text-xs">Try adjusting your search or filter</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((app, idx) => (
                  <tr
                    key={app.id}
                    className={`group hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? "" : "bg-slate-50/40"}`}
                  >
                    {/* Applicant */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={app.basicDetails?.fullName ?? "?"} />
                        <div>
                          <p className="text-[13px] font-semibold text-slate-800 leading-tight">
                            {app.basicDetails?.fullName ?? "—"}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{app.basicDetails?.email ?? ""}</p>
                        </div>
                      </div>
                    </td>

                    {/* Loan ID */}
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                        {app.appId}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-3.5">
                      <p className="text-[12px] text-slate-700 font-medium">{app.basicDetails?.phone ?? "—"}</p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5">
                      <p className="text-[12px] text-slate-500">
                        {app.createdAt ? format(new Date(app.createdAt), "dd MMM yyyy") : "—"}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <Badge variant={STATUS_VARIANT[app.status] ?? "neutral"}>
                        {STATUS_LABEL[app.status] ?? app.status}
                      </Badge>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5">
                      <Link
                        to={`${ROUTES.ADMIN_APPLICATION}/${app.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-all hover:shadow-sm group-hover:border-blue-200"
                      >
                        <Eye size={12} />
                        Review
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[11px] text-slate-400">
              Showing <span className="font-semibold text-slate-600">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of{" "}
              <span className="font-semibold text-slate-600">{filtered.length}</span> applications
            </p>
            <div className="flex items-center gap-3">
              {(searchTerm || statusFilter !== "All") && (
                <button
                  onClick={() => { setSearchTerm(""); setStatusFilter("All"); setPage(1); }}
                  className="text-[11px] font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Clear filters
                </button>
              )}
              <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
