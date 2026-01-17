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
    <section id="hero" className="relative lg:min-h-[85vh] min-h-[600px] flex flex-col justify-between overflow-hidden bg-white">

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1920&auto=format&fit=crop"
          srcSet="
            https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=640&auto=format&fit=crop 640w,
            https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1024&auto=format&fit=crop 1024w,
            https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1920&auto=format&fit=crop 1920w
          "
          sizes="100vw"
          alt="Premium Dark Interior Finish"
          className="w-full h-full object-cover scale-105"
          fetchPriority="high"
          decoding="sync"
          width="1920"
          height="1080"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="container mx-auto px-4 relative z-30 flex-grow flex items-center pt-24 pb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 w-full">

          {/* LEFT CONTENT: Simple & Catchy */}
          <div className="w-full lg:w-[60%] space-y-10 animate-fade-in text-center lg:text-left">
            <div className="space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 border-l-4 border-primary bg-white/10 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-[0.3em] shadow-2xl">
                <Sparkles className="w-4 h-4 text-primary" />
                St. George Complex
              </div>

              {/* Catchy Main Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-heading font-extrabold leading-[0.9] tracking-tighter text-white uppercase">
                THE PAINT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary">HOUSE</span>
              </h1>

              {/* Simple, True Subtext */}
              <p className="font-medium text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed mx-auto lg:mx-0 border-l-2 border-primary/50 pl-6">
                The <span className="text-white font-bold">only wholesale paint dealer</span> in Kuttanad. <br />
                We offer <span className="text-white font-bold">10-30% discounts</span> on premium brands like Asian Paints, Berger, and JSW.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a href="tel:04772212444" className="inline-flex items-center justify-center bg-primary text-white hover:bg-white hover:text-black font-black px-10 py-7 text-xs rounded-none transition-all duration-300 w-full sm:w-auto uppercase tracking-widest border border-primary">
                Call For Best Price
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a href="#brands" onClick={(e) => { e.preventDefault(); document.querySelector('.animate-marquee')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className="inline-flex items-center justify-center border border-white/30 text-white hover:bg-white hover:text-black font-black px-10 py-7 text-xs rounded-none transition-all duration-300 w-full sm:w-auto bg-transparent uppercase tracking-widest cursor-pointer">
                Our Brands
              </a>
            </div>

            {/* Key Facts (Correct Details) */}
            <div className="pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-12 border-t border-white/10 mt-8">
              {[
                { label: "Legacy", value: "EXCELLENCE" },
                { label: "Discount", value: "UP TO 30%" },
                { label: "Warranty", value: "10 YEAR" }
              ].map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center lg:items-start group cursor-default">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    {badge.label}
                  </span>
                  <span className="text-2xl font-black text-white tracking-tighter shadow-black drop-shadow-lg">
                    {badge.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT: Contact Form */}
          <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-end relative">
            {/* Decorative glow behind form */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-40 animate-pulse hidden lg:block" />
            <div className="relative z-10 w-full max-w-md">
              <QuickContactForm />
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR: Value Props */}
      <div className="relative z-30 bg-black/90 backdrop-blur-sm py-6 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center lg:justify-between items-center gap-8">
            <div className="text-primary font-black text-[10px] uppercase tracking-[0.4em] hidden lg:block">
              Why Choose KPH?
            </div>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
              {[
                { icon: UserCheck, text: "Authorized Dealer" },
                { icon: ShieldCheck, text: "Single Price Any Color" },
                { icon: Percent, text: "Lowest Price Guarantee" },
                { icon: PaintBucket, text: "Expert Consultation" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <a href="#about" className="text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-primary transition-colors">
              Read Our Story <ChevronRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

    </section >
  );
};

export default HeroSection;
