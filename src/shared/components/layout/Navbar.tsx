import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import { cn } from "../ui/Button";
import { APP_NAME, ROUTES } from "../../../utils/constants";
import {
  Landmark, Search, Bell, ChevronDown,
  LogOut, LayoutDashboard, FileText,
  User, Shield, Menu, X,
} from "lucide-react";

// ─── Nav links config ─────────────────────────────────────────────────────────

const PUBLIC_LINKS = [
  { label: "Track Application", href: ROUTES.USER_DASHBOARD, icon: Search },
  { label: "Apply for Loan",    href: ROUTES.LOAN_APPLICATION, icon: FileText },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isActive(href: string, pathname: string) {
  return pathname === href;
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLInputElement>(null);

  const initial = (user?.email?.[0] ?? "U").toUpperCase();
  const isAdmin = user?.role === "admin";

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Focus search input when expanded
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 80);
  }, [searchOpen]);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm shadow-slate-200/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[64px]">

          {/* ── Brand ── */}
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <Landmark size={15} className="text-white" />
            </div>
            <span className="font-bold text-[15px] text-slate-900 tracking-tight hidden sm:block">
              {APP_NAME}
            </span>
          </Link>

          {/* ── Desktop center nav ── */}
          <div className="hidden md:flex items-center gap-1.5">
            {PUBLIC_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className={cn(
                  "px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200",
                  isActive(href, pathname)
                    ? "bg-blue-50 text-blue-600 border border-blue-200/60"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* ── Right section ── */}
          <div className="flex items-center gap-1 shrink-0">

            {/* Search — desktop expanding */}
            <div className="hidden md:flex items-center">
              <AnimatePresence mode="wait">
                {searchOpen ? (
                  <motion.div
                    key="search-open"
                    initial={{ width: 32, opacity: 0.5 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 32, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex items-center gap-2 h-10 px-3.5 rounded-xl border border-blue-300 bg-white shadow-lg shadow-blue-100/60"
                  >
                    <Search size={14} className="text-blue-400 shrink-0" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search loans, applications…"
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => { setSearchFocused(false); setSearchOpen(false); }}
                      className="flex-1 bg-transparent outline-none text-[13px] text-slate-700 placeholder:text-slate-400 font-medium min-w-0"
                    />
                    <button
                      onMouseDown={(e) => { e.preventDefault(); setSearchOpen(false); }}
                      className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                    >
                      <X size={13} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    key="search-closed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSearchOpen(true)}
                    className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200"
                    aria-label="Open search"
                  >
                    <Search size={18} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Notification bell — only for logged-in users */}
            {user && (
              <button
                aria-label="Notifications"
                className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-rose-500 to-red-500 border-2 border-white shadow-sm shadow-rose-500/30" />
              </button>
            )}

            {/* Divider */}
            {user && <div className="w-px h-5 bg-slate-200 mx-1.5" />}

            {/* ── Logged-in profile ── */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-md shadow-blue-500/20">
                    {initial}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-none">
                    <span className="text-[12px] font-semibold text-slate-700 max-w-[100px] truncate">
                      {user.email?.split("@")[0] ?? "User"}
                    </span>
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-wider mt-1",
                      isAdmin ? "text-blue-500" : "text-slate-400"
                    )}>
                      {isAdmin ? "Admin" : "Borrower"}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="hidden sm:block"
                  >
                    <ChevronDown size={13} className="text-slate-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 top-[calc(100%+8px)] w-60 bg-white rounded-2xl shadow-xl shadow-slate-300/50 border border-slate-200/80 overflow-hidden z-50"
                    >
                      {/* Header */}
                      <div className="px-4 py-3.5 bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-slate-100">
                        <p className="text-[12px] font-bold text-slate-800 truncate">
                          {user.email ?? "User"}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-500/30" />
                          <p className="text-[10px] font-semibold text-emerald-600">Active session</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-1.5 space-y-0.5">
                        {isAdmin && (
                          <Link
                            to={ROUTES.ADMIN_DASHBOARD}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <LayoutDashboard size={14} className="text-blue-500" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to={ROUTES.USER_DASHBOARD}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User size={14} className="text-slate-400" />
                          My Applications
                        </Link>
                        <div className="h-px bg-slate-100 my-2" />
                        <button
                          onClick={() => { logout(); setDropdownOpen(false); }}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[12px] font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut size={14} />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Guest CTA ── */
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to={ROUTES.USER_DASHBOARD}
                  className="px-3.5 py-2 rounded-xl text-[12px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Track Loan
                </Link>
                <Link
                  to={ROUTES.LOAN_APPLICATION}
                  className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-sm shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                >
                  Apply Now
                </Link>
              </div>
            )}

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors ml-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">

              {/* Mobile search */}
              <div className="flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 mb-3">
                <Search size={13} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search loans, applications…"
                  className="flex-1 bg-transparent outline-none text-[12px] text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* Nav links */}
              {PUBLIC_LINKS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors",
                    isActive(href, pathname)
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <Icon size={15} className="shrink-0" />
                  {label}
                </Link>
              ))}

              {/* Admin link */}
              {isAdmin && (
                <Link
                  to={ROUTES.ADMIN_DASHBOARD}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <LayoutDashboard size={15} className="text-blue-500 shrink-0" />
                  Admin Dashboard
                </Link>
              )}

              <div className="h-px bg-slate-100 my-2" />

              {/* Auth actions */}
              {user ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={15} className="shrink-0" />
                  Sign out
                </button>
              ) : (
                <Link
                  to={ROUTES.LOAN_APPLICATION}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-blue-600 to-violet-600 shadow-sm"
                >
                  Apply Now
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
