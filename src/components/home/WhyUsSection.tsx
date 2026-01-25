import { Store, Tag, Briefcase, MapPin, ArrowUpRight, ShieldCheck } from "lucide-react";

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
    <section id="why-us" className="py-20 bg-[#Fdfdfd] relative overflow-hidden">
      {/* Royal Light Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bf from-purple-50/40 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-50/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* Left Side: Sticky Creative Header - Light Theme */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8 pt-8">
            <div className="inline-block relative">
              <span className="text-9xl font-black text-slate-100 absolute -top-16 -left-10 select-none -z-10">WHY</span>
              <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-heading font-normal text-foreground tracking-tighter uppercase leading-[0.9]">
                WHY CHOOSE <br />
                <span className="text-primary font-serif">KALANGARA?</span>
              </h2>
            </div>

            <p className="text-lg text-slate-600 font-medium leading-relaxed border-l-4 border-purple-200 pl-6 max-w-sm">
              Use our "Home Delivery" service to order premium paints from home, or visit us for expert advice. We combine wholesale pricing with world-class service.
            </p>

            <div className="flex gap-4 pt-6 items-center">
              <div className="h-[2px] w-12 bg-purple-600"></div>
              <span className="text-xs uppercase tracking-[0.3em] text-purple-800 font-bold">ESTABLISHED EXCELLENCE</span>
            </div>
          </div>

          {/* Right Side: Architectural Grid */}
          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group relative bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full min-h-[280px] overflow-hidden"
                >
                  {/* Subtly Textured Background Image */}
                  <div className="absolute inset-0 opacity-[0.4] pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] group-hover:opacity-[0.6] transition-opacity duration-500" />

                  {/* Hover Border Accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />

                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="w-16 h-16 bg-purple-50/80 backdrop-blur-sm rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm border border-purple-100/50">
                      <service.icon strokeWidth={1.5} className="w-8 h-8" />
                    </div>
                    <span className="text-4xl font-serif font-black text-slate-100 group-hover:text-purple-100 transition-colors select-none">
                      {service.id}
                    </span>
                  </div>

                  <div className="space-y-3 relative z-10">
                    <h3 className="text-xl font-bold font-heading uppercase tracking-wide text-slate-900 group-hover:text-purple-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Bottom Decoration */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
                    <ArrowUpRight className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Flow Graphic - Light Theme */}
        <div className="mt-24 border-t border-slate-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="flex items-center gap-5 group cursor-default">
            <div className="p-4 bg-white rounded-full border border-slate-100 shadow-md group-hover:shadow-lg group-hover:border-purple-200 transition-all duration-500">
              <ShieldCheck className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400 font-black mb-1">Our Promise</span>
              <span className="font-heading font-bold text-2xl tracking-tight text-slate-800 group-hover:text-purple-700 transition-colors duration-300 text-center md:text-left">
                We sell protection for your home.
              </span>
            </div>
          </div>

          <div className="flex gap-2 opacity-60">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <div className="w-2 h-2 bg-purple-200 rounded-full" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyUsSection;
