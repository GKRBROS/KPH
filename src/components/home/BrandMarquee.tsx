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
        <section id="brands" className="py-6 bg-white relative border-b border-slate-100">
            {/* Creative fluid background */}
            <div className="absolute inset-0 bg-slate-50 opacity-40 pattern-grid-lg"></div>

            <div className="w-full relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 bg-white border-y border-slate-100 p-0 lg:pr-12 overflow-hidden">

                    {/* Creative Compact Header - Rotated Text option or Block */}
                    <div className="lg:w-[200px] shrink-0 bg-violet-50 p-6 flex flex-col justify-center items-center lg:items-start text-center lg:text-left h-full min-h-[140px] relative overflow-hidden group">
                        {/* Decorative Circle */}
                        <div className="absolute -right-6 -top-6 w-20 h-20 bg-violet-100 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out"></div>

                        <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 mb-1 block">Partners</span>
                            <h2 className="text-2xl font-serif font-black text-slate-900 leading-none">
                                Trusted <br /> <span className="text-violet-600">Brands</span>
                            </h2>
                            <div className="w-8 h-1 bg-slate-900 mt-3 rounded-full"></div>
                        </div>
                    </div>

                    {/* Infinite Marquee - Creative Glass Track */}
                    <div className="flex-grow w-full overflow-hidden relative px-4 lg:px-8">
                        {/* Fade Masks removed as per user request */}

                        <div className="flex animate-marquee items-center gap-12 w-max hover:[animation-play-state:paused] py-4">
                            {marqueeBrands.map((brand, index) => (
                                <div
                                    key={`${brand.name}-${index}`}
                                    className="group relative w-24 sm:w-28 md:w-32 aspect-video flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                                >
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="w-full h-full object-contain filter drop-shadow-sm group-hover:drop-shadow-lg transition-all duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Creative End Cap / Arrows */}
                    <div className="hidden lg:flex flex-col gap-1 items-center justify-center pl-4 border-l border-slate-100 h-10 opacity-30">
                        <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                        <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                        <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BrandMarquee;
