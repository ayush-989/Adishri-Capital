import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import { cn } from "../ui/Button";
import { APP_NAME, ROUTES } from "../../../utils/constants";
import {
  Landmark,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  FileText,
  User,
  Menu,
  X,
} from "lucide-react";

/* ─── Public Links ───────────────── */
const PUBLIC_LINKS = [
  { label: "Track Application", href: ROUTES.USER_DASHBOARD, icon: Search },
  { label: "Apply for Loan", href: ROUTES.LOAN_APPLICATION, icon: FileText },
];

/* ─── Helper ───────────────── */
const isActive = (href: string, pathname: string) => pathname === href;

/* ─── Navbar ───────────────── */
export function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.role === "admin";
  const initial = (user?.email?.[0] ?? "U").toUpperCase();

  /* Close dropdown */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Close mobile on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* Focus search */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Landmark size={16} className="text-white" />
          </div>
          <span className="font-semibold text-sm hidden sm:block">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-2">
          {PUBLIC_LINKS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "px-3 py-2 text-sm rounded-lg",
                isActive(item.href, pathname)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">

          {/* Search */}
          <div className="hidden md:block">
            {searchOpen ? (
              <input
                ref={searchRef}
                placeholder="Search..."
                className="border px-2 py-1 rounded-md text-sm"
                onBlur={() => setSearchOpen(false)}
              />
            ) : (
              <button onClick={() => setSearchOpen(true)}>
                <Search size={18} />
              </button>
            )}
          </div>

          {/* Notification */}
          {user && (
            <button className="relative">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          )}

          {/* Profile */}
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="w-7 h-7 bg-blue-600 text-white flex items-center justify-center rounded-full text-xs">
                  {initial}
                </div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2"
                  >
                    {isAdmin && (
                      <Link to={ROUTES.ADMIN_DASHBOARD} className="block px-3 py-2 text-sm hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <Link to={ROUTES.USER_DASHBOARD} className="block px-3 py-2 text-sm hover:bg-gray-100">
                      My Applications
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to={ROUTES.LOAN_APPLICATION} className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
              Apply
            </Link>
          )}

          {/* Mobile */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t p-3">
          {PUBLIC_LINKS.map((item) => (
            <Link key={item.href} to={item.href} className="block py-2">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}