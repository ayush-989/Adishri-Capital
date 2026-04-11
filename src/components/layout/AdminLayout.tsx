import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navigate, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { toast } from "react-toastify";
import { Landmark } from "lucide-react";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Let AuthContext handle user role fetching. 
      // Note: Must ensure user registered via database has role "admin"
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p>Loading...</p></div>;

  // If not logged in OR logged in but not an admin, show the locked Admin Login screen
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
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

  // Permitted Admin Interface
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
}
