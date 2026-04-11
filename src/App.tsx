import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { ROUTES } from "./utils/constants";

// Pages
import { Home } from "./pages/Home";
import { Dashboard as UserDashboard } from "./pages/user/Dashboard";
import { LoanApplicationForm } from "./pages/user/LoanApplicationForm";
import { ProcessingFee } from "./pages/user/ProcessingFee";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { LeadManagement } from "./pages/admin/LeadManagement";
import { ApplicationDetails } from "./pages/admin/ApplicationDetails";
import { RepaymentApprovals } from "./pages/admin/RepaymentApprovals";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<Home />} />

          {/* User Routes (No auth required) */}
          <Route path={ROUTES.USER_DASHBOARD} element={<UserDashboard />} />
          <Route path={ROUTES.LOAN_APPLICATION} element={<LoanApplicationForm />} />
          <Route path={ROUTES.PROCESSING_FEE} element={<ProcessingFee />} />

          {/* Admin Routes (Auth handled by AdminLayout inwardly) */}
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_LEADS} element={<LeadManagement />} />
          <Route path={`${ROUTES.ADMIN_LEADS}/:id`} element={<ApplicationDetails />} />
          <Route path={ROUTES.ADMIN_REPAYMENTS} element={<RepaymentApprovals />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;
