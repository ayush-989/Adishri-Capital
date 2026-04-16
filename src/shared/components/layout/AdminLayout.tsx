import {
  ReactNode,
  useState,
  useRef,
  useEffect,
  Component,
  ErrorInfo,
} from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Spinner } from "../ui/Spinner";
import { cn } from "../ui/Button";
import { APP_NAME, ROUTES } from "../../../utils/constants";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LogOut,
  Landmark,
  AlertTriangle,
  Menu,
  X,
  Bell,
  Shield,
  ChevronDown,
  Settings,
  ChevronRight,
} from "lucide-react";

// ─── Navigation config ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard",    href: ROUTES.ADMIN_DASHBOARD,  icon: LayoutDashboard, end: true  },
  { label: "Applications", href: ROUTES.ADMIN_LEADS,      icon: Users,           end: false },
  { label: "Repayments",   href: ROUTES.ADMIN_REPAYMENTS, icon: CreditCard,      end: false },
] as const;

// ─── Breadcrumb helpers ───────────────────────────────────────────────────────

interface Crumb { label: string; href: string; current: boolean }

function buildBreadcrumbs(pathname: string): Crumb[] {
  const root: Crumb = { label: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, current: false };

  if (pathname === ROUTES.ADMIN_DASHBOARD)
    return [{ ...root, current: true }];

  if (pathname === ROUTES.ADMIN_LEADS)
    return [root, { label: "Applications", href: ROUTES.ADMIN_LEADS, current: true }];

  if (pathname === ROUTES.ADMIN_REPAYMENTS)
    return [root, { label: "Repayments", href: ROUTES.ADMIN_REPAYMENTS, current: true }];

  // /admin/application/:id
  if (pathname.startsWith(ROUTES.ADMIN_APPLICATION + "/")) {
    const id = pathname.split("/").pop() ?? "";
    return [
      root,
      { label: "Applications", href: ROUTES.ADMIN_LEADS, current: false },
      { label: id, href: pathname, current: true },
    ];
  }

  return [root];
}

// ─── Error Boundary ───────────────────────────────────────────────────────────

interface EBState { hasError: boolean; message: string }

class AdminErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false, message: "" };

  static getDerivedStateFromError(err: Error): EBState {
    return { hasError: true, message: err.message };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error("[AdminErrorBoundary]", err, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-5 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center">
          <AlertTriangle className="text-rose-500" size={30} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Something went wrong</h2>
          <p className="text-sm text-slate-500 max-w-xs">{this.state.message}</p>
        </div>
        <button
          onClick={() => this.setState({ hasError: false, message: "" })}
          className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const initial = (user?.email?.[0] ?? "A").toUpperCase();

  return (
    <div className="flex flex-col h-full bg-slate-900 select-none">

      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
            <Landmark size={17} className="text-white" />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="text-[13px] font-bold text-white truncate">{APP_NAME}</p>
            <p className="text-[10px] font-medium text-slate-500 tracking-wider uppercase">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Section label */}
      <p className="px-5 pt-5 pb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
        Menu
      </p>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-0.5 pb-4">
        {NAV_ITEMS.map(({ label, href, icon: Icon, end }) => (
          <NavLink
            key={href}
            to={href}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium",
                "border-l-4 transition-all duration-150",
                isActive
                  ? "bg-slate-800 text-white border-indigo-500"
                  : "text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className={cn(
                    "shrink-0 transition-colors duration-150",
                    isActive
                      ? "text-indigo-400"
                      : "text-slate-600 group-hover:text-slate-400"
                  )}
                />
                <span className="truncate">{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: user card + sign out */}
      <div className="p-3 border-t border-white/5 space-y-1 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/40">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-slate-300 truncate leading-tight">
              {user?.email ?? "Administrator"}
            </p>
            <p className="text-[10px] text-slate-600">Super Admin</p>
          </div>
          <Settings size={13} className="text-slate-600 shrink-0" />
        </div>

        <button
          onClick={logout}
          className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-150"
        >
          <LogOut size={15} className="shrink-0 transition-colors duration-150 group-hover:text-rose-400" />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── Top Navbar ───────────────────────────────────────────────────────────────

function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const crumbs = buildBreadcrumbs(pathname);
  const initial = (user?.email?.[0] ?? "A").toUpperCase();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 shrink-0 sticky top-0 z-30 flex items-center justify-between px-5 sm:px-7 bg-white/80 backdrop-blur-md border-b border-slate-200/70 shadow-sm">

      {/* Left — hamburger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="lg:hidden p-2 -ml-1 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 min-w-0">
          {crumbs.map((crumb, i) => (
            <div key={crumb.href} className="flex items-center gap-1 min-w-0">
              {i > 0 && (
                <ChevronRight size={13} className="text-slate-300 shrink-0" />
              )}
              {crumb.current ? (
                <span className="text-[14px] font-bold text-slate-800 truncate max-w-[160px]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.href}
                  className="text-[13px] font-medium text-slate-400 hover:text-slate-600 transition-colors truncate max-w-[120px]"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right — bell + profile */}
      <div className="flex items-center gap-1.5 shrink-0">

        <button
          aria-label="Notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500 ring-[1.5px] ring-white" />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1" />

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initial}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-[12px] font-semibold text-slate-700 max-w-[130px] truncate">
                {user?.email ?? "Administrator"}
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                Admin
              </span>
            </div>
            <ChevronDown
              size={13}
              className={cn(
                "text-slate-400 transition-transform duration-200 hidden sm:block",
                dropdownOpen && "rotate-180"
              )}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-60 bg-white rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 overflow-hidden z-50">
              <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-100">
                <p className="text-[12px] font-bold text-slate-800 truncate">
                  {user?.email ?? "Administrator"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Shield size={10} className="text-indigo-500" />
                  <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                    Super Admin
                  </p>
                </div>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => { logout(); setDropdownOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── AdminLayout (exported) ───────────────────────────────────────────────────

interface AdminLayoutProps { children?: ReactNode }

export function AdminLayout({ children }: AdminLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AdminErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-slate-100">

        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 shadow-xl shadow-black/10">
          <Sidebar />
        </aside>

        {/* Mobile overlay */}
        <div
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
          className={cn(
            "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
            drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        />

        {/* Mobile drawer */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex flex-col w-64 shadow-2xl",
            "transform transition-transform duration-200 ease-in-out lg:hidden",
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close sidebar"
            className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
          <Sidebar onNavigate={() => setDrawerOpen(false)} />
        </aside>

        {/* Main column */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <AdminNavbar onMenuClick={() => setDrawerOpen(true)} />
          <main className="flex-1 overflow-y-auto p-6 sm:p-8">
            {/* children = legacy direct wrapping; Outlet = nested route usage */}
            {children ?? <Outlet />}
          </main>
        </div>

      </div>
    </AdminErrorBoundary>
  );
}
