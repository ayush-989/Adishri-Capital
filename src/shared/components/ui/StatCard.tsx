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
  href?: string;          // when set, card becomes a clickable link
}

export function StatCard({
  label, value, subtext, icon: Icon,
  trend = "neutral", trendLabel,
  gradient, iconClass, valueClass = "text-slate-900",
  index = 0, href,
}: StatCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp :
    trend === "down" ? TrendingDown : Minus;

  const trendColor =
    trend === "up" ? "text-emerald-600" :
    trend === "down" ? "text-rose-500" : "text-slate-400";

  const inner = (
    <div className="relative">
      {/* Icon + trend */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}>
          <Icon size={18} />
        </div>
        <div className="flex items-center gap-1.5">
          {trendLabel && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon size={11} />
              <span className="text-[10px] font-semibold">{trendLabel}</span>
            </div>
          )}
          {/* Arrow hint only when clickable */}
          {href && (
            <ArrowUpRight
              size={14}
              className="text-slate-300 group-hover:text-slate-500 transition-colors"
            />
          )}
        </div>
      </div>

      <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 mb-1">
        {label}
      </p>
      <p className={`text-[22px] font-bold leading-tight tracking-tight ${valueClass}`}>
        {value}
      </p>
      <p className="text-[11px] text-slate-400 mt-1.5">{subtext}</p>
    </div>
  );

  const baseClass = `
    group relative bg-gradient-to-br ${gradient}
    rounded-2xl border border-slate-200/70 shadow-sm
    hover:shadow-md transition-all duration-200 p-5 overflow-hidden
    ${href ? "cursor-pointer hover:scale-[1.02] hover:border-slate-300/80" : "cursor-default"}
  `;

  const decorOrb = (
    <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/50 blur-2xl pointer-events-none" />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: href ? -3 : -2, transition: { duration: 0.15 } }}
    >
      {href ? (
        <Link to={href} className={baseClass}>
          {decorOrb}
          {inner}
        </Link>
      ) : (
        <div className={baseClass}>
          {decorOrb}
          {inner}
        </div>
      )}
    </motion.div>
  );
}
