import { Droplets, Shield, Palette, Award, Building2, Users, History, Store } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: History,
      title: "23+ Years Legacy",
      description: "Founded by Tomychen Kalangara, growing from a modest shop to a state-of-the-art studio.",
    },
    {
      icon: Store,
      title: "Modern Studio",
      description: "Initially renovated in August 2022, with a major modernization in May 2025 to keep up with technology.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Deeply rooted in Edathua's culture, we are a respected part of the local community fabric.",
    },
    {
      icon: Shield,
      title: "Trusted Expertise",
      description: "From a modest shop to Kuttanad's premier paint destination, we grow through trust and quality.",
    }
  ];

  return (
    <section id="about" className="pt-16 pb-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* IMAGE SIDE */}
          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden shadow-[20px_200px_80px_-20px_rgba(0,0,0,0.1)] aspect-[4/4] group border border-slate-100">
              <img
                src="/images/kph-shop-3.jpeg"
                alt="Kalangara Paint House Stock Display"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
                decoding="async"
                width="800"
                height="800"
              />

              {/* Sharp Content Overlay */}
              <div className="absolute bottom-0 left-0 bg-[#111111] text-white p-8 w-full md:w-3/4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center text-white">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-black text-xl leading-none uppercase tracking-tighter">23+ Years</p>
                    <p className="text-primary text-[10px] uppercase font-black tracking-[0.3em] mt-1">Of Excellence</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Architectural Line */}
            <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-primary/20 hidden lg:block" />
          </div>

          {/* CONTENT SIDE */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">About Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-foreground tracking-tighter uppercase leading-[0.9]">
                Your Trusted <br />
                Paint Partner <span className="text-primary italic">In Edathua</span>
              </h2>
              <p className="text-slate-500 font-bold text-sm md:text-base leading-relaxed max-w-2xl border-l-4 border-slate-100 pl-8">
                Kalangara Paint House is more than just a retail shop; we are a specialized paint studio and wholesale hub that has served the community for over two decades. Located in the St. George Shopping Complex, we are the go-to destination for painting solutions in Kuttanad.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-10">
              {features.map((feature, idx) => (
                <div key={idx} className="space-y-4 group">
                  <div className="w-12 h-12 bg-slate-50 flex items-center justify-center text-primary group-hover:bg-[#111111] group-hover:text-white transition-all duration-500">
                    <feature.icon className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-black text-[13px] uppercase tracking-widest text-foreground">{feature.title}</h3>
                  <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>


          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
