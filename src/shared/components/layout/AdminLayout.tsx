import { ReactNode, useState, Component, ErrorInfo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { loginWithEmail } from "../../../lib/services/auth.service";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { cn } from "../ui/Button";
import { APP_NAME, ROUTES } from "../../../utils/constants";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LogOut,
  Landmark,
  AlertTriangle,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard",    href: ROUTES.ADMIN_DASHBOARD,  icon: LayoutDashboard },
  { label: "Applications", href: ROUTES.ADMIN_LEADS,      icon: Users           },
  { label: "Repayments",   href: ROUTES.ADMIN_REPAYMENTS, icon: CreditCard      },
] as const;

// Map route → page title shown in the top navbar
const PAGE_TITLES: Record<string, string> = {
  [ROUTES.ADMIN_DASHBOARD]:  "Dashboard",
  [ROUTES.ADMIN_LEADS]:      "Applications",
  [ROUTES.ADMIN_REPAYMENTS]: "Repayments",
};

// ─── Error Boundary ───────────────────────────────────────────────────────────

interface EBState { hasError: boolean; message: string }

class AdminErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[AdminErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4 p-8">
          <AlertTriangle className="text-rose-500" size={40} />
          <h2 className="text-xl font-bold text-slate-800">Something went wrong</h2>
          <p className="text-sm text-slate-500 max-w-md text-center">{this.state.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="mt-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Sidebar nav links ────────────────────────────────────────────────────────

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-16 px-5 border-b border-slate-800 shrink-0">
        <Landmark className="h-6 w-6 text-blue-400 shrink-0" />
        <span className="font-bold text-white text-base tracking-tight truncate">
          {APP_NAME}
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            end={href === ROUTES.ADMIN_DASHBOARD}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={cn(
                    "shrink-0 transition-colors",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                <span className="truncate">{label}</span>
                {isActive && (
                  <ChevronRight size={14} className="ml-auto text-blue-300 shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-800 shrink-0">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-150"
        >
          <LogOut size={18} className="shrink-0 text-slate-500" />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── Top navbar ───────────────────────────────────────────────────────────────

function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuth();
  const location = useLocation();

  const pageTitle =
    PAGE_TITLES[location.pathname] ??
    // handle dynamic routes like /admin/leads/:id
    Object.entries(PAGE_TITLES).find(([route]) =>
      location.pathname.startsWith(route)
    )?.[1] ??
    "Admin";

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base font-semibold text-slate-800 tracking-tight">
          {pageTitle}
        </h1>
      </div>

      {/* Right: admin badge */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-xs font-semibold text-slate-700 truncate max-w-[160px]">
            {user?.email ?? "Administrator"}
          </span>
          <span className="text-[10px] font-medium text-blue-600 uppercase tracking-widest">
            Admin
          </span>
        </div>
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 select-none">
          {(user?.email?.[0] ?? "A").toUpperCase()}
        </div>
      </div>
    </header>
  );
}

// ─── Auth gate (login screen) ─────────────────────────────────────────────────

function AdminLoginGate() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await loginWithEmail(email, password);
      await refreshUser();
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity"
          >
            <Landmark className="h-9 w-9 text-blue-600" />
            <span className="font-bold text-2xl text-slate-900">{APP_NAME}</span>
          </button>
          <h2 className="text-2xl font-extrabold text-slate-900">Admin Portal</h2>
          <p className="mt-1.5 text-sm text-slate-500">Restricted access — authorised personnel only</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 px-8 py-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@adishricapitals.com"
            />
            <Input
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Button type="submit" className="w-full mt-2" isLoading={loginLoading}>
              Sign in securely
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── AdminLayout (exported) ───────────────────────────────────────────────────

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-slate-400">Checking authentication...</p>
      </div>
    );
  }

  // ── Auth gate ──
  if (!user || user.role !== "admin") {
    return <AdminLoginGate />;
  }

  // ── Authenticated shell ──
  return (
    <AdminErrorBoundary>
      <div className="flex h-screen overflow-hidden bg-slate-100">

        {/* ── Desktop sidebar (always visible ≥ lg) ── */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 bg-slate-900">
          <SidebarNav />
        </aside>

        {/* ── Mobile drawer overlay ── */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Mobile drawer panel ── */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col transform transition-transform duration-200 ease-in-out lg:hidden",
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Close button */}
          <button
            onClick={() => setDrawerOpen(false)}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
          <SidebarNav onNavigate={() => setDrawerOpen(false)} />
        </aside>

        {/* ── Right column: navbar + content ── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <AdminNavbar onMenuClick={() => setDrawerOpen(true)} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

      </div>
    </AdminErrorBoundary>
  );
}
