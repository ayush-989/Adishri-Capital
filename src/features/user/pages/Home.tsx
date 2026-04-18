import { Link } from "react-router-dom";
import { MainLayout } from "../../../shared/components/layout/MainLayout";
import { Button } from "../../../shared/components/ui/Button";
import { ROUTES } from "../../../utils/constants";
import { ShieldCheck, Zap, Clock, ChevronRight } from "lucide-react";

export function Home() {
  return (
    <MainLayout>
      <div className="bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 overflow-hidden pointer-events-none">
          <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-100/50 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
          <div className="absolute top-[100px] left-[20%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
        </div>

        <section className="relative pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
            Instant Credit for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600">
              Your Financial Needs
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-12 font-medium">
            Adishri Capitals offers quick, transparent, and hassle-free loans. Apply online in minutes and get funds disbursed instantly.
          </p>
          <div className="flex justify-center gap-5">
            <Link to={ROUTES.LOAN_APPLICATION}>
              <Button size="lg" className="h-14 px-10 text-lg rounded-2xl shadow-xl shadow-blue-500/20 group">
                Apply Now <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-28 bg-white relative z-10 border-t border-slate-100/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5 tracking-tight">Why Choose Adishri Capitals?</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Experience a new age of borrowing with zero hidden fees, instant processing, and absolute security.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-9 rounded-2xl bg-gradient-to-br from-blue-50/80 to-blue-100/30 border border-blue-100/60 hover:shadow-2xl hover:shadow-blue-200/30 hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20"><Zap className="w-8 h-8" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
                <p className="text-slate-500">Get approval in minutes and have the money in your bank account almost instantly.</p>
              </div>
              <div className="p-9 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-indigo-100/30 border border-indigo-100/60 hover:shadow-2xl hover:shadow-indigo-200/30 hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20"><ShieldCheck className="w-8 h-8" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">100% Secure</h3>
                <p className="text-slate-500">Your data is encrypted and protected with bank-grade security protocols.</p>
              </div>
              <div className="p-9 rounded-2xl bg-gradient-to-br from-sky-50/80 to-sky-100/30 border border-sky-100/60 hover:shadow-2xl hover:shadow-sky-200/30 hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-sky-500/20"><Clock className="w-8 h-8" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Flexible Repayments</h3>
                <p className="text-slate-500">Choose a repayment schedule that fits your lifestyle with no prepayment penalties.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-28 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white relative z-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-7 tracking-tight">Ready to get started?</h2>
            <p className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of satisfied customers who have chosen Adishri Capitals for their financial journey.
            </p>
            <Link to={ROUTES.LOAN_APPLICATION}>
              <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-sm">
                Apply for a Loan Now
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
