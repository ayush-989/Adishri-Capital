import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight } from "lucide-react";

export interface StatCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  gradient: string;
  iconClass: string;
  valueClass?: string;
  index?: number;
  href?: string;
}

export function StatCard({
  label, value, subtext, icon: Icon,
  trend = "neutral", trendLabel,
  gradient, iconClass, valueClass = "text-slate-800",
  index = 0, href,
}: StatCardProps) {
  const TrendIcon =
    trend === "up"   ? TrendingUp   :
    trend === "down" ? TrendingDown : Minus;

  const trendBg =
    trend === "up"   ? "bg-emerald-50 text-emerald-700" :
    trend === "down" ? "bg-rose-50 text-rose-600"       :
                       "bg-slate-100 text-slate-500";

  const inner = (
    <div className="relative z-10">
      {/* Icon row */}
      <div className="flex items-start justify-between mb-5">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm ${iconClass}`}>
          <Icon size={20} strokeWidth={1.8} />
        </div>
        <div className="flex items-center gap-1.5">
          {trendLabel && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${trendBg}`}>
              <TrendIcon size={9} strokeWidth={2.5} />
              {trendLabel}
            </span>
          )}
          {href && (
            <ArrowUpRight
              size={14}
              className="text-slate-300 group-hover:text-blue-500 transition-colors duration-200"
            />
          )}
        </div>
      </div>

      {/* Label */}
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-1.5">
        {label}
      </p>

      {/* Value */}
      <p className={`text-[26px] font-extrabold leading-none tracking-tight ${valueClass}`}>
        {value}
      </p>

      {/* Subtext */}
      <p className="text-[11px] text-slate-400 mt-2.5 font-medium">{subtext}</p>
    </div>
  );

  const baseClass = `
    group relative bg-white overflow-hidden
    rounded-2xl border border-slate-200/70
    shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
    hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:-translate-y-1 hover:border-slate-300/60
    active:scale-[0.99]
    transition-all duration-250 p-6
    ${href ? "cursor-pointer" : "cursor-default"}
  `;

  // Accent top-border stripe using the gradient prop
  const accentBar = (
    <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${gradient}`} />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.055, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {href ? (
        <Link to={href} className={baseClass}>
          {accentBar}
          {inner}
        </Link>
      ) : (
        <div className={baseClass}>
          {accentBar}
          {inner}
        </div>
      )}
    </motion.div>
  );
}
