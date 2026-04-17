
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, LogOut } from "lucide-react";
import { cn } from "../ui/Button";
import { ROUTES } from "../../utils/constants";
import { useAuth } from "../../context/AuthContext";

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  
  const navItems = [
    { name: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
    { name: "Leads", href: ROUTES.ADMIN_LEADS, icon: Users },
    { name: "Repayments", href: ROUTES.ADMIN_REPAYMENTS, icon: CreditCard },
  ];

  return (
    <div className="flex flex-col w-64 bg-gray-900 border-r border-gray-800 h-screen sticky top-0 shadow-xl">
      <div className="flex items-center justify-center h-20 border-b border-gray-800/50">
        <span className="text-white font-bold text-xl tracking-tight">Admin<span className="text-primary-500 font-light ml-1">Panel</span></span>
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "group flex items-center px-4 py-3 mx-2 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary-600/10 text-primary-400"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                    isActive ? "text-primary-500" : "text-gray-500 group-hover:text-gray-300"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-800/50">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-400 rounded-xl hover:bg-gray-800/50 hover:text-white transition-all duration-200 group"
        >
          <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
          Logout
        </button>
      </div>
    </div>
  );
}
