import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../shared/components/ProtectedRoute";
import { AdminLayout } from "../shared/components/layout/AdminLayout";

/**
 * Nested route shell for all /admin/* routes.
 *
 * Layer order (outermost → innermost):
 *   ProtectedRoute  — auth + role check, redirects before anything renders
 *   AdminLayout     — sidebar, navbar, error boundary (only mounts if authed)
 *   Outlet          — the matched child page
 */
export function AdminRoutes() {
  return (
    <ProtectedRoute role="admin">
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </ProtectedRoute>
  );
}
