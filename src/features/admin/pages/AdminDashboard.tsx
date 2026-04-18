import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  Copy, 
  Award,
  AlertTriangle, 
  Zap,
  Activity,
  Users,
  AlertCircle,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { 
  AreaChart, Area, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie
} from "recharts";
import {
  fetchDashboardStats,
  type DashboardStats,
} from "../../../lib/controllers/admin.controller";
import { formatCurrency } from "../../../utils/helpers";
import { ROUTES } from "../../../utils/constants";
import { RepaymentApprovals } from "./RepaymentApprovals";
import { UsersPage } from "./UsersPage";

// ─── Animation variants ───────────────────────────────────────────────────────
const pageVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const EMPTY: DashboardStats = {
  totalExposure: 0, activeLoans: 0, pendingRecoveries: 0,
  totalRecovered: 0, totalUsers: 0, pendingVerifications: 0,
};

function AreaTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#2D2D2D] rounded-xl p-3.5 text-white shadow-xl text-sm min-w-[150px] border border-[#404040]">
      <p className="text-gray-400 text-xs mb-3 font-medium">{label}</p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full border-2 border-gray-400"></span>
          <span className="text-gray-300 text-xs font-semibold">Exposure</span>
          <span className="font-bold text-xs ml-auto text-white">{formatCurrency(payload[1]?.value)}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-[#D2EEB5]"></span>
          <span className="text-gray-300 text-xs font-semibold">Recovered</span>
          <span className="font-bold text-xs ml-auto text-white">{formatCurrency(payload[0]?.value)}</span>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
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

  const TABS = ["Overview", "Live Verification", "Users"];

  // Mock historical data leading up to the REAL live data for the area chart
  const areaChartData = [
    { time: "Mon", exposure: stats.totalExposure * 0.8, recovered: stats.totalRecovered * 0.7 },
    { time: "Tue", exposure: stats.totalExposure * 0.85, recovered: stats.totalRecovered * 0.75 },
    { time: "Wed", exposure: stats.totalExposure * 0.82, recovered: stats.totalRecovered * 0.80 },
    { time: "Thu", exposure: stats.totalExposure * 0.9, recovered: stats.totalRecovered * 0.85 },
    { time: "Fri", exposure: stats.totalExposure * 0.88, recovered: stats.totalRecovered * 0.90 },
    { time: "Sat", exposure: stats.totalExposure * 0.95, recovered: stats.totalRecovered * 0.95 },
    { time: "Today", exposure: stats.totalExposure, recovered: stats.totalRecovered },
  ];

  const pieData = [
    { name: "Recovered", value: stats.totalRecovered, percentage: stats.totalExposure ? Math.round((stats.totalRecovered / stats.totalExposure) * 100) + "%" : "0%", color: "#D2EEB5" },
    { name: "Pending", value: stats.pendingRecoveries, percentage: stats.totalExposure ? Math.round((stats.pendingRecoveries / stats.totalExposure) * 100) + "%" : "0%", color: "#FDDDA4" },
  ].filter(d => d.value > 0);
  
  if (pieData.length === 0) {
    pieData.push({ name: "No Data", value: 1, percentage: "100%", color: "#E2E8F0" });
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="px-8 pb-12 pt-6 max-w-[1440px] mx-auto font-sans bg-[#F8F9FA]"
    >
      <div className="flex flex-col gap-10">
        
        {/* Header & Tabs */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl p-1 shadow-sm border border-slate-200/50 flex gap-1 items-center w-fit">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-[13px] transition-all ${
                  activeTab === tab
                    ? "bg-[#D6EDF6] text-slate-900 font-bold shadow-sm"
                    : "bg-transparent text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4"
            >
              <div className="flex items-center gap-2 text-sm text-red-700 font-medium">
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Financial Overview</h2>
            <button onClick={load} className="text-gray-400 hover:text-gray-600 transition-colors">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Total Exposure (Blue) */}
            <Link to={ROUTES.ADMIN_LOANS} className={`bg-[#D6EDF6] rounded-[24px] p-6 shadow-sm flex flex-col gap-8 min-h-[170px] justify-between border border-[#c6e3ef] cursor-pointer hover:shadow-md hover:-translate-y-1 hover:border-blue-300 transition-all duration-200 ${loading ? 'opacity-70' : ''}`}>
              <div className="flex justify-between items-start">
                 <div className="w-11 h-11 rounded-[14px] bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                   <Copy size={20} className="text-slate-700" strokeWidth={2} />
                 </div>
                 <div className="bg-white/50 px-2 py-1 rounded-md text-xs font-bold text-slate-600">LIVE</div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[32px] font-extrabold tracking-tight text-slate-900 leading-none truncate">
                    {formatCurrency(stats.totalExposure).replace(/\.\d{2}/, '')}
                  </span>
                </div>
                <span className="text-[15px] font-medium text-slate-600">Total Exposure</span>
              </div>
            </Link>

            {/* Card 2: Total Recovered (Green) */}
            <Link to={ROUTES.ADMIN_RECOVERY} className={`bg-[#D2EEB5] rounded-[24px] p-6 shadow-sm flex flex-col gap-8 min-h-[170px] justify-between border border-[#c3e3a1] cursor-pointer hover:shadow-md hover:-translate-y-1 hover:border-green-400 transition-all duration-200 ${loading ? 'opacity-70' : ''}`}>
               <div className="flex justify-between items-start">
                  <div className="w-11 h-11 rounded-[14px] bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <Award size={20} className="text-[#4B683B]" strokeWidth={2} />
                  </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[32px] font-extrabold tracking-tight text-[#3F5B2F] leading-none truncate">
                  {formatCurrency(stats.totalRecovered).replace(/\.\d{2}/, '')}
                  </span>
                </div>
                <span className="text-[15px] font-medium text-[#4B683B]">Total Recovered</span>
              </div>
            </Link>

            {/* Card 3: Pending Recovery (Orange) */}
            <Link to={ROUTES.ADMIN_RECOVERY} className={`bg-[#FDDDA4] rounded-[24px] p-6 shadow-sm flex flex-col gap-8 min-h-[170px] justify-between border border-[#eecd93] cursor-pointer hover:shadow-md hover:-translate-y-1 hover:border-orange-400 transition-all duration-200 ${loading ? 'opacity-70' : ''}`}>
               <div className="flex justify-between items-start">
                  <div className="w-11 h-11 rounded-[14px] bg-white flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <AlertTriangle size={20} className="text-[#8F6A33]" strokeWidth={2} />
                  </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[32px] font-extrabold tracking-tight text-[#815B22] leading-none truncate">
                    {formatCurrency(stats.pendingRecoveries).replace(/\.\d{2}/, '')}
                  </span>
                </div>
                <span className="text-[15px] font-medium text-[#8F6A33]">Pending Recovery</span>
              </div>
            </Link>

            {/* Card 4: Active Loans (Black) */}
            <Link to={ROUTES.ADMIN_LOANS} className={`bg-[#303030] rounded-[24px] p-6 shadow-xl flex flex-col gap-8 min-h-[170px] justify-between border border-[#404040] cursor-pointer hover:shadow-2xl hover:-translate-y-1 hover:border-[#666] transition-all duration-200 ${loading ? 'opacity-70' : ''}`}>
               <div className="flex justify-between items-start">
                  <div className="w-11 h-11 rounded-[14px] bg-[#444] border border-[#555] flex items-center justify-center shadow-lg">
                    <Zap size={20} className="text-white" strokeWidth={2} />
                  </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[36px] font-extrabold tracking-tight text-white leading-none truncate">{stats.activeLoans.toLocaleString("en-IN")}</span>
                </div>
                <span className="text-[15px] font-medium text-gray-400">Active Loans</span>
              </div>
            </Link>
            
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mt-2">
          
          {/* Main Portfolio Summary (Using AreaChart mapped to the user data) */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col min-h-[440px]">
             <div className="flex justify-between items-center mb-10">
              <h3 className="text-[17px] font-bold text-slate-900 tracking-tight">Portfolio Summary</h3>
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

            <div className="flex-1 w-full relative pl-2">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 13, fontWeight: 500 }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94A3B8', fontSize: 13, fontWeight: 500 }} 
                    dx={-10}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<AreaTooltip />} cursor={{ fill: 'transparent', stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area 
                    type="monotone" 
                    dataKey="recovered" 
                    stroke="#D2EEB5" 
                    strokeWidth={4}
                    fill="transparent" 
                    strokeDasharray="8 8"
                    activeDot={false}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="exposure" 
                    stroke="#303030" 
                    strokeWidth={4}
                    fillOpacity={0} 
                    activeDot={{ r: 8, strokeWidth: 4, fill: "#303030", stroke: "#FFF" }}
                    dot={{ r: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown Pie Chart representing Recovered vs Pending */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-full min-h-[440px]">
            <h3 className="text-[17px] font-bold text-slate-900 tracking-tight mb-8">Recovery Breakdown</h3>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-[220px] h-[220px] relative mb-12">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={105}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={8}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                  <span className="text-[14px] font-medium text-slate-500 mb-1">Total Loaned</span>
                  <span className="text-[26px] font-black text-slate-900 tracking-tight leading-none">
                    {formatCurrency(stats.totalExposure).replace(/\.\d{2}/, '').replace('₹', '')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 w-full gap-y-6 gap-x-4 px-2">
                {pieData.map((item) => (
                  <div key={item.name + item.color} className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[15px] font-bold text-slate-900">{item.name}</span>
                    </div>
                    <span className="text-[13px] font-medium text-slate-500 pl-6 tracking-wide">
                      {item.value === 1 && item.name === "No Data" ? '0' : item.percentage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Small Bottom Row for Remaining original Adishri Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
           <Link
              to={ROUTES.ADMIN_LEADS}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-[#D6EDF6] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[16px] bg-[#FFF0E5] flex items-center justify-center">
                  <AlertCircle size={24} className="text-[#F97316]" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-900">Pending Actions</p>
                  <p className="text-[13px] text-slate-500 font-medium">{stats.pendingVerifications} applications to review</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#D6EDF6] group-hover:text-slate-900 text-slate-400 transition-all">
                <ArrowRight size={18} />
              </div>
           </Link>

           <Link
              to={ROUTES.ADMIN_USERS}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-[#D2EEB5] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[16px] bg-[#F3F4F6] flex items-center justify-center">
                  <Users size={24} className="text-[#334155]" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-900">Registered Users</p>
                  <p className="text-[13px] text-slate-500 font-medium">{stats.totalUsers} borrowers on platform</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#D2EEB5] group-hover:text-slate-900 text-slate-400 transition-all">
                <ArrowRight size={18} />
              </div>
           </Link>
        </div>

      </div>
    </motion.div>
  );
}
