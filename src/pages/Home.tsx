import { Link } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { Button } from "../components/ui/Button";
import { ROUTES } from "../utils/constants";
import { ShieldCheck, Zap, Clock, ChevronRight } from "lucide-react";

export function Home() {
  return (
    <MainLayout>
      <div className="bg-slate-50 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 overflow-hidden pointer-events-none">
          <div className="absolute -top-[300px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-100/50 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
          <div className="absolute top-[100px] left-[20%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
        </div>

        <section className="relative pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Instant Credit for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Your Financial Needs
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10">
            Adishri Capitals offers quick, transparent, and hassle-free loans.
            Apply online in minutes and get funds disbursed instantly.
          </p>
          <div className="flex justify-center gap-4">
            <Link to={ROUTES.LOAN_APPLICATION}>
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-blue-500/25 shadow-lg group">
                Apply Now <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-24 bg-white relative z-10 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Adishri Capitals?</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Experience a new age of borrowing with zero hidden fees, instant processing, and absolute security.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-blue-50/50 border border-blue-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
                <p className="text-slate-600">Get approval in minutes and have the money in your bank account almost instantly.</p>
              </div>
              
              <div className="p-8 rounded-2xl bg-indigo-50/50 border border-indigo-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">100% Secure</h3>
                <p className="text-slate-600">Your data is encrypted and protected with bank-grade security protocols.</p>
              </div>
              
              <div className="p-8 rounded-2xl bg-sky-50/50 border border-sky-100 hover:shadow-xl transition-shadow duration-300">
                <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Flexible Repayments</h3>
                <p className="text-slate-600">Choose a repayment schedule that fits your lifestyle with no prepayment penalties.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-slate-900 text-white relative z-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have chosen Adishri Capitals for their financial journey.
            </p>
            <Link to={ROUTES.LOAN_APPLICATION}>
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full">
                Apply for a Loan Now
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
