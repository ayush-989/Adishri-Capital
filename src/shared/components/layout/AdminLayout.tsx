import {
  ReactNode,
  useState,
  useRef,
  useEffect,
  Component,
  ErrorInfo,
} from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import { useNotifications } from "../../../hooks/useNotifications";
import { useSearch, SearchProvider } from "../../../context/SearchContext";
import { cn } from "../ui/Button";
import { SidebarItem } from "../ui/SidebarItem";
import { APP_NAME, ROUTES } from "../../../utils/constants";
import type { Notification } from "../../../lib/services/notification.service";
import {
  LayoutDashboard, Users, CreditCard, LogOut, Landmark,
  AlertTriangle, Menu, X, Bell, Shield, ChevronDown,
  ChevronRight, Search, Settings, CheckCheck,
  Info, CheckCircle2, AlertCircle, XCircle, UserCircle,
} from "lucide-react";

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { label: "Dashboard",    href: ROUTES.ADMIN_DASHBOARD,  icon: LayoutDashboard, end: true  },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Applications", href: ROUTES.ADMIN_LEADS,      icon: Users,           end: false },
      { label: "Users",        href: ROUTES.ADMIN_USERS,      icon: UserCircle,      end: false },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Repayments",   href: ROUTES.ADMIN_REPAYMENTS, icon: CreditCard,      end: false },
    ],
  },
] as const;

// Flat list kept for breadcrumb logic
const NAV_ITEMS = NAV_SECTIONS.flatMap((s) => s.items);

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

interface Crumb { label: string; href: string; current: boolean }

function buildBreadcrumbs(pathname: string): Crumb[] {
  const root: Crumb = { label: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, current: false };
  if (pathname === ROUTES.ADMIN_DASHBOARD) return [{ ...root, current: true }];
  if (pathname === ROUTES.ADMIN_LEADS)
    return [root, { label: "Applications", href: ROUTES.ADMIN_LEADS, current: true }];
  if (pathname === ROUTES.ADMIN_REPAYMENTS)
    return [root, { label: "Repayments", href: ROUTES.ADMIN_REPAYMENTS, current: true }];
  if (pathname === ROUTES.ADMIN_USERS)
    return [root, { label: "Users", href: ROUTES.ADMIN_USERS, current: true }];
  if (pathname.startsWith(ROUTES.ADMIN_USER_DETAIL + "/")) {
    const id = pathname.split("/").pop() ?? "";
    return [
      root,
      { label: "Users", href: ROUTES.ADMIN_USERS, current: false },
      { label: id.slice(0, 12) + (id.length > 12 ? "…" : ""), href: pathname, current: true },
    ];
  }
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
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
          <AlertTriangle className="text-rose-500" size={26} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-1">Something went wrong</h2>
          <p className="text-sm text-slate-500 max-w-xs">{this.state.message}</p>
        </div>
        <button
          onClick={() => this.setState({ hasError: false, message: "" })}
          className="px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const initial = (user?.email?.[0] ?? "A").toUpperCase();

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">

      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Landmark size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-900 truncate tracking-tight">{APP_NAME}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.15em]">Live</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sectioned nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-2 pb-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.18em]">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarItem key={item.href} {...item} onClick={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mx-4 h-px bg-slate-100" />

      {/* User + logout */}
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-slate-700 truncate leading-tight">
              {user?.email ?? "Administrator"}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Shield size={8} className="text-blue-500" />
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
          <Settings size={12} className="text-slate-400 shrink-0" />
        </div>

        <button
          onClick={logout}
          className="group flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-[12px] font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-all duration-150"
        >
          <LogOut size={14} className="shrink-0 group-hover:text-rose-500 transition-colors" />
          Sign out
        </button>
      </div>
    </div>
  );
}

// ─── Notification icon map ────────────────────────────────────────────────────

const NOTIF_ICON: Record<Notification["type"], { icon: React.ElementType; color: string; bg: string }> = {
  info:    { icon: Info,          color: "text-blue-500",   bg: "bg-blue-50"   },
  success: { icon: CheckCircle2,  color: "text-emerald-500",bg: "bg-emerald-50"},
  warning: { icon: AlertCircle,   color: "text-amber-500",  bg: "bg-amber-50"  },
  error:   { icon: XCircle,       color: "text-rose-500",   bg: "bg-rose-50"   },
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ─── Notification dropdown ────────────────────────────────────────────────────

function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}: {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}) {
  const latest = notifications.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute right-0 top-[calc(100%+6px)] w-80 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-bold text-slate-800">Notifications</p>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold text-white bg-rose-500 px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-500 hover:text-blue-700 transition-colors"
          >
            <CheckCheck size={12} />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-50">
        {latest.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
            <Bell size={24} className="opacity-30" />
            <p className="text-[12px] font-medium">No notifications</p>
          </div>
        ) : (
          latest.map((n) => {
            const cfg = NOTIF_ICON[n.type];
            const Icon = cfg.icon;
            return (
              <button
                key={n.id}
                onClick={() => { onMarkAsRead(n.id); onClose(); }}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50",
                  !n.read && "bg-blue-50/40"
                )}
              >
                {/* Type icon */}
                <div className={`w-7 h-7 rounded-full ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon size={13} className={cfg.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                      "text-[12px] leading-tight truncate",
                      n.read ? "font-medium text-slate-600" : "font-bold text-slate-800"
                    )}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                {/* Unread dot */}
                {!n.read && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60 text-center">
          <p className="text-[11px] text-slate-400">
            Showing 5 of {notifications.length} notifications
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const { searchTerm, setSearchTerm, clearSearch } = useSearch();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [profileOpen, setProfileOpen]   = useState(false);
  const [bellOpen,    setBellOpen]      = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const bellRef    = useRef<HTMLDivElement>(null);

  const crumbs  = buildBreadcrumbs(pathname);
  const initial = (user?.email?.[0] ?? "A").toUpperCase();

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node))
        setBellOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Clear search when navigating away from Applications page
  useEffect(() => {
    if (pathname !== ROUTES.ADMIN_LEADS) clearSearch();
  }, [pathname, clearSearch]);

  const isOnLeads = pathname === ROUTES.ADMIN_LEADS;

  return (
    <header className="h-[60px] shrink-0 sticky top-0 z-30 flex items-center justify-between px-5 sm:px-6 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_0_rgba(0,0,0,0.04)]">

      {/* Left — hamburger + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors shrink-0"
        >
          <Menu size={19} />
        </button>

        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 min-w-0">
          {crumbs.map((crumb, i) => (
            <div key={crumb.href} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && <ChevronRight size={12} className="text-slate-300 shrink-0" />}
              {crumb.current ? (
                <span className="text-[13px] font-semibold text-slate-800 truncate max-w-[180px]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.href}
                  className="text-[12px] font-medium text-slate-400 hover:text-slate-600 transition-colors truncate max-w-[120px]"
                >
                  {crumb.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Center — search (functional on Applications page, decorative elsewhere) */}
      <motion.div
        animate={{ width: searchFocused ? 256 : 192 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "hidden md:flex items-center gap-2 h-8 px-3 rounded-xl border text-[12px] transition-colors duration-150",
          searchFocused
            ? "border-blue-300 bg-white shadow-sm shadow-blue-100/60"
            : "border-slate-200 bg-slate-50"
        )}
      >
        <Search size={13} className={searchFocused ? "text-blue-400" : "text-slate-400"} />
        <input
          type="text"
          value={isOnLeads ? searchTerm : ""}
          onChange={(e) => isOnLeads && setSearchTerm(e.target.value)}
          placeholder={isOnLeads ? "Search applications…" : "Search anything…"}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-[12px] min-w-0"
        />
        {/* Show clear button when there's a search term, otherwise show ⌘K hint */}
        {isOnLeads && searchTerm ? (
          <button
            onMouseDown={(e) => { e.preventDefault(); clearSearch(); }}
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          >
            <X size={12} />
          </button>
        ) : !searchFocused ? (
          <kbd className="text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded font-mono shrink-0">⌘K</kbd>
        ) : null}
      </motion.div>

      {/* Right — bell + profile */}
      <div className="flex items-center gap-1 shrink-0">

        {/* Notification bell */}
        <div className="relative" ref={bellRef}>
          <button
            aria-label="Notifications"
            onClick={() => { setBellOpen((v) => !v); setProfileOpen(false); }}
            className={cn(
              "relative p-2 rounded-lg transition-colors",
              bellOpen ? "bg-slate-100 text-slate-700" : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center">
                <span className="text-[9px] font-bold text-white px-0.5">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </span>
            )}
          </button>

          <AnimatePresence>
            {bellOpen && (
              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onClose={() => setBellOpen(false)}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-4 bg-slate-200 mx-1" />

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen((v) => !v); setBellOpen(false); }}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
              {initial}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-[11px] font-semibold text-slate-700 max-w-[110px] truncate">
                {user?.email?.split("@")[0] ?? "Admin"}
              </span>
              <span className="text-[9px] font-bold text-blue-500 uppercase tracking-wider mt-0.5">
                Super Admin
              </span>
            </div>
            <motion.div
              animate={{ rotate: profileOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:block"
            >
              <ChevronDown size={12} className="text-slate-400" />
            </motion.div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-[calc(100%+6px)] w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden z-50"
              >
                <div className="px-4 py-3 bg-gradient-to-br from-slate-50 to-blue-50/40 border-b border-slate-100">
                  <p className="text-[12px] font-bold text-slate-800 truncate">{user?.email ?? "Administrator"}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <p className="text-[10px] font-semibold text-emerald-600">Active session</p>
                  </div>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[12px] font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut size={13} />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

// ─── AdminLayout ──────────────────────────────────────────────────────────────

interface AdminLayoutProps { children?: ReactNode }

export function AdminLayout({ children }: AdminLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AdminErrorBoundary>
      {/* SearchProvider wraps the entire layout so both Navbar and pages share the same search state */}
      <SearchProvider>
        <div className="flex h-screen overflow-hidden bg-[#f8fafc]">

          {/* Desktop sidebar */}
          <aside className="hidden lg:flex lg:flex-col w-[220px] shrink-0 shadow-[1px_0_0_rgba(0,0,0,0.06)]">
            <SidebarContent />
          </aside>

          {/* Mobile overlay */}
          <AnimatePresence>
            {drawerOpen && (
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              />
            )}
          </AnimatePresence>

          {/* Mobile drawer */}
          <AnimatePresence>
            {drawerOpen && (
              <motion.aside
                key="drawer"
                initial={{ x: -220 }}
                animate={{ x: 0 }}
                exit={{ x: -220 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="fixed inset-y-0 left-0 z-50 flex flex-col w-[220px] shadow-2xl lg:hidden"
              >
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close sidebar"
                  className="absolute top-4 right-3 z-10 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X size={14} />
                </button>
                <SidebarContent onNavigate={() => setDrawerOpen(false)} />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main column */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <AdminNavbar onMenuClick={() => setDrawerOpen(true)} />
            <main className="flex-1 overflow-y-auto">
              {children ?? <Outlet />}
            </main>
          </div>

        </div>
      </SearchProvider>
    </AdminErrorBoundary>
  );
}
