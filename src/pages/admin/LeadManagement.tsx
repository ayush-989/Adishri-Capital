import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ROUTES } from "../../utils/constants";
import { Search, Filter, Eye } from "lucide-react";
import { format } from "date-fns";

export function LeadManagement() {
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApps, setFilteredApps] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    // orderBy removed to avoid Firestore composite index requirement.
    // Sorting is handled client-side below.
    const q = collection(db, "applications");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => {
          // Sort newest first by createdAt string (ISO format sorts lexicographically)
          return (b.createdAt || "").localeCompare(a.createdAt || "");
        });
      setApplications(apps);
      setFilteredApps(apps);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = applications;
    if (statusFilter !== "All") {
      result = result.filter(app => app.status === statusFilter);
    }
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(app => 
        app.appId.toLowerCase().includes(query) || 
        app.basicDetails?.fullName.toLowerCase().includes(query)
      );
    }
    setFilteredApps(result);
  }, [search, statusFilter, applications]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Approved": return "bg-green-100 text-green-800";
      case "Disbursed": return "bg-emerald-100 text-emerald-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Pending Payment Verification": return "bg-amber-100 text-amber-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-slate-900">Lead Management</h1>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input 
                placeholder="Search by ID or Name..." 
                className="pl-9 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                className="h-10 pl-9 pr-8 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending Payment Verification">Fee Verification</option>
                <option value="Pending KYC Verification">KYC Verification</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Disbursed">Disbursed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-600">Application ID</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">Applicant Name</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">Applied On</th>
                    <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                    <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-slate-900">{app.appId}</td>
                      <td className="px-6 py-4 text-slate-600">{app.basicDetails?.fullName}</td>
                      <td className="px-6 py-4 text-slate-500">
                        {format(new Date(app.createdAt), "MMM dd, yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`${ROUTES.ADMIN_LEADS}/${app.id}`}>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Eye size={16} className="mr-2" />
                            Review
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filteredApps.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No applications found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
