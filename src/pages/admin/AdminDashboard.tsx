import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { formatCurrency } from "../../utils/helpers";
import { HandCoins, TrendingDown, TrendingUp, AlertCircle, Users, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { LOAN_STATUS } from "../../utils/constants";
import { Button } from "../../components/ui/Button";
import { toast } from "react-toastify";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalExposure: 0,
    activeLoans: 0,
    pendingRecoveries: 0,
    totalRecovered: 0,
    totalUsers: 0,
    pendingVerifications: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch applications — no orderBy to avoid index requirement
      const appsSnap = await getDocs(collection(db, "applications"));

      let totalExposure = 0;
      let pendingRecoveries = 0;
      let activeLoans = 0;
      let pendingVerifications = 0;
      const userIds = new Set<string>();

      appsSnap.forEach((doc) => {
        const app = doc.data();
        // Count unique users by userId field if present, else by applicant name
        if (app.userId) userIds.add(app.userId);

        if (app.status === LOAN_STATUS.DISBURSED) {
          activeLoans++;
          totalExposure += app.finalAmount || 0;
          pendingRecoveries += app.remainingBalance !== undefined
            ? app.remainingBalance
            : (app.finalAmount || 0);
        }
        if ([LOAN_STATUS.PENDING_PAYMENT, LOAN_STATUS.PENDING_KYC, LOAN_STATUS.PENDING_APPROVAL].includes(app.status)) {
          pendingVerifications++;
        }
      });

      // Fetch verified repayment transactions only
      let totalRecovered = 0;
      try {
        const txnsSnap = await getDocs(
          query(collection(db, "transactions"), where("type", "==", "repayment"), where("verified", "==", true))
        );
        txnsSnap.forEach((doc) => {
          totalRecovered += doc.data().amount || 0;
        });
      } catch (txnError) {
        console.warn("Could not fetch transactions:", txnError);
        // Non-fatal: continue with 0 recovered
      }

      // Try to get users count — may fail if rules don't allow
      let totalUsers = userIds.size || appsSnap.size; // fallback = total applications
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        totalUsers = usersSnap.size;
      } catch {
        // Firestore rules may block this — use fallback
        console.warn("Could not fetch users collection — using application count as fallback.");
      }

      setStats({ totalExposure, activeLoans, pendingRecoveries, totalRecovered, totalUsers, pendingVerifications });
      setChartData([
        { name: "Exposure", amount: totalExposure },
        { name: "Recovered", amount: totalRecovered },
        { name: "Pending", amount: pendingRecoveries },
      ]);
    } catch (error: any) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to load dashboard data. Check Firestore rules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const STAT_CARDS = [
    { label: "Total Market Exposure", value: formatCurrency(stats.totalExposure), icon: HandCoins, color: "blue", sub: "Total disbursed loans" },
    { label: "Pending Recoveries", value: formatCurrency(stats.pendingRecoveries), icon: TrendingDown, color: "rose", sub: "Outstanding balance" },
    { label: "Total Recovered", value: formatCurrency(stats.totalRecovered), icon: TrendingUp, color: "emerald", sub: "Verified repayments" },
    { label: "Action Required", value: stats.pendingVerifications, icon: AlertCircle, color: "amber", sub: "Pending verifications" },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    rose: "bg-rose-100 text-rose-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
  };
  const valueColorMap: Record<string, string> = {
    blue: "text-slate-900", rose: "text-rose-600", emerald: "text-emerald-600", amber: "text-amber-600",
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">System Analytics</h1>
          <Button variant="outline" size="sm" onClick={fetchStats} className="flex items-center gap-2">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
          {STAT_CARDS.map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-5 pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-500 mb-1 truncate">{s.label}</p>
                    <p className={`text-xl sm:text-2xl font-bold ${valueColorMap[s.color]}`}>{s.value}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                  </div>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ml-2 ${colorMap[s.color]}`}>
                    <s.icon size={18} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 sm:h-80 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                    <Tooltip
                      formatter={(v: any) => formatCurrency(Number(v))}
                      cursor={{ fill: "#f1f5f9" }}
                      contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Platform Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5 mt-2">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Total Users / Applications</p>
                    <p className="text-xl font-bold text-slate-900">{stats.totalUsers}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <HandCoins size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Active Disbursed Loans</p>
                    <p className="text-xl font-bold text-slate-900">{stats.activeLoans}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Pending Actions</p>
                    <p className="text-xl font-bold text-amber-600">{stats.pendingVerifications}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
