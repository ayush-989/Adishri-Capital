import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, CreditCard, LogOut } from "lucide-react";
import { cn } from "../ui/Button";
import { ROUTES } from "../../../utils/constants";
import { useAuth } from "../../../hooks/useAuth";

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { name: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
    { name: "Leads", href: ROUTES.ADMIN_LEADS, icon: Users },
    { name: "Repayments", href: ROUTES.ADMIN_REPAYMENTS, icon: CreditCard },
  ];

  return (
    <div className="flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0">
      <div className="flex items-center justify-center h-16 border-b border-slate-800">
        <span className="text-white font-bold text-xl">Admin Panel</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-slate-400" />
          Logout
        </button>
      </div>
    </div>
  );
}
