import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "./Button";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
 feature/admin-dashboard
        <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">{label}</label>

        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-0.5">{label}</label>
 main
      )}
      <input
        ref={ref}
        className={cn(
 feature/admin-dashboard
          "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] font-medium text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          error && "border-red-300 focus:ring-red-500/30 focus:border-red-400",

          "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm",
          error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
 main
          className
        )}
        {...props}
      />
 feature/admin-dashboard
      {error && <p className="mt-1.5 text-[12px] font-medium text-red-500">{error}</p>}

      {error && <p className="mt-1.5 ml-0.5 text-xs font-medium text-red-500">{error}</p>}
 main
    </div>
  )
);
Input.displayName = "Input";

export { Input };
