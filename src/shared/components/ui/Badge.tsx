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
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50  text-amber-700  border-amber-200",
  danger:  "bg-red-50    text-red-700    border-red-200",
  info:    "bg-blue-50   text-blue-700   border-blue-200",
  neutral: "bg-slate-50  text-slate-600  border-slate-200",
  orange:  "bg-orange-50 text-orange-700 border-orange-200",
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
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", DOT_STYLES[variant])} />}
      {children}
    </span>
  );
}
