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
    color: "#E66325" // Orange
  },
  {
    icon: ShieldCheck,
    title: "100% Secure",
    desc: "Bank-grade encryption and RBI-registered NBFC. Your data never leaves India.",
    color: "#2DAAA5" // Teal
  },
  {
    icon: IndianRupee,
    title: "Transparent Pricing",
    desc: "No hidden fees. See your full EMI, interest, and charges upfront before you accept.",
    color: "#7130A6" // Purple
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
    theme: "#0085D0", // Mid Blue
  },
  {
    icon: Clock,
    title: "Short-Term Loan",
    desc: "Cover urgent cash needs with flexible repayment.",
    amount: "₹5,000 – ₹1,00,000",
    tenure: "3 – 12 months",
    rate: "From 14% p.a.",
    theme: "#2DAAA5", // Teal
  },
  {
    icon: Briefcase,
    title: "Business Micro Loan",
    desc: "Grow your shop, inventory or working capital.",
    amount: "₹50,000 – ₹5,00,000",
    tenure: "12 – 48 months",
    rate: "From 15% p.a.",
    theme: "#E66325", // Orange
  },
];

const STEPS = [
  { num: 1, icon: FileCheck2, title: "Apply Online", desc: "Fill our 5-step form in under 5 minutes", color: "#7130A6" },
  { num: 2, icon: ShieldCheck, title: "KYC Verification", desc: "Upload Aadhaar, PAN & income proof", color: "#0085D0" },
  { num: 3, icon: CreditCard, title: "Get Approved", desc: "Receive sanction letter within 24 hours", color: "#E66325" },
  { num: 4, icon: Wallet, title: "Money in Account", desc: "Funds disbursed to your bank instantly", color: "#2DAAA5" },
];

const RATES = [
  { product: "Personal Loan", rate: "12.5% – 24% p.a.", fee: "2% (min ₹499)", closure: "3% on outstanding" },
  { product: "Short-Term Loan", rate: "14% – 28% p.a.", fee: "2.5% (min ₹299)", closure: "Nil after 3 EMIs" },
  { product: "Business Micro Loan", rate: "15% – 22% p.a.", fee: "1.5% (min ₹999)", closure: "4% on outstanding" },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", city: "Mumbai", stars: 5, text: "Got ₹50,000 credited within 2 days! Super simple and transparent process." },
  { name: "Ramesh Patel", city: "Ahmedabad", stars: 5, text: "Saved my business during an emergency. Highly recommend Adishri Capitals!" },
  { name: "Anjali Verma", city: "Delhi", stars: 5, text: "No hidden charges, fair rates. The tracking dashboard is very helpful." },
];

/* ─────────────────────────────────────────────────────────────── */
/*  Page                                                            */
/* ─────────────────────────────────────────────────────────────── */

export function Home() {
  return (
    <MainLayout>
      <div className="overflow-hidden bg-[#FBFBFB] font-sans">

        {/* ════════════════════════════════════════════════════════
            1. HERO
        ════════════════════════════════════════════════════════ */}
        <section className="relative pt-24 pb-28 sm:pt-32 sm:pb-36 overflow-hidden bg-white">
          {/* Subtle Dynamic Geometric DMI Style Animation */}
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-bl-full bg-[#FAFAFC] pointer-events-none transform -translate-y-1/4 translate-x-1/4 scale-150" />
          <div className="absolute top-20 -left-20 w-[400px] h-[400px] border border-[#F2F2F5] rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute top-40 -left-10 w-[300px] h-[300px] border border-[#F2F2F5] rounded-full animate-[spin_40s_linear_infinite_reverse]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#102777]/5 to-[#2DAAA5]/5 blur-3xl pointer-events-none mix-blend-multiply" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center text-center lg:text-left mb-16 lg:mb-24">
              
              {/* Left Column: Text & CTAs */}
              <div className="flex flex-col items-center lg:items-start max-w-2xl mx-auto lg:mx-0">
                {/* Trust pill */}
                <FadeUp delay={0.1}>
                  <div className="inline-flex items-center gap-2 text-[#102777] bg-white border border-[#E2E8F0] text-xs sm:text-sm font-bold px-6 py-2.5 rounded-full mb-8 shadow-sm tracking-wide">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-[#2DAAA5]" />
                    RBI-Registered NBFC
                  </div>
                </FadeUp>

                {/* Headline - DMI Style distinct Navy Blue */}
                <FadeUp delay={0.2}>
                  <h1 className="text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-extrabold text-[#102777] leading-[1.1] mb-6 tracking-tight">
                    Powering your <br/>
                    <span className="text-[#E66325] block mt-2">next big step.</span>
                  </h1>
                </FadeUp>

                <FadeUp delay={0.3}>
                  <p className="text-slate-600 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 font-normal">
                    Personal, short-term and business micro loans up to ₹5,00,000. 100% Digital, instant approval, and no hidden fees.
                  </p>
                </FadeUp>

                {/* CTAs */}
                <FadeUp delay={0.4}>
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start">
                    <Link
                      to={ROUTES.LOAN_APPLICATION}
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#E66325] hover:bg-[#D4541B] active:scale-95 text-white font-bold px-8 py-4 rounded-full text-base transition-all duration-300 shadow-lg shadow-[#E66325]/30 group"
                    >
                      Apply Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    <Link
                      to={ROUTES.USER_DASHBOARD}
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-white border-2 border-[#102777] hover:bg-[#102777] hover:text-white text-[#102777] font-bold px-8 py-4 rounded-full text-base transition-all duration-300 shadow-sm"
                    >
                      Track Application
                    </Link>
                  </div>
                </FadeUp>
              </div>

              {/* Right Column: Hero Visual - Image Placeholder */}
              <div className="w-full relative hidden sm:flex items-center justify-center">
                <FadeUp delay={0.5} className="w-full">
                  <div className="relative w-full aspect-square lg:aspect-[4/3] flex flex-col items-center justify-center border-2 border-dashed border-[#102777]/30 bg-[#102777]/5 rounded-[2.5rem] mt-8 lg:mt-0 transition-colors hover:bg-[#102777]/10">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm text-[#102777]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </div>
                    <p className="text-[#102777] font-semibold">Your Image Here</p>
                    <p className="text-slate-500 text-sm mt-1">Leave space for responsive image (e.g., `<img />`)</p>
                  </div>
                </FadeUp>
              </div>
            </div>

            {/* Stats */}
            <FadeUp delay={0.6}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-slate-200/60 max-w-4xl mx-auto">
                {[
                  { val: "₹500Cr+",  label: "Disbursed So Far" },
                  { val: "AUM",  label: "Strong Market Trust" },
                  { val: "Pan-India", label: "Seamless Reach" },
                ].map((s) => (
                  <div key={s.label} className="text-center sm:text-left bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-3xl font-black text-[#102777] tracking-tight">{s.val}</p>
                    <p className="text-slate-500 text-sm mt-2 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            2. WHY ADISHRI?
        ════════════════════════════════════════════════════════ */}
        <section className="py-24 sm:py-32 bg-[#FBFBFB] relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <FadeUp>
                <div className="inline-block px-4 py-1.5 rounded-full bg-[#102777]/5 text-[#102777] text-sm font-bold mb-4 tracking-wider uppercase">
                  Our Edge
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-[#102777] mb-4 tracking-tight">Experience Excellence</h2>
                <p className="text-slate-600 text-lg leading-relaxed">Technology-first lending designed to give you clarity and speed.</p>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {WHY_US.map((f, i) => {
                const Icon = f.icon;
                return (
                  <FadeUp key={f.title} delay={i * 0.1}>
                    <div className="group bg-white rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col relative overflow-hidden">
                      {/* Geometric DMI accent line */}
                      <div className="absolute top-0 left-0 w-full h-1.5 transition-colors duration-500" style={{ backgroundColor: f.color }} />
                      
                      <div className="relative w-16 h-16 rounded-2xl mb-8 flex items-center justify-center transition-transform duration-500 group-hover:scale-110" 
                           style={{ backgroundColor: `${f.color}15`, color: f.color }}>
                        <Icon className="w-8 h-8" strokeWidth={2.5} />
                      </div>
                      
                      <h3 className="font-extrabold text-[#102777] text-2xl mb-4 tracking-tight">{f.title}</h3>
                      <p className="text-slate-600 text-base leading-relaxed">{f.desc}</p>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            3. LOANS FOR EVERY NEED (Dark Brand Block)
        ════════════════════════════════════════════════════════ */}
        <section className="py-24 sm:py-32 bg-[#102777] relative overflow-hidden">
          {/* Subtle geometric circles matching DMI aesthetic */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] border-[40px] border-white/[0.03] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] border-[40px] border-white/[0.02] rounded-full pointer-events-none transform -translate-x-1/2 translate-y-1/2" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <FadeUp>
                <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-bold mb-4 tracking-wider uppercase backdrop-blur-sm">
                  Products
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">Tailored tailored for you</h2>
                <p className="text-white/80 text-lg leading-relaxed">Choose the product that matches your objective, perfectly.</p>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {LOAN_TYPES.map((loan, i) => {
                const Icon = loan.icon;
                return (
                  <FadeUp key={loan.title} delay={i * 0.1}>
                    <div className="group bg-white rounded-[2rem] shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col h-full relative cursor-pointer border-b-[6px]" style={{ borderColor: loan.theme }}>
                      
                      <div className="p-8 sm:p-10 flex flex-col flex-1 relative z-10">
                        {/* Icon */}
                        <div className="flex items-center justify-between mb-8">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}
                               style={{ backgroundColor: `${loan.theme}15`, color: loan.theme }}>
                            <Icon className="w-7 h-7" strokeWidth={2.5} />
                          </div>
                          <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors duration-300"
                               style={{ backgroundColor: 'transparent' }}
                               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = loan.theme}
                               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                          </div>
                        </div>

                        {/* Title + desc */}
                        <h3 className="font-extrabold text-[#102777] text-2xl mb-3">{loan.title}</h3>
                        <p className="text-slate-600 text-base leading-relaxed mb-8">{loan.desc}</p>

                        {/* Detail rows */}
                        <div className="space-y-4 flex-1 bg-[#FBFBFB] rounded-2xl p-6 border border-slate-100">
                          {[
                            { label: "Amount", val: loan.amount },
                            { label: "Tenure", val: loan.tenure },
                            { label: "Rate",   val: loan.rate },
                          ].map((row) => (
                            <div key={row.label} className="flex justify-between items-center">
                              <span className="text-slate-500 text-sm font-semibold">{row.label}</span>
                              <span className="font-black text-[#102777] text-sm">{row.val}</span>
                            </div>
                          ))}
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
        <section className="py-24 sm:py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <FadeUp>
                <div className="inline-block px-4 py-1.5 rounded-full bg-[#102777]/5 text-[#102777] text-sm font-bold mb-4 tracking-wider uppercase">
                  Simple Process
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-[#102777] mb-6 tracking-tight">Four steps to funds</h2>
                <p className="text-slate-600 text-lg leading-relaxed">End-to-end digital journey. Fast and friction-free.</p>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <FadeUp key={step.num} delay={i * 0.1}>
                    <div className="group bg-white rounded-3xl border border-[#F2F2F5] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative h-full flex flex-col items-center text-center">
                      
                      {/* Number badge */}
                      <div className="w-12 h-12 rounded-full font-black flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm relative z-10"
                           style={{ backgroundColor: step.color, color: 'white' }}>
                        {step.num}
                      </div>

                      {/* Icon */}
                      <div className="mb-6 transition-transform duration-500 group-hover:scale-110 relative z-10"
                           style={{ color: step.color }}>
                        <Icon className="w-10 h-10" strokeWidth={2} />
                      </div>

                      <h3 className="font-bold text-[#102777] text-xl mb-3 relative z-10">{step.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed relative z-10">{step.desc}</p>
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
        <section className="py-24 sm:py-32 bg-[#FBFBFB] relative overflow-hidden border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <FadeUp>
                <div className="inline-block px-4 py-1.5 rounded-full bg-[#102777]/5 text-[#102777] text-sm font-bold mb-4 tracking-wider uppercase">
                  Transparent Pricing
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-[#102777] mb-6 tracking-tight">Fair and open terms</h2>
                <p className="text-slate-600 text-lg leading-relaxed">We keep it straightforward. See exactly what you'll pay.</p>
              </FadeUp>
            </div>

            <FadeUp delay={0.2}>
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-lg overflow-hidden relative">
                {/* Accent top border */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#102777] via-[#2DAAA5] to-[#E66325]" />
                
                {/* Table header */}
                <div className="hidden sm:grid grid-cols-4 border-b border-slate-100 bg-[#FAFAFC] pt-6">
                  {["Product", "Interest Rate (p.a.)", "Processing Fee", "Foreclosure"].map((h) => (
                    <div key={h} className="px-8 py-5 text-xs font-bold text-slate-500 tracking-widest uppercase">
                      {h}
                    </div>
                  ))}
                </div>

                {/* Rows */}
                <div className="divide-y divide-slate-100">
                  {RATES.map((row, i) => (
                    <div key={i} className="hover:bg-slate-50/50 transition-colors duration-300">
                      {/* Desktop */}
                      <div className="hidden sm:grid grid-cols-4 items-center">
                        <div className="px-8 py-6 font-extrabold text-[#102777]">{row.product}</div>
                        <div className="px-8 py-6 text-slate-700 font-semibold">{row.rate}</div>
                        <div className="px-8 py-6 text-slate-700 font-semibold">{row.fee}</div>
                        <div className="px-8 py-6 text-slate-700 font-semibold">{row.closure}</div>
                      </div>
                      {/* Mobile */}
                      <div className="sm:hidden px-6 py-6 space-y-3">
                        <p className="font-extrabold text-[#102777] text-lg border-b border-slate-100 pb-2">{row.product}</p>
                        <div className="grid grid-cols-2 gap-y-3 text-sm">
                          <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Interest Rate</span>
                          <span className="text-slate-800 font-semibold">{row.rate}</span>
                          <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Processing Fee</span>
                          <span className="text-slate-800 font-semibold">{row.fee}</span>
                          <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Foreclosure</span>
                          <span className="text-slate-800 font-semibold">{row.closure}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
            <p className="text-center text-xs font-semibold text-slate-500 mt-6 uppercase tracking-wider">* Final rates determined upon formal approval.</p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════
            6. TESTIMONIALS
        ════════════════════════════════════════════════════════ */}
        <section className="py-24 sm:py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <FadeUp>
                <div className="inline-block px-4 py-1.5 rounded-full bg-[#E66325]/10 text-[#E66325] text-sm font-bold mb-4 tracking-wider uppercase">
                  Testimonials
                </div>
                <h2 className="text-4xl sm:text-5xl font-black text-[#102777] mb-6 tracking-tight">Trusted across India</h2>
                <p className="text-slate-600 text-lg leading-relaxed">Don't just take our word for it. Here is what they say.</p>
              </FadeUp>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <FadeUp key={t.name} delay={i * 0.1}>
                  <div className="bg-[#FBFBFB] rounded-3xl border border-slate-100 p-10 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-[#E66325] opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Stars */}
                    <div className="flex gap-1.5 mb-6 relative z-10">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 text-base leading-relaxed mb-8 italic font-medium">"{t.text}"</p>
                    
                    {/* Author */}
                    <div className="flex items-center gap-4 mt-auto relative z-10">
                      <div className="w-12 h-12 rounded-full bg-[#102777] flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-extrabold text-[#102777] text-base">{t.name}</p>
                        <p className="text-sm font-semibold text-slate-500">{t.city}</p>
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
        <section className="py-24 sm:py-32 px-6 bg-[#FBFBFB]">
          <div className="max-w-6xl mx-auto">
            <div className="bg-[#102777] rounded-[3rem] p-12 sm:p-24 text-center relative overflow-hidden shadow-2xl">
              {/* Geometric floating forms */}
              <div className="absolute top-0 right-0 w-[400px] h-[400px] border-[50px] border-[#2DAAA5]/10 rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#E66325] rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 opacity-30" />
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <FadeUp>
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-8 tracking-tight leading-[1.1]">
                    Ready to launch your <br /> <span className="text-[#E66325]">next big idea?</span>
                  </h2>
                  <p className="text-white/80 text-lg sm:text-xl mb-12 leading-relaxed">
                    Choose Adishri Capitals. Apply entirely online to secure funding today.
                  </p>
                </FadeUp>
                <FadeUp delay={0.2}>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                      to={ROUTES.LOAN_APPLICATION}
                      className="inline-flex items-center gap-3 bg-[#E66325] text-white font-extrabold px-10 py-5 rounded-full text-lg hover:bg-[#D4541B] transition-all duration-300 shadow-xl shadow-[#E66325]/20 active:scale-95 group"
                    >
                      Apply Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                    <Link
                      to={ROUTES.USER_DASHBOARD}
                      className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md text-white font-bold px-10 py-5 rounded-full text-lg hover:bg-white/20 transition-all duration-300 border border-white/10"
                    >
                      Track Progress
                    </Link>
                  </div>
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
