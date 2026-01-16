import React from "react";
import { ArrowUpRight } from "lucide-react";

const BrandMarquee = () => {
    const brands = [
        { name: "Asian Paints", logo: "/icons/asian-paints.png" },
        { name: "Berger Paints", logo: "/icons/berger-paints-seeklogo.png" },
        { name: "Birla Opus", logo: "/icons/birla-opus-paints-seeklogo.png" },
        { name: "JSW Paints", logo: "/icons/jsw-paints-seeklogo.png" },
        { name: "Esdee Paints", logo: "/icons/esdee-paints-seeklogo.png" },
        { name: "Indigo Paints", logo: "/icons/indigo-paints-seeklogo.png" },
        { name: "Birla White", logo: "/icons/birla-white-seeklogo.png" },
        { name: "Grass Hopper", logo: "/icons/grass-hopper-paints.png" },
        { name: "Sheenlac Paints", logo: "/icons/sheenlac-whiteLogo.png" },
        { name: "MRF Vapocure", logo: "/icons/mrf.png" },
        { name: "Maxel Paints", logo: "/icons/maxel.png" },
    ];

    const marqueeBrands = [...brands, ...brands, ...brands];

    return (
        <section id="brands" className="bg-white border-y border-slate-100 overflow-hidden relative w-full">
            <div className="flex flex-col lg:flex-row items-stretch">

                {/* Left Side: Scrolling Marquee */}
                <div className="flex-grow relative bg-slate-100 py-1 lg:py-0 flex items-center overflow-hidden">
                    <div className="flex whitespace-nowrap animate-marquee items-center py-0.5">
                        {marqueeBrands.map((brand, index) => (
                            <div
                                key={`${brand.name}-${index}`}
                                className="flex flex-col items-center justify-center px-8 md:px-12 group/brand cursor-pointer"
                            >
                                <div className="h-12 md:h-14 flex items-center justify-center transition-all duration-500 group-hover/brand:scale-110">
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        loading="lazy"
                                        className="h-full w-auto object-contain transition-all duration-500 opacity-90 group-hover/brand:opacity-100"
                                    />
                                </div>
                                <span className="mt-0.5 text-[7px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-0 group-hover/brand:opacity-100 transition-all duration-300">
                                    {brand.name}
                                </span>
                            </div>
                        ))}
                    </div>
                    {/* Shadow for smooth exit on the far left */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-100 to-transparent z-10 pointer-events-none" />
                </div>

                {/* Right Side: Identity Card */}
                <div className="lg:w-[260px] shrink-0 bg-[#0A0A0A] text-white p-3 flex flex-col justify-center relative overflow-hidden group/text">
                    {/* Decorative copper accent for premium look */}
                    <div className="absolute top-0 right-0 w-1 h-full bg-primary" />
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em]">Auth Partner</span>
                            <div className="h-[1px] w-6 bg-primary/30" />
                        </div>
                        <h2 className="text-xl font-heading font-black tracking-tighter leading-none uppercase">
                            OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-white">BRANDS</span>
                        </h2>
                        <a
                            href="#contact"
                            onClick={(e) => {
                                e.preventDefault();
                                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-1 text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-2 hover:text-white transition-colors cursor-pointer"
                        >
                            ENQUIRE NOW
                            <div className="w-4 h-4 rounded-full border border-primary/30 flex items-center justify-center group-hover/text:bg-primary group-hover/text:border-primary transition-all">
                                <ArrowUpRight className="w-2.5 h-2.5" />
                            </div>
                        </a>
                    </div>

                    {/* Subtle aesthetic icon/glyph at bottom */}
                    <div className="absolute bottom-1 right-3 text-white/5 font-black text-2xl select-none group-hover/text:text-primary/10 transition-colors duration-700">
                        KPH
                    </div>
                </div>

            </div>
        </section>
    );
};

export default BrandMarquee;
