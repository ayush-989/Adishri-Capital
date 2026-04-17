import { Link } from "react-router-dom";
import { MainLayout } from "../../../shared/components/layout/MainLayout";
import { ROUTES } from "../../../utils/constants";
import {
  ShieldCheck,
  Zap,
  IndianRupee,
  Wallet,
  Clock,
  Briefcase,
  FileCheck2,
  CreditCard,
  Star,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { FadeUp } from "../../../shared/components/ui/FadeUp";

/* ─────────────────────────────────────────────────────────────── */
/*  Static data                                                     */
/* ─────────────────────────────────────────────────────────────── */

const WHY_US = [
  {
    icon: Zap,
    title: "24-Hour Approval",
    desc: "Apply online and get a decision within a single business day. No branch visits.",
  },
  {
    icon: ShieldCheck,
    title: "100% Secure",
    desc: "Bank-grade encryption and RBI-registered NBFC. Your data never leaves India.",
  },
  {
    icon: IndianRupee,
    title: "Transparent Pricing",
    desc: "No hidden fees. See your full EMI, interest, and charges upfront before you accept.",
  },
];

const LOAN_TYPES = [
  {
    icon: Wallet,
    title: "Personal Loan",
    desc: "Fund weddings, travel, medical or any life goal.",
    amount: "₹25,000 – ₹5,00,000",
    tenure: "6 – 36 months",
    rate: "From 12.5% p.a.",
    theme: "blue",
  },
  {
    icon: Clock,
    title: "Short-Term Loan",
    desc: "Cover urgent cash needs with flexible repayment.",
    amount: "₹5,000 – ₹1,00,000",
    tenure: "3 – 12 months",
    rate: "From 14% p.a.",
    theme: "slate",
  },
  {
    icon: Briefcase,
    title: "Business Micro Loan",
    desc: "Grow your shop, inventory or working capital.",
    amount: "₹50,000 – ₹5,00,000",
    tenure: "12 – 48 months",
    rate: "From 15% p.a.",
    theme: "indigo",
  },
];

const STEPS = [
  { num: 1, icon: FileCheck2, title: "Apply Online",      desc: "Fill our 5-step form in under 5 minutes" },
  { num: 2, icon: ShieldCheck, title: "KYC Verification", desc: "Upload Aadhaar, PAN & income proof" },
  { num: 3, icon: CreditCard,  title: "Get Approved",     desc: "Receive sanction letter within 24 hours" },
  { num: 4, icon: Wallet,      title: "Money in Account", desc: "Funds disbursed to your bank instantly" },
];

const RATES = [
  { product: "Personal Loan",      rate: "12.5% – 24% p.a.", fee: "2% (min ₹499)", closure: "3% on outstanding" },
  { product: "Short-Term Loan",    rate: "14% – 28% p.a.",   fee: "2.5% (min ₹299)", closure: "Nil after 3 EMIs" },
  { product: "Business Micro Loan",rate: "15% – 22% p.a.",   fee: "1.5% (min ₹999)", closure: "4% on outstanding" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", city: "Mumbai",     stars: 5, text: "Got ₹50,000 credited within 2 days! Super simple and transparent process." },
  { name: "Ramesh Patel", city: "Ahmedabad", stars: 5, text: "Saved my business during an emergency. Highly recommend Adishri Capitals!" },
  { name: "Anjali Verma", city: "Delhi",      stars: 5, text: "No hidden charges, fair rates. The tracking dashboard is very helpful." },
];

/* ─────────────────────────────────────────────────────────────── */
/*  Page                                                            */
/* ─────────────────────────────────────────────────────────────── */

export function Home() {
  return (
    <MainLayout>
      <div className="overflow-hidden bg-white">

        {/* ════════════════════════════════════════════════════════
            1. HERO
        ════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-b from-blue-50 to-white pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center text-center lg:text-left mb-16 lg:mb-20">
              
              {/* Left Column: Text & CTAs */}
              <div className="flex flex-col items-center lg:items-start max-w-2xl mx-auto lg:mx-0">
                {/* Trust pill */}
                <FadeUp delay={0.1}>
                  <div className="inline-flex items-center gap-2 text-blue-700 bg-white border border-blue-200 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full mb-8 shadow-sm">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    RBI-Registered NBFC · Trusted by 10,000+ Indians
                  </div>
                </FadeUp>

                {/* Headline */}
                <FadeUp delay={0.2}>
                  <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black text-gray-900 leading-[1.15] mb-6">
                    Loans, simplified.{" "}
                    <span className="text-blue-600 block mt-2">Disbursed in 24 hours.</span>
                  </h1>
                </FadeUp>

                <FadeUp delay={0.3}>
                  <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                    Personal, short-term and business micro loans from ₹5,000 to ₹5,00,000. Fully online.
                    Transparent rates. No hidden charges, ever.
                  </p>
                </FadeUp>

                {/* CTAs */}
                <FadeUp delay={0.4}>
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start">
                    <Link
                      to={ROUTES.LOAN_APPLICATION}
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold px-8 py-3.5 rounded-2xl text-base transition-all shadow-lg shadow-blue-100"
                    >
                      Apply Now <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to={ROUTES.USER_DASHBOARD}
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold px-8 py-3.5 rounded-2xl text-base transition-all shadow-sm"
                    >
                      Track Application
                    </Link>
                  </div>
                </FadeUp>
              </div>

              {/* Right Column: Image Placeholder */}
              <div className="w-full relative">
                <FadeUp delay={0.5}>
                  <div className="relative w-full rounded-[2rem] border border-gray-200 bg-gray-50 shadow-2xl shadow-blue-900/5 aspect-square sm:aspect-video lg:aspect-[4/3] xl:aspect-[16/10] flex items-center justify-center overflow-hidden transform lg:translate-x-4">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-gray-100/40 backdrop-blur-sm" />
                    
                    <div className="relative flex flex-col items-center text-center p-6">
                      <div className="w-16 h-16 border border-gray-200 shadow-sm rounded-2xl flex items-center justify-center mb-4 bg-white text-blue-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-base font-bold text-gray-800">Hero Image / Dashboard Mockup</p>
                      <p className="text-sm text-gray-500 mt-1 max-w-[200px]">Leave this space for the final product image.</p>
                    </div>
                  </div>
                </FadeUp>
              </div>
            </div>

            {/* Stats — flat, bottom */}
            <FadeUp delay={0.6}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-24 pt-8 border-t border-gray-200/60 max-w-4xl mx-auto">
                {[
                  { val: "₹50Cr+",   label: "Disbursed" },
                  { val: "10,000+",  label: "Happy Customers" },
                  { val: "24 hrs",   label: "Approval Time" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{s.val}</p>
                    <p className="text-gray-500 text-sm mt-1.5 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            2. WHY ADISHRI?
        ════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <FadeUp>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Why Adishri?</h2>
                <p className="text-gray-500 text-base">Built for modern India — fast, transparent, and completely digital.</p>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {WHY_US.map((f, i) => {
                const Icon = f.icon;
                return (
                  <FadeUp key={f.title} delay={i * 0.1}>
                    <div className="group bg-white rounded-3xl border border-slate-200/80 p-8 pt-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(30,41,59,0.1)] hover:border-slate-400 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col relative overflow-hidden ring-1 ring-slate-900/5">
                      {/* background gradient effect */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110" />
                      
                      {/* Professional Icon Style */}
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-700 flex items-center justify-center mb-8 shadow-md shadow-slate-200">
                        <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      
                      <h3 className="font-extrabold text-gray-900 text-xl mb-3 tracking-tight group-hover:text-blue-600 transition-colors">{f.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            3. LOANS FOR EVERY NEED
        ════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <FadeUp>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Loans for every need</h2>
                <p className="text-gray-500 text-base">Pick the product that fits — clear terms, instant eligibility.</p>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {LOAN_TYPES.map((loan, i) => {
                const Icon = loan.icon;
                return (
                  <FadeUp key={loan.title} delay={i * 0.1}>
                    <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full relative cursor-pointer ring-1 ring-slate-900/5">
                      {/* Professional Top Accent */}
                      <div className={`h-1.5 w-full shrink-0 transition-colors duration-500 ${
                        loan.theme === "blue" ? "bg-blue-600 group-hover:bg-blue-500" :
                        loan.theme === "slate" ? "bg-slate-800 group-hover:bg-slate-700" :
                        "bg-indigo-600 group-hover:bg-indigo-500"
                      }`} />

                      <div className="p-8 flex flex-col flex-1 relative z-10">
                        {/* Icon */}
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-white shadow-sm transition-all duration-300 group-hover:scale-105 ${
                            loan.theme === "blue" ? "bg-blue-50 text-blue-600" :
                            loan.theme === "slate" ? "bg-slate-50 text-slate-800" :
                            "bg-indigo-50 text-indigo-600"
                          }`}
                        >
                          <Icon className="w-6 h-6" strokeWidth={2.5} />
                        </div>

                        {/* Title + desc */}
                        <h3 className="font-bold text-gray-900 text-xl mb-2">{loan.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-5">{loan.desc}</p>

                        {/* Divider */}
                        <div className="border-t border-gray-100 mb-5" />

                        {/* Detail rows */}
                        <div className="space-y-2.5 flex-1">
                          {[
                            { label: "Amount", val: loan.amount },
                            { label: "Tenure", val: loan.tenure },
                            { label: "Rate",   val: loan.rate },
                          ].map((row) => (
                            <div key={row.label} className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">{row.label}</span>
                              <span className="font-bold text-gray-900 text-sm">{row.val}</span>
                            </div>
                          ))}
                        </div>

                        {/* Apply link */}
                        <div className="mt-8 pt-5 border-t border-gray-50 flex items-center justify-between group-hover:text-blue-600 transition-colors">
                          <Link
                            to={ROUTES.LOAN_APPLICATION}
                            className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors"
                          >
                            Apply for {loan.title.split(" ")[0]}
                          </Link>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            loan.theme === "blue" ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" :
                            loan.theme === "slate" ? "bg-slate-50 text-slate-800 group-hover:bg-slate-800 group-hover:text-white" :
                            "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                          }`}>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            4. HOW IT WORKS
        ════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <FadeUp>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">How it works</h2>
                <p className="text-gray-500 text-base">From application to bank account — in four simple steps.</p>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <FadeUp key={step.num} delay={i * 0.1}>
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-md transition-shadow relative h-full">
                      {/* Number badge — top right */}
                      <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
                        <span className="text-white text-xs font-black">{step.num}</span>
                      </div>

                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>

                      <h3 className="font-bold text-gray-900 text-lg mb-1.5">{step.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            5. INTEREST RATES & CHARGES
        ════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <FadeUp>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Interest rates &amp; charges</h2>
                <p className="text-gray-500 text-base">No fine print. Here's exactly what you'll pay.</p>
              </FadeUp>
            </div>

            <FadeUp delay={0.2}>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden ring-1 ring-slate-900/5 transition-all hover:shadow-xl hover:shadow-slate-900/5">
                {/* Table header */}
                <div className="hidden sm:grid grid-cols-4 border-b border-gray-100">
                  {["PRODUCT", "INTEREST RATE", "PROCESSING FEE", "FORECLOSURE"].map((h) => (
                    <div key={h} className="px-6 py-4 text-[11px] font-bold text-gray-400 tracking-widest uppercase">
                      {h}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                <div className="divide-y divide-gray-50">
                  {RATES.map((row, i) => (
                    <div key={i} className="hover:bg-blue-50/40 transition-colors">
                      {/* Desktop */}
                      <div className="hidden sm:grid grid-cols-4">
                        <div className="px-6 py-5 font-bold text-gray-900 text-sm">{row.product}</div>
                        <div className="px-6 py-5 text-gray-600 text-sm">{row.rate}</div>
                        <div className="px-6 py-5 text-gray-600 text-sm">{row.fee}</div>
                        <div className="px-6 py-5 text-gray-600 text-sm">{row.closure}</div>
                      </div>
                      {/* Mobile */}
                      <div className="sm:hidden px-5 py-5 space-y-2">
                        <p className="font-bold text-gray-900">{row.product}</p>
                        <div className="grid grid-cols-2 gap-y-1 text-sm">
                          <span className="text-gray-400 text-xs">Interest Rate</span>
                          <span className="text-gray-700 font-medium text-xs">{row.rate}</span>
                          <span className="text-gray-400 text-xs">Processing Fee</span>
                          <span className="text-gray-700 font-medium text-xs">{row.fee}</span>
                          <span className="text-gray-400 text-xs">Foreclosure</span>
                          <span className="text-gray-700 font-medium text-xs">{row.closure}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
            <p className="text-center text-xs text-gray-400 mt-3">* Final rate determined at time of approval by admin.</p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            6. TESTIMONIALS
        ════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <FadeUp>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Loved across India</h2>
                <p className="text-gray-500 text-base">Real stories from customers who chose Adishri.</p>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <FadeUp key={t.name} delay={i * 0.1}>
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-500 h-full ring-1 ring-slate-900/5 hover:-translate-y-1">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                    {/* Author */}
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.city}</p>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            7. BOTTOM CTA
        ════════════════════════════════════════════════════════ */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-700 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <FadeUp>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to get started?</h2>
              <p className="text-blue-100 text-base mb-10 max-w-md mx-auto leading-relaxed">
                Join thousands of satisfied customers who chose Adishri Capitals for their financial journey.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={ROUTES.LOAN_APPLICATION}
                  className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl text-base hover:bg-blue-50 transition-all shadow-lg"
                >
                  Apply for a Loan <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  to={ROUTES.USER_DASHBOARD}
                  className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl text-base hover:bg-white/25 transition-all"
                >
                  Track Application
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
