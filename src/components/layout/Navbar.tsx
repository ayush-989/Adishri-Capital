import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Landmark, Menu, X } from "lucide-react";
import { ROUTES } from "../../utils/constants";

const NAV_LINKS = [
  { label: "Home",       href: ROUTES.HOME },
  { label: "Apply",      href: ROUTES.LOAN_APPLICATION },
  { label: "Track Loan", href: ROUTES.USER_DASHBOARD },
];

export function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Landmark className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">
              Adishri <span className="text-blue-600">Capitals</span>
            </span>
          </Link>

          {/* Desktop — pill nav */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-50 rounded-full px-1.5 py-1 border border-gray-200">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    active
                      ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop — right actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to={ROUTES.USER_DASHBOARD}
              className="text-gray-800 font-bold text-sm hover:text-blue-600 transition-colors"
            >
              Track
            </Link>
            <Link
              to={ROUTES.LOAN_APPLICATION}
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all shadow-sm"
            >
              Apply Now
            </Link>
            {user && (
              <Link
                to={ROUTES.ADMIN_DASHBOARD}
                className="text-gray-400 font-medium text-sm hover:text-gray-700 transition-colors ml-1"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden absolute top-16 inset-x-0 bg-white border-t border-gray-100 shadow-xl px-4 py-4 z-50 space-y-1">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  active ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
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
              className="block px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 border-t border-gray-100 mt-2 pt-4"
            >
              Admin Panel
            </Link>
          )}
          <div className="pt-3 border-t border-gray-100">
            <Link
              to={ROUTES.LOAN_APPLICATION}
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full text-sm transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
