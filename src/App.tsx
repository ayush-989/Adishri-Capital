import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { ROUTES } from "./utils/constants";

// User & Public Pages
import { Home } from "./features/user/pages/Home";
import { Dashboard as UserDashboard } from "./features/user/pages/Dashboard";
import { LoanApplicationForm } from "./features/user/pages/LoanApplicationForm";
import { ProcessingFee } from "./features/user/pages/ProcessingFee";

// Admin Pages
import { AdminDashboard } from "./features/admin/pages/AdminDashboard";
import { LeadManagement } from "./features/admin/pages/LeadManagement";
import { ApplicationDetails } from "./features/admin/pages/ApplicationDetails";
import { RepaymentApprovals } from "./features/admin/pages/RepaymentApprovals";

// Auth Pages
import { AdminSetup } from "./features/auth/pages/AdminSetup";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path={ROUTES.HOME} element={<Home />} />

          {/* User */}
          <Route path={ROUTES.USER_DASHBOARD} element={<UserDashboard />} />
          <Route path={ROUTES.LOAN_APPLICATION} element={<LoanApplicationForm />} />
          <Route path={ROUTES.PROCESSING_FEE} element={<ProcessingFee />} />

          {/* Admin — auth guard is inside AdminLayout */}
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_LEADS} element={<LeadManagement />} />
          <Route path={`${ROUTES.ADMIN_LEADS}/:id`} element={<ApplicationDetails />} />
          <Route path={ROUTES.ADMIN_REPAYMENTS} element={<RepaymentApprovals />} />

          {/* Setup */}
          <Route path="/setup-admin" element={<AdminSetup />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;
