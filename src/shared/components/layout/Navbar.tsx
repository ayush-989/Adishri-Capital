import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Landmark, MoreVertical, X, Settings, LogOut, LayoutDashboard, Search, FileText, Home } from "lucide-react";
import { ROUTES } from "../../../utils/constants";

const NAV_LINKS = [
  { label: "Home", href: ROUTES.HOME, icon: Home },
  { label: "Apply Now", href: ROUTES.LOAN_APPLICATION, icon: FileText },
  { label: "Track Loan", href: ROUTES.USER_DASHBOARD, icon: Search },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 bg-[#102777] rounded-xl flex items-center justify-center shadow-md ring-4 ring-[#102777]/5 hover:scale-105 transition-transform duration-300">
              <Landmark className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-black text-xl text-[#102777] tracking-tight">
              Adishri <span className="text-[#E66325]">Capitals</span>
            </span>
          </Link>

          {/* 3 dots Menu (Visible Everywhere) */}
          <div className="relative" ref={dropdownRef}>
            <button
              className={`p-2 rounded-xl transition-all duration-300 ${menuOpen ? 'bg-[#102777] text-white shadow-lg' : 'text-slate-600 hover:bg-[#102777]/5'}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <MoreVertical size={24} />}
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute top-14 right-0 w-64 bg-white border border-slate-100 rounded-3xl shadow-[0_20px_50px_rgba(16,39,119,0.1)] p-3 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="px-4 py-3 mb-2 border-b border-slate-50">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Navigation</p>
                </div>

                <div className="space-y-1">
                  {NAV_LINKS.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${active ? "bg-[#102777] text-white shadow-md shadow-[#102777]/20" : "text-slate-600 hover:bg-[#FBFBFB] hover:text-[#E66325]"
                          }`}
                      >
                        <link.icon size={18} strokeWidth={active ? 2.5 : 2} />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {user && (
                  <div className="mt-4 pt-4 border-t border-slate-50 space-y-1">
                    <p className="px-4 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account</p>
                    {isAdmin && (
                      <Link
                        to={ROUTES.ADMIN_DASHBOARD}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-[#FBFBFB] hover:text-[#102777] transition-all"
                      >
                        <LayoutDashboard size={18} />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all text-left"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}

                <div className="mt-4 p-2">
                  <Link
                    to={ROUTES.LOAN_APPLICATION}
                    className="flex items-center justify-center h-12 w-full bg-[#E66325] hover:bg-[#D4541B] text-white font-black rounded-2xl text-sm transition-all shadow-lg active:scale-95"
                  >
                    Quick Apply
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}