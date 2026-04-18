import { cn } from "./Button";

type BadgeVariant =
  | "success"   // green  — approved, active, paid
  | "warning"   // amber  — pending KYC, pending approval
  | "danger"    // red    — rejected, defaulted
  | "info"      // blue   — info, disbursed
  | "neutral"   // slate  — closed, default
  | "orange";   // orange — pending payment

interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: "bg-emerald-50/80 text-emerald-700 border-emerald-200/60",
  warning: "bg-amber-50/80 text-amber-700 border-amber-200/60",
  danger:  "bg-red-50/80 text-red-700 border-red-200/60",
  info:    "bg-blue-50/80 text-blue-700 border-blue-200/60",
  neutral: "bg-slate-50/80 text-slate-600 border-slate-200/60",
  orange:  "bg-orange-50/80 text-orange-700 border-orange-200/60",
};

const DOT_STYLES: Record<BadgeVariant, string> = {
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger:  "bg-red-400",
  info:    "bg-blue-400",
  neutral: "bg-slate-400",
  orange:  "bg-orange-400",
};

export function Badge({ variant = "neutral", dot = true, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-sm",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 shadow-sm", DOT_STYLES[variant])} />}
      {children}
    </span>
  );
}
