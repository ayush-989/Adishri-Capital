import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../shared/components/ui/Card";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { loginWithEmail } from "../../../lib/services/auth.service";
import { useAuth } from "../../../hooks/useAuth";
import { ROUTES } from "../../../utils/constants";
import { toast } from "react-toastify";
import { ShieldCheck, Landmark } from "lucide-react";

export function AdminLogin() {
  const [email, setEmail] = useState("admin@adishricapitals.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  // Redirect back to the page the user originally tried to visit,
  // falling back to the admin dashboard if there's no saved location.
  const from = (location.state as { from?: string })?.from ?? ROUTES.ADMIN_DASHBOARD;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      await refreshUser();
      navigate(from, { replace: true });
    } catch (error: any) {
      // Map Firebase error codes to human-readable messages
      const code = error?.code ?? "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        toast.error("Incorrect email or password.");
      } else if (code === "auth/too-many-requests") {
        toast.error("Too many failed attempts. Try again later.");
      } else if (code === "auth/user-disabled") {
        toast.error("This account has been disabled.");
      } else {
        toast.error(error.message ?? "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6">

        {/* Brand */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-3">
            <Landmark className="h-9 w-9 text-blue-600" />
            <span className="font-bold text-2xl text-slate-900">Adishri Capitals</span>
          </div>
          <p className="text-sm text-slate-500">Admin Portal</p>
        </div>

        <Card className="shadow-xl shadow-blue-500/5 border-blue-100">
          <CardHeader className="bg-blue-50/50 border-b border-blue-100">
            <CardTitle className="text-blue-900 flex items-center gap-2 text-lg">
              <ShieldCheck className="w-5 h-5" /> Sign In
            </CardTitle>
            <CardDescription className="text-blue-700/70">
              Enter your admin credentials to access the dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email"
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
                placeholder="Enter your password"
              />
              <Button type="submit" className="w-full h-11 mt-2" isLoading={loading}>
                Sign In to Dashboard
              </Button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-5">
              No account yet?{" "}
              <a href="/setup-admin" className="text-blue-600 hover:underline font-medium">
                Initialize admin account
              </a>
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
