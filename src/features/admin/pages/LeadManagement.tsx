import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useApplications } from "../../../hooks/useApplications";
import { LOAN_STATUS, ROUTES } from "../../../utils/constants";
import { Search, Filter, Eye } from "lucide-react";
import { format } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
  [LOAN_STATUS.APPROVED]: "bg-green-100 text-green-800",
  [LOAN_STATUS.DISBURSED]: "bg-emerald-100 text-emerald-800",
  [LOAN_STATUS.REJECTED]: "bg-red-100 text-red-800",
  [LOAN_STATUS.PENDING_APPROVAL]: "bg-yellow-100 text-yellow-800",
  [LOAN_STATUS.PENDING_KYC]: "bg-amber-100 text-amber-800",
  [LOAN_STATUS.PENDING_PAYMENT]: "bg-orange-100 text-orange-800",
};

const STATUS_OPTIONS = ["All", ...Object.values(LOAN_STATUS)];

export function LeadManagement() {
  const { applications, loading, error } = useApplications();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    console.log(`[LeadManagement] Filtering: ${applications.length} apps, search="${q}", status="${statusFilter}"`);
    return applications.filter((a) => {
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      const matchesSearch =
        !q ||
        a.appId.toLowerCase().includes(q) ||
        a.basicDetails?.fullName?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [applications, search, statusFilter]);

  const isLoading = loading;

  return (
    <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Lead Management</h1>
            <p className="text-sm text-slate-500 mt-1">{applications.length} total applications</p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 pl-9 pr-8 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-gray-100 border-b border-slate-200">
                <tr>
                  {["Name", "Loan ID", "Contact", "Applied On", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Loading applications...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-red-500">
                        <span className="text-sm font-medium">Failed to load applications</span>
                        <span className="text-xs text-slate-400">{error}</span>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                      No applications found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {app.basicDetails?.fullName ?? "—"}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 text-xs">
                        {app.appId}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <div>{app.basicDetails?.phone ?? "—"}</div>
                        <div className="text-xs text-slate-400">{app.basicDetails?.email ?? ""}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {app.createdAt ? format(new Date(app.createdAt), "MMM dd, yyyy") : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            STATUS_STYLES[app.status] ?? "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`${ROUTES.ADMIN_APPLICATION}/${app.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          <Eye size={14} />
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          {filtered.length > 0 && (
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400">
              Showing {filtered.length} of {applications.length} applications
            </div>
          )}
        </div>
      </div>
  );
}
