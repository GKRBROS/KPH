import { Button } from "@/components/ui/button";
import QuickContactForm from "./QuickContactForm";
import {
  ShieldCheck,
  Sparkles,
  UserCheck,
  PaintBucket,
  ArrowRight,
  ChevronRight,
  Percent
} from "lucide-react";

const HeroSection = () => {
  return (
    <section id="hero" className="relative lg:min-h-[85vh] min-h-[500px] flex flex-col justify-between overflow-hidden bg-white">

      <div className="absolute inset-0 z-0">
        {/* Background Image with Royal Gradient Overlay */}
        {/* Background Image with Royal Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100/90 via-purple-50/80 to-slate-100/40 z-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-purple-100/30 via-transparent to-transparent z-10" />
        <img
          src="/images/hero-img.png"
          alt="Kalangara Paint House Hero"
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="sync"
          width="1920"
          height="1080"
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="container mx-auto px-4 relative z-30 flex-grow flex items-center pt-24 pb-8 lg:pt-28 lg:pb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 w-full">

          {/* LEFT CONTENT: Simple & Catchy */}
          <div className="w-full lg:w-[60%] space-y-8 animate-fade-in text-center lg:text-left pt-4 lg:pt-0">
            <div className="space-y-6 relative z-20">
              {/* Badge removed as per user request */}

              {/* High-Contrast Architectural Headline */}
              <h1 className="flex flex-col text-[10vw] sm:text-6xl lg:text-7xl font-serif font-black leading-[0.9] tracking-tighter text-black uppercase">
                <span className="tracking-tight">THE PAINT</span>
                <span className="text-violet-700 w-fit mx-auto lg:mx-0 pb-2">
                  HOUSE
                </span>
              </h1>

              {/* Minimalist Editorial Description */}
              <div className="max-w-lg mt-6 mx-auto lg:mx-0">
                <p className="font-sans text-sm sm:text-base lg:text-lg text-slate-600 leading-[1.8] font-light">
                  The <span className="text-black font-medium">only wholesale paint dealer</span> in Kuttanad. <br className="hidden sm:block" />
                  We offer <span className="text-violet-700 font-medium decoration-violet-200 underline-offset-4 underline decoration-1">10-30% cash purchase discounts</span> on premium brands like Asian Paints, Berger, and JSW...
                </p>
              </div>
            </div>

            {/* Architectural Modern Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4 pt-4 w-full px-2 sm:px-0">
              <a
                href="#services"
                onClick={(e) => { e.preventDefault(); document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="group relative px-6 py-4 bg-violet-700 hover:bg-violet-800 text-white font-bold text-xs uppercase tracking-[0.15em] transition-all duration-300 rounded-lg flex items-center justify-center gap-3 shadow-lg shadow-violet-200 overflow-hidden"
              >
                <span className="relative z-10">Our Services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-violet-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>

              <a
                href="#brands"
                onClick={(e) => { e.preventDefault(); document.querySelector('.animate-marquee')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
                className="group relative px-6 py-4 bg-white text-slate-900 border border-slate-200 hover:border-violet-200 font-bold text-xs uppercase tracking-[0.15em] hover:bg-slate-50 transition-all duration-300 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <span>View Brands</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
              </a>
            </div>

            {/* Horizontal Divider Stats */}
            <div className="pt-6 w-full border-t border-slate-200/60 mt-4">
              <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 items-center">
                {[
                  { label: "Legacy", value: "25 Years" },
                  { label: "Discount", value: "30% Off" },
                  { label: "Warranty", value: "10 Years" }
                ].map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="h-6 w-[2px] bg-slate-200"></div>
                    <div className="text-left">
                      <div className="text-[8px] font-bold uppercase tracking-wider text-slate-400">{badge.label}</div>
                      <div className="text-base font-black text-slate-900 leading-none mt-0.5">{badge.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT: Contact Form */}
          <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-end relative mt-8 lg:mt-0">
            {/* Decorative glow behind form */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-40 animate-pulse hidden lg:block" />
            <div className="relative z-10 w-full max-w-[90vw] sm:max-w-md">
              <QuickContactForm />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar removed as per user request */}

    </section >
  );
};

export default HeroSection;
