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
            "relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer select-none",
            isActive
              ? "bg-blue-50 text-blue-700 border border-blue-100"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          )}
        >
          {/* Active left accent bar */}
          {isActive && (
            <motion.span
              layoutId="sidebar-active-bar"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-500 rounded-full"
            />
          )}

          <Icon
            size={15}
            className={cn(
              "shrink-0 transition-colors",
              isActive ? "text-blue-500" : "text-slate-400"
            )}
          />

          <span className="truncate">{label}</span>

          {isActive && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"
            />
          )}
        </motion.div>
      )}
    </NavLink>
  );
}
