import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { Landmark, User as UserIcon, Search } from "lucide-react";
import { ROUTES } from "../../utils/constants";

export function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/80 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <Landmark className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-xl text-slate-900 tracking-tight">Adishri Capitals</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to={ROUTES.USER_DASHBOARD} className="text-sm font-medium text-slate-600 hover:text-slate-900 hidden sm:flex items-center gap-1">
              <Search size={16} /> Track Application
            </Link>
            
            {!user ? (
              <Link to={ROUTES.LOAN_APPLICATION}>
                <Button size="sm">Apply Now</Button>
              </Link>
            ) : (
              <Link
                to={ROUTES.ADMIN_DASHBOARD}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 border border-slate-200 px-3 py-1.5 rounded-lg bg-white"
              >
                <UserIcon size={18} />
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
