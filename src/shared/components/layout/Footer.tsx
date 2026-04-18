import { Link } from "react-router-dom";
import { Landmark, Globe, MessageCircle, Share2, Mail, Phone, MapPin } from "lucide-react";
import { ROUTES, APP_NAME } from "../../../utils/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Landmark size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-black text-xl text-slate-900 tracking-tight">
                Adishri <span className="text-blue-600">Capitals</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Empowering your dreams with flexible financial solutions. Fast, secure, and transparent loan approvals at your fingertips.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                <Globe size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                <MessageCircle size={16} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                <Share2 size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link to={ROUTES.HOME} className="text-slate-500 text-sm hover:text-blue-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to={ROUTES.LOAN_APPLICATION} className="text-slate-500 text-sm hover:text-blue-600 transition-colors">Apply for Loan</Link>
              </li>
              <li>
                <Link to={ROUTES.USER_DASHBOARD} className="text-slate-500 text-sm hover:text-blue-600 transition-colors">Track Application</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-500 text-sm">
                <Phone size={16} className="text-blue-600" /> +91 999 000 1111
              </li>
              <li className="flex items-center gap-3 text-slate-500 text-sm">
                <Mail size={16} className="text-blue-600" /> support@adishri.com
              </li>
              <li className="flex items-start gap-3 text-slate-500 text-sm">
                <MapPin size={16} className="text-blue-600 mt-0.5" /> 
                <span>123 Finance Hub, BKC,<br/>Mumbai, India 400051</span>
              </li>
            </ul>
          </div>

          {/* Legal Card */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h4 className="font-bold text-slate-900 mb-3">RBI Registered</h4>
            <p className="text-slate-500 text-[12px] leading-relaxed mb-4">
              Adishri Capitals is a registered NBFC mandated by the Reserve Bank of India. We adhere to the highest standards of data protection and fair lending.
            </p>
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Secured by 256-bit SSL</span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-xs">
            © {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 text-xs hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="text-slate-400 text-xs hover:text-slate-600">Terms of Service</a>
            <a href="#" className="text-slate-400 text-xs hover:text-slate-600">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
