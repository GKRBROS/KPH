import { ArrowRight, Paintbrush, ShieldCheck, Droplets, ArrowUpRight, Truck, Phone, Palette } from "lucide-react";
import ShopGallerySection from "./ShopGallerySection";

const ServicesSection = () => {
    const services = [
        {
            title: "Waterproofing",
            subtitle: "LEAK PROTECTION",
            description: "Expert solutions from Dr. Fixit and Asian Paints SmartCare Damp Proof. A single solution for summer heat and monsoon leaks.",
            image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=640&auto=format&fit=crop",
            icon: Droplets
        },
        {
            title: "Climate Protection",
            subtitle: "WEATHER SHIELD",
            description: "Premium paints engineered to withstand Kuttanad's high humidity, heavy rains, and intense heat. Protects against moss and algae.",
            image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=640&auto=format&fit=crop",
            icon: ShieldCheck
        },
        {
            title: "Wall Care",
            subtitle: "SMOOTH FINISH",
            description: "Top-tier white cements and putties from Birla White and Vembanadu to ensure your walls are perfectly smooth and durable.",
            image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=640&auto=format&fit=crop",
            icon: Paintbrush
        }
    ];

    const customerServices = [
        { icon: Truck, text: "Home Delivery" },
        { icon: Palette, text: "EzyColour Consultation" },
        { icon: Phone, text: "Expert Advice" }
    ];

    return (
        <section id="services" className="pt-24 pb-0 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                {/* Minimalist Heading Block */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
                    <div className="max-w-2xl space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="w-10 h-[2px] bg-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Specialized Solutions</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-foreground tracking-tighter uppercase leading-[0.9]">
                            We Don't Just <br /> <span className="text-primary italic">Sell Color</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 font-medium max-w-sm text-sm md:text-base border-l border-slate-100 pl-6 hidden lg:block">
                        We sell protection. Our specialized products are designed to safeguard your home against the tough Kerala climate.
                    </p>
                </div>

                {/* Services Grid - Slim & Sharp */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-100 mb-0">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col border-r last:border-r-0 border-slate-100 hover:bg-slate-50 transition-all duration-700 overflow-hidden"
                        >
                            {/* Service Image */}
                            <div className="aspect-[21/10] sm:aspect-[21/9] overflow-hidden relative border-b border-slate-100">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    loading="lazy"
                                    decoding="async"
                                    width="640"
                                    height="300"
                                />
                                {/* Corner Icon Box */}
                                <div className="absolute top-0 right-0 w-12 h-12 bg-[#111111] text-white flex items-center justify-center transition-transform duration-500 group-hover:bg-primary z-20">
                                    <service.icon className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                            </div>

                            {/* Service Content */}
                            <div className="p-8 md:p-10 flex flex-col items-start space-y-4">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                                    {service.subtitle}
                                </span>
                                <h3 className="text-2xl font-black font-heading text-foreground uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-slate-500 text-[13px] leading-relaxed font-semibold">
                                    {service.description}
                                </p>

                                <div className="pt-6 w-full">
                                    <button
                                        onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="group/btn flex items-center justify-between w-full text-[10px] font-black uppercase tracking-[0.3em] text-foreground border-t border-slate-100 pt-6 hover:text-primary transition-all"
                                    >
                                        ENQUIRE NOW
                                        <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:border-primary group-hover/btn:text-white transition-all">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Hover Bottom Border */}
                            <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary transition-all duration-700 group-hover:w-full" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Shop Gallery Section - Full Width */}
            <ShopGallerySection />

            {/* Additional Services Banner */}
            <div className="container mx-auto px-4 relative z-10 pb-16">
                <div className="bg-slate-50 border border-slate-100 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h4 className="font-black font-heading text-2xl text-slate-900 mb-2 uppercase tracking-tight">Additional Services</h4>
                            <p className="text-slate-500 text-sm">We make painting stress-free with these expert add-ons.</p>
                        </div>
                        <div className="flex flex-wrap gap-4 md:gap-8">
                            {customerServices.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white px-6 py-4 border border-slate-200 shadow-sm">
                                    <item.icon className="w-5 h-5 text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-widest text-slate-900">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
