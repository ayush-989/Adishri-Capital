import { ReactNode, useState, Component, ErrorInfo } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../../hooks/useAuth";
import { loginWithEmail } from "../../../lib/services/auth.service";
import { ROUTES } from "../../../utils/constants";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { toast } from "react-toastify";
import { Landmark, AlertTriangle } from "lucide-react";

// ─── Error Boundary ───────────────────────────────────────────────────────────
// Catches render errors inside any admin page so the whole app doesn't go blank.

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
            className="mt-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-slate-50">
        <Spinner className="h-8 w-8" />
        <p className="text-sm text-slate-400">Checking authentication...</p>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div
              className="flex justify-center items-center gap-2 mb-6 cursor-pointer"
              onClick={() => navigate(ROUTES.HOME)}
            >
              <Landmark className="h-10 w-10 text-blue-600" />
              <span className="font-bold text-2xl text-slate-900">Adishri Capitals</span>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Admin Portal</h2>
            <p className="mt-2 text-sm text-slate-600">Restricted Access</p>
          </div>
          <div className="mt-8 bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-slate-100">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Administrator Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@adishricapitals.com"
              />
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Button type="submit" className="w-full" isLoading={loginLoading}>
                Secure Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-slate-50">{children}</main>
      </div>
    </AdminErrorBoundary>
  );
}
