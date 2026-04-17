import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { ROUTES } from "./utils/constants";

// Layout shell for nested admin routes
import { AdminRoutes } from "./routes/AdminRoutes";

// Public / user pages
import { Home } from "./features/user/pages/Home";
import { Dashboard as UserDashboard } from "./features/user/pages/Dashboard";
import { LoanApplicationForm } from "./features/user/pages/LoanApplicationForm";
import { ProcessingFee } from "./features/user/pages/ProcessingFee";

// Admin pages
import { AdminDashboard } from "./features/admin/pages/AdminDashboard";
import { LeadManagement } from "./features/admin/pages/LeadManagement";
import { ApplicationDetails } from "./features/admin/pages/ApplicationDetails";
import { RepaymentApprovals } from "./features/admin/pages/RepaymentApprovals";
import { LoansPage } from "./features/admin/pages/LoansPage";
import { RecoveryPage } from "./features/admin/pages/RecoveryPage";
import { UsersPage } from "./features/admin/pages/UsersPage";
import { UserDetails } from "./features/admin/pages/UserDetails";

// Auth pages
import { AdminLogin } from "./features/auth/pages/AdminLogin";
import { AdminSetup } from "./features/auth/pages/AdminSetup";

// 404
import { NotFound } from "./pages/NotFound";

// ─── Page transition wrapper ──────────────────────────────────────────────────
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-in fade-in duration-150">
      <Routes location={location}>

        {/* ── Public ── */}
        <Route path={ROUTES.HOME} element={<Home />} />

        {/* ── Auth ── */}
        <Route path={ROUTES.LOGIN} element={<AdminLogin />} />
        <Route path="/setup-admin" element={<AdminSetup />} />

        {/* ── User ── */}
        <Route path={ROUTES.USER_DASHBOARD} element={<UserDashboard />} />
        <Route path={ROUTES.LOAN_APPLICATION} element={<LoanApplicationForm />} />
        <Route path={ROUTES.PROCESSING_FEE} element={<ProcessingFee />} />

        {/* ── Admin (nested) ── */}
        <Route element={<AdminRoutes />}>
          <Route path={ROUTES.ADMIN_DASHBOARD}              element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_LEADS}                  element={<LeadManagement />} />
          <Route path={`${ROUTES.ADMIN_APPLICATION}/:id`}   element={<ApplicationDetails />} />
          <Route path={ROUTES.ADMIN_REPAYMENTS}             element={<RepaymentApprovals />} />
          <Route path={ROUTES.ADMIN_LOANS}                  element={<LoansPage />} />
          <Route path={ROUTES.ADMIN_RECOVERY}               element={<RecoveryPage />} />
          <Route path={ROUTES.ADMIN_USERS}                  element={<UsersPage />} />
          <Route path={`${ROUTES.ADMIN_USER_DETAIL}/:id`}   element={<UserDetails />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <Router>
      <AuthProvider>
        <AnimatedRoutes />
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;
