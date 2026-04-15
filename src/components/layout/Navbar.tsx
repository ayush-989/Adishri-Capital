import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Landmark, User as UserIcon, Menu, X } from "lucide-react";
import { ROUTES } from "../../utils/constants";

const NAV_LINKS = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Apply Now", href: ROUTES.LOAN_APPLICATION },
  { label: "Track Application", href: ROUTES.USER_DASHBOARD },
];

export function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-lg border-b border-slate-200/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Landmark className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              Adishri <span className="text-blue-600">Capitals</span>
            </span>
          </Link>

          {/* Desktop: show admin link if logged in */}
          {user && (
            <Link
              to={ROUTES.ADMIN_DASHBOARD}
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 border border-slate-200 px-3 py-1.5 rounded-lg bg-white transition-colors"
            >
              <UserIcon size={16} />
              Admin Panel
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t border-slate-100 px-4 pb-4 pt-2 space-y-1 shadow-lg">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {user && (
            <Link
              to={ROUTES.ADMIN_DASHBOARD}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 mt-2"
            >
              <UserIcon size={14} className="inline mr-2" />
              Admin Panel
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
