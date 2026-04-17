import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import "react-toastify/dist/ReactToastify.css";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 py-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Adishri Capitals. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs mt-2">Licensed NBFC | RBI Registered | Your data is safe with us</p>
        </div>
      </footer>
    </div>
  );
}
