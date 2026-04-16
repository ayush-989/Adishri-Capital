import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Landmark, Menu, X } from "lucide-react";
import { ROUTES } from "../../../utils/constants";

const NAV_LINKS = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Apply Now", href: ROUTES.LOAN_APPLICATION },
  { label: "Track Application", href: ROUTES.USER_DASHBOARD },
];

export function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-lg border-b border-slate-200/70 shadow-sm relative">
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

          {/* Hamburger — always visible */}
          <button
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-0 w-56 bg-white border border-slate-200 rounded-xl shadow-xl px-2 py-2 z-50 mr-4">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 border-t border-slate-100 mt-1 pt-3"
            >
              Admin Panel
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
