import { Link } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { ROUTES } from "../utils/constants";
import {
  ShieldCheck,
  Zap,
  Clock,
  ChevronRight,
  BadgePercent,
  FileCheck2,
  CreditCard,
  Wallet,
  Star,
  ArrowRight,
  CircleCheck,
  TrendingUp,
} from "lucide-react";

const LOAN_TYPES = [
  {
    icon: Wallet,
    title: "Personal Loan",
    range: "₹5,000 – ₹2,00,000",
    rate: "From 3% flat",
    desc: "Medical, education, travel — any personal need covered instantly.",
    gradient: "from-blue-500 to-blue-700",
    light: "bg-blue-50 border-blue-100",
    accent: "text-blue-600",
  },
  {
    icon: CreditCard,
    title: "Short-Term Loan",
    range: "₹1,000 – ₹50,000",
    rate: "From 5% flat",
    desc: "Urgent cash needs, quick disbursal, flexible repayments.",
    gradient: "from-violet-500 to-violet-700",
    light: "bg-violet-50 border-violet-100",
    accent: "text-violet-600",
  },
  {
    icon: BadgePercent,
    title: "Business Micro Loan",
    range: "₹10,000 – ₹5,00,000",
    rate: "From 2.5% flat",
    desc: "Fuel your business with minimal documentation required.",
    gradient: "from-indigo-500 to-indigo-700",
    light: "bg-indigo-50 border-indigo-100",
    accent: "text-indigo-600",
  },
];

const ELIGIBILITY = [
  "Indian citizen aged 21–60 years",
  "Valid Aadhaar & PAN card",
  "Active bank account with passbook",
  "Minimum monthly income of ₹8,000",
  "No active defaults on credit bureau",
];

const STEPS = [
  { num: "01", title: "Fill Application", desc: "Enter your basic details and upload KYC documents in minutes.", icon: FileCheck2 },
  { num: "02", title: "Pay ₹49 Fee", desc: "One-time processing fee via UPI to initiate verification.", icon: CreditCard },
  { num: "03", title: "KYC Verified", desc: "Our team verifies your documents within 24 hours.", icon: ShieldCheck },
  { num: "04", title: "Amount Credited", desc: "Approved amount transferred directly to your bank.", icon: Wallet },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", city: "Mumbai", text: "Got ₹50,000 credited within 2 days! Super simple and transparent process.", stars: 5 },
  { name: "Ramesh Patel", city: "Ahmedabad", text: "Saved my business during an emergency. Highly recommend Adishri Capitals!", stars: 5 },
  { name: "Anjali Verma", city: "Delhi", text: "No hidden charges, fair rates. The tracking dashboard is very helpful.", stars: 4 },
];

export function Home() {
  return (
    <MainLayout>
      <div className="bg-white overflow-hidden">

        {/* ── HERO ── */}
        <section className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Instant Approval · Zero Hidden Charges
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
              Instant Credit for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Your Needs
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
              Apply online in minutes. Get funds disbursed to your bank account
              quickly and transparently.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={ROUTES.LOAN_APPLICATION}
                className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white font-bold px-7 py-4 rounded-2xl text-base transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-400/40 hover:-translate-y-0.5"
              >
                Apply Now <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to={ROUTES.USER_DASHBOARD}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-4 rounded-2xl text-base transition-all duration-200 backdrop-blur-sm"
              >
                Track My Application
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-3 gap-4 max-w-md mx-auto">
              {[
                { val: "₹50 Cr+", label: "Disbursed" },
                { val: "10K+", label: "Borrowers" },
                { val: "24 hrs", label: "Avg Approval" },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-2">
                  <p className="text-xl sm:text-2xl font-extrabold text-white">{s.val}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US ── */}
        <section className="py-16 sm:py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-2">Why Choose Us</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Built for Borrowers Like You</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Approval in minutes, disbursal almost instantly.", color: "blue" },
                { icon: ShieldCheck, title: "100% Secure", desc: "Bank-grade encryption protects your data always.", color: "indigo" },
                { icon: Clock, title: "Flexible Repay", desc: "Choose a repayment schedule that suits your life.", color: "violet" },
              ].map((f) => (
                <div key={f.title} className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${f.color}-50`}>
                    <f.icon className={`w-6 h-6 text-${f.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOAN TYPES ── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-2">Our Products</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Loan Types We Offer</h2>
              <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">
                Tailored loan products for every financial situation.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {LOAN_TYPES.map((loan) => {
                const Icon = loan.icon;
                return (
                  <div
                    key={loan.title}
                    className={`rounded-2xl border ${loan.light} p-6 flex flex-col gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${loan.gradient} flex items-center justify-center shadow-sm`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-lg mb-0.5">{loan.title}</h3>
                      <p className={`text-sm font-semibold ${loan.accent} mb-1`}>{loan.range}</p>
                      <span className="inline-block bg-white border border-current/20 text-xs font-bold px-2.5 py-1 rounded-full mb-3 text-slate-700">
                        {loan.rate}
                      </span>
                      <p className="text-slate-500 text-sm leading-relaxed">{loan.desc}</p>
                    </div>
                    <Link
                      to={ROUTES.LOAN_APPLICATION}
                      className={`inline-flex items-center gap-1 text-sm font-semibold ${loan.accent} hover:gap-2 transition-all`}
                    >
                      Apply Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── INTEREST RATES TABLE ── */}
        <section className="py-16 sm:py-20 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-2">Transparent Pricing</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Interest Rates & Charges</h2>
              <p className="text-slate-500 text-sm mt-3">No surprises. Know exactly what you're paying.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Mobile-friendly card layout */}
              <div className="sm:hidden divide-y divide-slate-100">
                {[
                  { type: "Personal Loan", range: "₹5K–₹2L", rate: "3%–12% flat", tenure: "1–24 mo", fee: "₹49" },
                  { type: "Short-Term", range: "₹1K–₹50K", rate: "5%–15% flat", tenure: "7–90 days", fee: "₹49" },
                  { type: "Business Micro", range: "₹10K–₹5L", rate: "2.5%–10% flat", tenure: "3–36 mo", fee: "₹49" },
                ].map((row) => (
                  <div key={row.type} className="p-5">
                    <p className="font-bold text-slate-900 mb-3">{row.type}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs mb-0.5">Amount Range</p>
                        <p className="font-medium text-slate-700">{row.range}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-0.5">Interest Rate</p>
                        <p className="font-medium text-slate-700">{row.rate}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-0.5">Tenure</p>
                        <p className="font-medium text-slate-700">{row.tenure}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs mb-0.5">Processing Fee</p>
                        <p className="font-semibold text-blue-600">{row.fee} (one-time)</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <table className="hidden sm:table w-full text-left text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    {["Loan Type", "Amount Range", "Interest Rate", "Tenure", "Processing Fee"].map((h) => (
                      <th key={h} className="px-5 py-4 font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["Personal Loan", "₹5K – ₹2L", "3% – 12% flat", "1–24 months", "₹49 (one-time)"],
                    ["Short-Term Loan", "₹1K – ₹50K", "5% – 15% flat", "7–90 days", "₹49 (one-time)"],
                    ["Business Micro", "₹10K – ₹5L", "2.5% – 10% flat", "3–36 months", "₹49 (one-time)"],
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className={`px-5 py-4 ${j === 0 ? "font-semibold text-slate-900" : "text-slate-600"}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">
              * Rates are indicative. Final rate is set by admin at time of approval.
            </p>
          </div>
        </section>

        {/* ── ELIGIBILITY + HOW IT WORKS ── */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-900 to-blue-950 text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Eligibility */}
              <div>
                <p className="text-blue-400 font-semibold text-xs uppercase tracking-widest mb-3">Eligibility</p>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">Who Can Apply?</h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  Minimal requirements so more people can access credit quickly.
                </p>
                <ul className="space-y-3">
                  {ELIGIBILITY.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CircleCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={ROUTES.LOAN_APPLICATION}
                  className="inline-flex items-center gap-2 mt-8 bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition-all"
                >
                  Check Eligibility & Apply <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* How It Works */}
              <div>
                <p className="text-blue-400 font-semibold text-xs uppercase tracking-widest mb-3">Process</p>
                <h2 className="text-2xl sm:text-3xl font-bold mb-8">How It Works</h2>
                <div className="space-y-4">
                  {STEPS.map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.num} className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold text-blue-400">{step.num}</span>
                            <h4 className="font-bold text-white text-sm">{step.title}</h4>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-2">Reviews</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">What Borrowers Say</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm italic mb-5 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <TrendingUp className="w-10 h-10 text-white/60 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 text-sm sm:text-base mb-8 max-w-md mx-auto">
              Join thousands of satisfied customers who chose Adishri Capitals for their financial journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to={ROUTES.LOAN_APPLICATION}
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 font-bold px-7 py-4 rounded-2xl text-base hover:bg-blue-50 transition-all shadow-lg shadow-blue-900/20"
              >
                Apply for a Loan <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                to={ROUTES.USER_DASHBOARD}
                className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-7 py-4 rounded-2xl text-base hover:bg-white/25 transition-all"
              >
                Track Application
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
