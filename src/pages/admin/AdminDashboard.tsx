import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { formatCurrency } from "../../utils/helpers";
import { HandCoins, TrendingUp, Users, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { LOAN_STATUS } from "../../utils/constants";

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

  useEffect(() => {
    const fetchStats = async () => {
      // In a real production app, do this securely via cloud functions.
      const usersSnap = await getDocs(collection(db, "users"));
      const appsSnap = await getDocs(collection(db, "applications"));
      const txnsSnap = await getDocs(collection(db, "transactions"));

      let totalExposure = 0;
      let pendingRecoveries = 0;
      let totalRecovered = 0;
      let activeLoans = 0;
      let pendingVerifications = 0;

      appsSnap.forEach((doc) => {
        const app = doc.data();
        if (app.status === LOAN_STATUS.DISBURSED) {
          activeLoans++;
          totalExposure += (app.finalAmount || 0);
          pendingRecoveries += (app.remainingBalance !== undefined ? app.remainingBalance : app.finalAmount || 0);
        }
        if (app.status === LOAN_STATUS.PENDING_PAYMENT || app.status === LOAN_STATUS.PENDING_KYC || app.status === LOAN_STATUS.PENDING_APPROVAL) {
          pendingVerifications++;
        }
      });

      txnsSnap.forEach((doc) => {
        const txn = doc.data();
        if (txn.verified && txn.type === "repayment") {
          totalRecovered += txn.amount;
        }
      });

      setStats({
        totalExposure,
        activeLoans,
        pendingRecoveries,
        totalRecovered,
        totalUsers: usersSnap.size,
        pendingVerifications,
      });

      setChartData([
        { name: "Total Exposure", amount: totalExposure },
        { name: "Recovered", amount: totalRecovered },
        { name: "Pending", amount: pendingRecoveries },
      ]);
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">System Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Exposure</p>
                  <p className="text-3xl font-bold text-slate-900">{formatCurrency(stats.totalExposure)}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <HandCoins size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Pending Recoveries</p>
                  <p className="text-3xl font-bold text-rose-600">{formatCurrency(stats.pendingRecoveries)}</p>
                </div>
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="rotate-180" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Recovered</p>
                  <p className="text-3xl font-bold text-emerald-600">{formatCurrency(stats.totalRecovered)}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Action Required</p>
                  <p className="text-3xl font-bold text-amber-600">{stats.pendingVerifications}</p>
                  <p className="text-xs text-slate-500 mt-1">Pending Applications</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
                  <AlertCircle size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip 
                      formatter={(value: any) => formatCurrency(Number(value))}
                      cursor={{fill: '#f1f5f9'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 mt-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Total Registered Users</p>
                    <p className="text-xl font-bold text-slate-900">{stats.totalUsers}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                    <HandCoins size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Active Disbursed Loans</p>
                    <p className="text-xl font-bold text-slate-900">{stats.activeLoans}</p>
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
