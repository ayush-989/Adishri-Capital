import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import { FileQuestion } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-5 text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center">
        <FileQuestion size={36} className="text-slate-400" />
      </div>
      <div>
        <p className="text-6xl font-black text-slate-200 leading-none">404</p>
        <h1 className="text-xl font-bold text-slate-800 mt-2">Page not found</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          Go back
        </button>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
        >
          Go home
        </button>
      </div>
    </div>
  );
}
