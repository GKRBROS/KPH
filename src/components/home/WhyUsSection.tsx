import { Store, Tag, Briefcase, MapPin, ArrowUpRight } from "lucide-react";

const WhyUsSection = () => {
  const services = [
    {
      id: "01",
      icon: Store,
      title: "Wholesale Dealer",
      description: "We are the only wholesale paint dealer in the Kuttanad region, serving both individual homeowners and professional contractors.",
      highlight: false,
    },
    {
      id: "02",
      icon: Tag,
      title: "Unbeatable Prices",
      description: "Enjoy discounts ranging from 10% to 30% on cash purchases. We offer the lowest prices on premium branded paints.",
      highlight: true,
    },
    {
      id: "03",
      icon: Briefcase,
      title: "Transparent Pricing",
      description: "Fair and open pricing models, including JSW Paint's innovative 'Any Colour One Price' strategy.",
      highlight: false,
    },
    {
      id: "04",
      icon: MapPin,
      title: "Strategic Location",
      description: "Easily accessible at St. George Shopping Complex and Kalangara Towers, Edathua. Central access for all of Kuttanad.",
      highlight: false,
    }
  ];

  return (
    <section id="why-us" className="py-20 relative overflow-hidden bg-[#0a0a0a] text-white">
      {/* Creative Background: Architectural Grid & Spotlights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* Left Side: Sticky Creative Header */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8 pt-8">
            <div className="inline-block relative">
              <span className="text-8xl font-black text-white/5 absolute -top-12 -left-8 select-none">WHY</span>
              <h2 className="relative font-heading text-5xl md:text-6xl font-black leading-none tracking-tighter">
                WHY CHOOSE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">KALANGARA?</span>
              </h2>
            </div>

            <p className="text-lg text-slate-400 font-light leading-relaxed border-l-2 border-indigo-500/30 pl-6">
              Use our "Home Delivery" service to order premium paints from home, or visit us for expert advice. We combine wholesale pricing with world-class service.
            </p>

            <div className="flex gap-4 pt-4">
              <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/50 to-transparent self-center"></div>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">ESTABLISHED</span>
            </div>
          </div>

          {/* Right Side: Masonry/Staggered Grid */}
          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`group relative min-h-[320px] p-8 flex flex-col justify-between border transition-all duration-500 hover:-translate-y-2
                    ${index % 2 !== 0 ? 'md:translate-y-16' : ''} /* Stagger Effect */
                    ${service.highlight
                      ? 'bg-white text-slate-950 border-white shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)]'
                      : 'bg-white/5 border-white/10 hover:border-indigo-400/50 hover:bg-white/10'
                    }
                  `}
                >
                  {/* Large Background Number */}
                  <span className={`absolute top-4 right-6 text-8xl font-black opacity-10 leading-none select-none transition-all duration-700 group-hover:scale-110 group-hover:opacity-20 
                    ${service.highlight ? 'text-slate-900' : 'text-white'}`}>
                    {service.id}
                  </span>

                  {/* Icon & Connector */}
                  <div className="relative mb-8">
                    <div className={`w-14 h-14 flex items-center justify-center text-xl font-bold border-2 transition-all duration-300
                       ${service.highlight
                        ? 'border-slate-900 text-slate-900'
                        : 'border-white/20 text-white group-hover:border-indigo-400 group-hover:text-indigo-400'
                      }
                    `}>
                      <service.icon strokeWidth={1.5} className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className={`text-2xl font-bold font-heading mb-3 uppercase tracking-wider
                      ${service.highlight ? 'text-slate-900' : 'text-white group-hover:text-indigo-300'}
                    `}>
                      {service.title}
                    </h3>
                    <p className={`text-sm leading-relaxed font-light
                      ${service.highlight ? 'text-slate-600' : 'text-slate-400'}
                    `}>
                      {service.description}
                    </p>
                  </div>

                  {/* Interactive Corner Arrow */}
                  <div className={`absolute bottom-6 right-6 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1
                    ${service.highlight ? 'text-slate-900' : 'text-white/30 group-hover:text-white'}
                  `}>
                    <ArrowUpRight className="w-5 h-5" />
                  </div>

                  {/* Decorative Lines */}
                  {!service.highlight && (
                    <>
                      <div className="absolute top-0 left-0 w-8 h-[1px] bg-white/20 group-hover:bg-indigo-400 transition-colors" />
                      <div className="absolute top-0 left-0 w-[1px] h-8 bg-white/20 group-hover:bg-indigo-400 transition-colors" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Flow Graphic */}
        <div className="mt-32 border-t border-white/5 pt-8 flex justify-between items-end opacity-50">
          <div className="text-[10px] uppercase text-slate-600 tracking-widest max-w-[200px]">
            We sell protection for your home.
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-indigo-500/50 rounded-full" />
            <div className="w-2 h-2 bg-indigo-500/20 rounded-full" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyUsSection;
