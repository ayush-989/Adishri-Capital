import { useState, useEffect } from "react";
 feature/admin-dashboard
import { Link } from "react-router-dom";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/config";
 main
import { AdminLayout } from "../../components/layout/AdminLayout";
import { 
  ArrowUpRight, 
  Copy, 
  Award,
  AlertTriangle, 
  Zap,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { fetchDashboardStats, type DashboardStats } from "../../lib/controllers/admin.controller";
import { formatCurrency } from "../../utils/helpers";
 feature/admin-dashboard
import { ROUTES } from "../../utils/constants";

const EMPTY: DashboardStats = {
  totalExposure: 0, activeLoans: 0, pendingRecoveries: 0,
  totalRecovered: 0, totalUsers: 0, pendingVerifications: 0,
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#2D2D2D] rounded-lg p-3 text-white shadow-xl text-sm min-w-[140px]">
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border border-gray-400"></span>
            <span className="text-gray-300 text-xs font-medium">Exposure</span>
            <span className="font-semibold text-xs ml-auto text-white">{formatCurrency(payload[1]?.value || 0)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D1EDBB]"></span>
            <span className="text-gray-300 text-xs font-medium">Recovered</span>
            <span className="font-semibold text-xs ml-auto text-white">{formatCurrency(payload[0]?.value || 0)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Analytics");
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

  const TABS = ["Analytics", "Resources", "CDN Usage", "Response", "Cache", "Geo & IP"];

  // Mock timeline data to look like an image AreaChart for Portfolio
  const CHART_DATA = [
    { time: "Mon", exposure: stats.totalExposure * 0.8, recovered: stats.totalRecovered * 0.7 },
    { time: "Tue", exposure: stats.totalExposure * 0.85, recovered: stats.totalRecovered * 0.75 },
    { time: "Wed", exposure: stats.totalExposure * 0.82, recovered: stats.totalRecovered * 0.80 },
    { time: "Thu", exposure: stats.totalExposure * 0.9, recovered: stats.totalRecovered * 0.85 },
    { time: "Fri", exposure: stats.totalExposure * 0.88, recovered: stats.totalRecovered * 0.90 },
    { time: "Sat", exposure: stats.totalExposure * 0.95, recovered: stats.totalRecovered * 0.95 },
    { time: "Today", exposure: stats.totalExposure, recovered: stats.totalRecovered },
  ];

  const PIE_DATA = [
    { name: "Recovered", value: stats.totalRecovered, percentage: stats.totalExposure ? Math.round((stats.totalRecovered / stats.totalExposure) * 100) + "%" : "0%", color: "#D1EDBB" },
    { name: "Pending", value: stats.pendingRecoveries, percentage: stats.totalExposure ? Math.round((stats.pendingRecoveries / stats.totalExposure) * 100) + "%" : "0%", color: "#FBDCA0" },
  ].filter(d => d.value > 0);
  
  if (PIE_DATA.length === 0) {
    PIE_DATA.push({ name: "No Data", value: 1, percentage: "100%", color: "#E2E8F0" });
  }

  return (
    <AdminLayout>
      <div className="px-10 pb-10 pt-2 max-w-[1400px]">
        <div className="flex flex-col gap-8">
          {/* Header & Tabs */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
               <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Analytics</h1>
               <button onClick={load} className="text-gray-500 hover:text-gray-800 transition-colors bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2 text-sm font-semibold">
                  <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
               </button>
            </div>
            
            <div className="flex gap-2 bg-white w-fit p-1 rounded-xl shadow-sm border border-slate-200/50">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                    activeTab === tab
                      ? "bg-[#D6EDF6] text-slate-900 font-bold shadow-sm"
                      : "bg-transparent text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h2 className="text-[16px] font-semibold text-slate-800">Financial overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: Blue - Total Exposure */}
              <Link 
                to={ROUTES.ADMIN_LOANS}
                className={`bg-[#D6EDF6] rounded-[20px] p-6 shadow-sm flex flex-col gap-8 min-h-[160px] justify-between cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-[#c6e3ef] hover:border-blue-300 ${loading ? 'opacity-70' : ''}`}
              >
                <div>
                  <Copy size={20} className="text-slate-800" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[34px] font-black tracking-tight text-slate-900 leading-none truncate">
                      {formatCurrency(stats.totalExposure).replace(/\.\d{2}/, '')}
                    </span>
                  </div>
                  <span className="text-[14px] font-medium text-slate-700">Total Exposure</span>
                </div>
              </Link>

              {/* Card 2: Green - Total Recovered */}
              <Link 
                to={ROUTES.ADMIN_RECOVERY}
                className={`bg-[#D2EEB5] rounded-[20px] p-6 shadow-sm flex flex-col gap-8 min-h-[160px] justify-between cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-[#c3e3a1] hover:border-green-400 ${loading ? 'opacity-70' : ''}`}
              >
                <div>
                  <Award size={20} className="text-[#3F5B2F]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[34px] font-black tracking-tight text-[#3F5B2F] leading-none truncate">
                      {formatCurrency(stats.totalRecovered).replace(/\.\d{2}/, '')}
                    </span>
                  </div>
                  <span className="text-[14px] font-medium text-[#4B683B]">Total Recovered</span>
                </div>
              </Link>

              {/* Card 3: Orange - Pending Recovery */}
              <Link 
                to={ROUTES.ADMIN_RECOVERY}
                className={`bg-[#FDDDA4] rounded-[20px] p-6 shadow-sm flex flex-col gap-8 min-h-[160px] justify-between cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 border border-[#eecd93] hover:border-orange-400 ${loading ? 'opacity-70' : ''}`}
              >
                <div>
                  <AlertTriangle size={20} className="text-[#815B22]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[34px] font-black tracking-tight text-[#815B22] leading-none truncate">
                      {formatCurrency(stats.pendingRecoveries).replace(/\.\d{2}/, '')}
                    </span>
                  </div>
                  <span className="text-[14px] font-medium text-[#8F6A33]">Pending Recovery</span>
                </div>
              </Link>

              {/* Card 4: Black - Active Loans */}
              <Link 
                to={ROUTES.ADMIN_LOANS}
                className={`bg-[#303030] rounded-[20px] p-6 shadow-xl flex flex-col gap-8 min-h-[160px] justify-between border border-[#404040] cursor-pointer hover:shadow-2xl hover:-translate-y-1 hover:border-[#666] transition-all duration-200 ${loading ? 'opacity-70' : ''}`}
              >
                <div>
                  <Zap size={20} className="text-white" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[34px] font-black tracking-tight text-white leading-none">{stats.activeLoans.toLocaleString("en-IN")}</span>
                  </div>
                  <span className="text-[14px] font-medium text-gray-400">Active Loans</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 mt-2">
            {/* Main Area Chart */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-[16px] font-bold text-slate-900">Portfolio Summary</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#303030]"></div>
                    <span className="text-[13px] font-bold text-slate-700">Exposure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#D2EEB5]"></div>
                    <span className="text-[13px] font-bold text-slate-700">Recovered</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#A1A1AA', fontSize: 13, fontWeight: 500 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#A1A1AA', fontSize: 13, fontWeight: 500 }} 
                      dx={-10}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1e293b', strokeWidth: 1 }} />
                    <Area 
                      type="monotone" 
                      dataKey="recovered" 
                      stroke="#D2EEB5" 
                      strokeWidth={3}
                      fill="transparent" 
                      strokeDasharray="6 6"
                      activeDot={false}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="exposure" 
                      stroke="#303030" 
                      strokeWidth={3}
                      fillOpacity={0} 
                      activeDot={{ r: 7, strokeWidth: 4, fill: "#303030", stroke: "#F4F4F5" }}
                      dot={{ r: 5, strokeWidth: 2, fill: "#fff", stroke: "#303030" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Breakdown Pie Chart */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-full min-h-[400px]">
              <h3 className="text-[16px] font-bold text-slate-900 mb-8">Recovery breakdown</h3>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-[200px] h-[200px] relative mb-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PIE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={10}
                      >
                        {PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                    <span className="text-[14px] font-medium text-slate-500 mb-1">Total Loaned</span>
                    <span className="text-[28px] font-extrabold text-slate-900 tracking-tight">
                      {formatCurrency(stats.totalExposure).replace(/\.\d{2}/, '').replace('₹', '')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 w-full gap-y-6 gap-x-2 px-2">
                  {PIE_DATA.map((item) => (
                    <div key={item.name + item.color} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-[14px] font-bold text-slate-900">{item.name}</span>
                      </div>
                      <span className="text-[12px] font-medium text-slate-500 pl-5">{item.value === 1 && item.name === "No Data" ? '0' : item.percentage}</span>
                    </div>
                  ))}

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
 main
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
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
