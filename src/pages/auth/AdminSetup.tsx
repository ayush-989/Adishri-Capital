import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { toast } from "react-toastify";
import { ShieldCheck, ArrowRight, Landmark } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";

export function AdminSetup() {
  const [email, setEmail] = useState("admin@adishricapitals.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create the user document in Firestore with 'admin' role
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "admin",
        createdAt: serverTimestamp(),
      });

      // 3. Force refresh the AuthContext to fetch the new role
      await refreshUser();

      toast.success("Admin account initialized successfully!");
      
      // Redirect to dashboard
      navigate(ROUTES.ADMIN_DASHBOARD);
    } catch (error: any) {
      console.error("Setup error:", error);
      toast.error(error.message || "Failed to initialize admin account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Landmark className="h-10 w-10 text-blue-600" />
            <span className="font-bold text-2xl text-slate-900">Adishri Capitals</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">System Initialization</h1>
          <p className="mt-2 text-sm text-slate-600 italic">Temporary Admin Setup Portal</p>
        </div>

        <Card className="border-blue-100 shadow-xl shadow-blue-500/5">
          <CardHeader className="bg-blue-50/50 border-b border-blue-100">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" /> Create Admin Account
            </CardTitle>
            <CardDescription className="text-blue-700/70">
              Configure the primary administrative credentials for the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSetup} className="space-y-4">
              <Input
                label="Administrator Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@adishricapitals.com"
              />
              <Input
                label="Master Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Notice:</strong> This account will have full access to manage loans, verify KYC documents, and process financial transitions. Please secure these credentials.
                </p>
              </div>
              <Button type="submit" className="w-full h-12 text-lg mt-6" isLoading={loading}>
                Initialize Admin <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t border-slate-100 py-4 flex justify-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold font-mono">
              Secure Environment • System v1.0
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
