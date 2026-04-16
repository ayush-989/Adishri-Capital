import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";
import { Spinner } from "./ui/Spinner";
import { ShieldX, Home } from "lucide-react";

interface ProtectedRouteProps {
  /** Required role to access this route. Defaults to "admin". */
  role?: "admin" | "user";
  children: React.ReactNode;
}

// ─── Access Denied page ───────────────────────────────────────────────────────
// Shown when the user IS authenticated but has the wrong role.
// Separate from 404 — the route exists, the user just isn't allowed in.

function AccessDenied() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-5 text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-rose-50 flex items-center justify-center">
        <ShieldX size={36} className="text-rose-400" />
      </div>
      <div>
        <p className="text-5xl font-black text-slate-200 leading-none mb-3">403</p>
        <h1 className="text-xl font-bold text-slate-800">Access Denied</h1>
        <p className="text-sm text-slate-500 mt-1.5 max-w-xs">
          You don't have permission to view this page. Admin access is required.
        </p>
      </div>
      <a
        href={ROUTES.HOME}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
      >
        <Home size={15} />
        Back to Home
      </a>
    </div>
  );
}

// ─── ProtectedRoute ───────────────────────────────────────────────────────────

export function ProtectedRoute({ role = "admin", children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Auth is still resolving — show a full-screen spinner.
  //    Never redirect during this phase or you'll get false logouts.
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
        <Spinner className="h-8 w-8" />
        <p className="text-[13px] text-slate-400">Checking authentication…</p>
      </div>
    );
  }

  // 2. Not logged in → redirect to /login.
  //    Preserve the attempted URL in `state.from` so the login page
  //    can redirect back after a successful sign-in.
  if (!user) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // 3. Logged in but wrong role → show Access Denied (not a redirect).
  //    A regular user hitting /admin should see 403, not be silently
  //    bounced to home with no explanation.
  if (user.role !== role) {
    return <AccessDenied />;
  }

  // 4. Authenticated + correct role → render the protected content.
  return <>{children}</>;
}
