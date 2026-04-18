import { type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
 feature/admin-dashboard
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white rounded-2xl shadow-2xl shadow-slate-300/30 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200/60">
        <div className="flex justify-between items-center px-6 py-4.5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
 main
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
 feature/admin-dashboard
        {footer && <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">{footer}</div>}

        {footer && <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">{footer}</div>}
 main
      </div>
    </div>
  );
}
