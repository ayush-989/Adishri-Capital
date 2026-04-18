
import { Link, useLocation } from "react-router-dom";
 feature/admin-dashboard
import { 
  LayoutDashboard, 
  BarChart2, 
  Globe, 
  Search, 
  Layout, 
  Settings, 
  Activity, 
  Eye, 
  LogOut 
} from "lucide-react";

import { LayoutDashboard, Users, CreditCard, LogOut } from "lucide-react";
 main
import { cn } from "../ui/Button";
import { ROUTES } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
    { name: "Analytics", href: "#", icon: BarChart2 },
    { name: "Sites", href: "#", icon: Globe },
    { name: "Explore Domain", href: "#", icon: Search },
    { name: "Website Builder", href: "#", icon: Layout },
    { name: "Manage Service", href: "#", icon: Settings },
    { name: "Monitoring", href: "#", icon: Activity },
    { name: "Activity Log", href: "#", icon: Eye },
  ];

  return (
 feature/admin-dashboard
    <div className="flex flex-col w-[260px] bg-[#1a1a1a] border-r border-[#262626] h-screen sticky top-0 font-sans">
      <div className="flex items-center px-8 h-[96px]">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center">
          Hosty<span className="text-emerald-400">.</span>
        </h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 px-4">
        <nav className="space-y-1">
           {navItems.map((item) => {
            const isTargetActive = item.name === "Analytics";


    <div className="flex flex-col w-64 bg-gray-900 border-r border-gray-800 h-screen sticky top-0 shadow-xl">
      <div className="flex items-center justify-center h-20 border-b border-gray-800/50">
        <span className="text-white font-bold text-xl tracking-tight">Admin<span className="text-primary-500 font-light ml-1">Panel</span></span>
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
 main
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
 feature/admin-dashboard
                  "group flex items-center px-4 py-3 text-[14px] font-semibold rounded-2xl transition-all duration-200",
                  isTargetActive
                    ? "bg-[#2D2D2D] text-white shadow-sm"
                    : "text-gray-400 hover:bg-[#222222] hover:text-white"

                  "group flex items-center px-4 py-3 mx-2 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary-600/10 text-primary-400"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
 main
                )}
              >
                <item.icon
                  className={cn(
 feature/admin-dashboard
                    "mr-3.5 flex-shrink-0 h-[18px] w-[18px]",
                    isTargetActive ? "text-emerald-400" : "text-gray-400 group-hover:text-gray-300"

                    "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                    isActive ? "text-primary-500" : "text-gray-500 group-hover:text-gray-300"
 main
                  )}
                  aria-hidden="true"
                  strokeWidth={isTargetActive ? 2.5 : 2}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
 feature/admin-dashboard

      <div className="p-4">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-[14px] font-semibold text-gray-400 rounded-2xl hover:bg-[#2D2D2D] hover:text-white transition-all"
        >
          <LogOut className="mr-3.5 flex-shrink-0 h-[18px] w-[18px]" strokeWidth={2} />

      <div className="p-4 border-t border-gray-800/50">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-400 rounded-xl hover:bg-gray-800/50 hover:text-white transition-all duration-200 group"
        >
          <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
 main
          Logout
        </button>
      </div>
    </div>
  );
}

