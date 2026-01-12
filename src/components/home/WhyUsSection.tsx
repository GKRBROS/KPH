import { Store, Tag, Briefcase, PaintBucket, ArrowRight, CheckCircle2 } from "lucide-react";

const WhyUsSection = () => {
  const services = [
    {
      icon: Store,
      title: "Leading Brands",
      description: "All leading paint brands under one roof, including Asian Paints, Berger, Birla Opus, JSW Paints, Indigo Paints, and more—ensuring the right solution for every surface.",
      color: "bg-black text-white",
    },
    {
      icon: Tag,
      title: "Best Pricing",
      description: "Enjoy premium quality paints at affordable rates with exclusive discounts ranging from 10% to 30%, making us one of the best-priced paint stores in Edathua.",
      color: "bg-red-600 text-white",
    },
    {
      icon: Briefcase,
      title: "Executive Works & Trusted References",
      description: "Proven experience in executing interior, exterior, and waterproofing works for homes, villas, apartments, and commercial spaces. Trusted by satisfied customers and backed by strong local references across Edathua and nearby areas.",
      color: "bg-black text-white",
      highlight: true,
    },
    {
      icon: PaintBucket,
      title: "Complete Paint Solutions",
      description: "From paint selection and color guidance to waterproofing and wall care solutions, we provide end-to-end painting services under one roof.",
      color: "bg-red-600 text-white",
    }
  ];

  return (
    <section id="why-us" className="py-16 lg:py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -z-10 skew-x-12 translate-x-32" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Left Column: Heading & Intro */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold text-xs uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                Why Choose KPH
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-black leading-tight animate-slide-up">
                Trusted Dealer <br />
                <span className="text-primary">
                  in Edathua
                </span>
              </h2>
            </div>

            <p className="font-body text-lg text-slate-600 leading-relaxed text-justify">
              <strong>Kalangara Paint House</strong> is a trusted paint dealer in Edathua, offering premium branded paints, expert guidance, and proven work experience. We are known for quality service, competitive pricing, and successfully executed residential and commercial painting works.
            </p>

            <div className="pt-4 hidden lg:block">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                Our Strengths
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-white border border-slate-100 rounded-lg shadow-sm text-slate-600 text-sm font-medium">Original Brands</span>
                <span className="px-4 py-2 bg-white border border-slate-100 rounded-lg shadow-sm text-slate-600 text-sm font-medium">Expert Team</span>
                <span className="px-4 py-2 bg-white border border-slate-100 rounded-lg shadow-sm text-slate-600 text-sm font-medium">Local Trust</span>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline / Cards */}
          <div className="lg:col-span-7 relative">
            {/* Vertical Line */}
            <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-transparent lg:left-[35px]" />

            <div className="space-y-12">
              {services.map((service, index) => (
                <div key={index} className="relative flex gap-6 group">
                  {/* Icon Marker */}
                  <div className="relative shrink-0">
                    <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${service.color}`}>
                      <service.icon className="w-6 h-6 lg:w-7 lg:h-7" />
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 bg-white p-6 md:p-8 rounded-3xl border transition-all duration-300 hover-lift ${service.highlight ? 'border-red-100 shadow-xl shadow-red-100/20 ring-1 ring-red-50' : 'border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200'}`}>
                    <h3 className="font-heading text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                      {service.title}
                      {service.highlight && <CheckCircle2 className="w-5 h-5 text-red-500 fill-red-50" />}
                    </h3>
                    <p className="font-body text-slate-600 leading-relaxed text-sm md:text-base">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
