import { type ButtonHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
 feature/admin-dashboard
      primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 border-0",
      secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 font-medium",
      outline: "bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800",
      ghost: "bg-transparent border-0 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
      danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md shadow-red-500/20 hover:shadow-red-500/30 border-0",

      primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm border border-transparent hover:shadow-md active:scale-[0.98]",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-transparent active:scale-[0.98]",
      outline: "bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-[0.98]",
      ghost: "bg-transparent border-transparent text-gray-700 hover:bg-gray-100 active:scale-[0.98]",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm border border-transparent active:scale-[0.98]",
 main
    };

    const sizes = {
      sm: "h-8 px-4 text-xs tracking-wide",
      md: "h-11 px-5 py-2 text-sm font-medium",
      lg: "h-14 px-8 text-base font-medium",
    };

    return (
      <button
        ref={ref}
        className={cn(
 feature/admin-dashboard
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",

          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
 main
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
