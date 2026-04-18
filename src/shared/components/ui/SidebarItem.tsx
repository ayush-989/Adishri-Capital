import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "./Button";

interface SidebarItemProps {
  label: string;
  href: string;
  icon: React.ElementType;
  end?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ label, href, icon: Icon, end = false, onClick }: SidebarItemProps) {
  return (
    <NavLink to={href} end={end} onClick={onClick} className="block">
      {({ isActive }) => (
        <motion.div
          whileHover={{ x: isActive ? 0 : 2, transition: { duration: 0.15 } }}
          className={cn(
            "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer select-none overflow-hidden",
            isActive
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
              : "text-slate-400 hover:text-white hover:bg-white/8"
          )}
        >
          {/* Active left accent */}
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-white/70 rounded-r-full" />
          )}

          {/* Subtle shimmer on active */}
          {isActive && (
            <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
          )}

          <Icon
            size={15}
            className={cn(
              "shrink-0 transition-colors relative z-10",
              isActive ? "text-white" : "text-slate-500"
            )}
          />
          <span className="truncate relative z-10 tracking-tight">{label}</span>

          {isActive && (
            <motion.span
              layoutId="sidebar-dot"
              className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60 shrink-0 relative z-10"
            />
          )}
        </motion.div>
      )}
    </NavLink>
  );
}
