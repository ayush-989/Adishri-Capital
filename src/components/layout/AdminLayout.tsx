import { type ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { toast } from "react-toastify";
import { Landmark } from "lucide-react";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, refreshUser } = useAuth();
  
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
      // Force refresh the user data to ensure the 'admin' role is loaded
      await refreshUser();
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="max-w-md w-full space-y-8 relative z-10">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Landmark className="h-6 w-6 text-white" />
              </div>
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">Admin Portal</h2>
            <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-widest">Restricted Access</p>
          </div>
          <div className="mt-8 bg-white/80 backdrop-blur-xl py-8 px-6 shadow-2xl sm:rounded-3xl sm:px-10 border border-gray-100/50">
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
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-50/50">
        {children}
      </main>
    </div>
  );
}
