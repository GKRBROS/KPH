import { MapPin, ArrowUpRight } from "lucide-react";

const ShopGallerySection = () => {
    const images = [
        { src: "/images/kph-shop-1.jpeg", label: "Main Counter", category: "Service" },
        { src: "/images/kph-shop-2.jpeg", label: "Texture Display", category: "Interior" },
        { src: "/images/kph-shop-6.jpeg", label: "Store Front", category: "Exterior" },
        { src: "/images/kph-shop-3.jpeg", label: "Color Studio", category: "Consultation" },
        { src: "/images/kph-shop-5.jpeg", label: "Stock Aisle", category: "Inventory" },
        { src: "/images/kph-shop-4.jpeg", label: "Product Range", category: "Selection" },
    ];

    // Create a seamless loop by duplicating the array
    const marqueeImages = [...images, ...images, ...images];

    return (
        <section id="showroom" className="py-20 bg-slate-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:h-[500px] items-stretch">

                    {/* Left: Premium Dark Card (Fixed Info) */}
                    <div className="lg:w-[35%] bg-[#080808] text-white p-10 flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl transition-all duration-500 rounded-none border-l-4 border-primary z-20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
                        {/* Ambient Glows */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-900/40 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-3 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">Open Mon-Sat</span>
                            </div>

                            <h2 className="text-5xl lg:text-6xl font-heading font-black tracking-tighter leading-[0.9]">
                                VISIT THE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">SHOWROOM</span>
                            </h2>

                            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[300px] border-l-2 border-primary/50 pl-4">
                                Experience the true colors of your dream home. Our Edathua studio offers a hands-on experience with thousands of shades and textures.
                            </p>
                        </div>

                        <div className="relative z-10 pt-8">
                            <a
                                href="https://maps.google.com/?q=Kalangara+Paint+House+Edathua"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 group/link w-fit cursor-pointer"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover/link:bg-primary/40 transition-all" />
                                    <div className="w-12 h-12 bg-white text-black flex items-center justify-center rounded-full relative z-10 group-hover/link:scale-110 transition-transform duration-300">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold uppercase tracking-widest text-white group-hover/link:text-primary transition-colors">Get Directions</span>
                                    <span className="block text-[10px] text-slate-500">St. George Complex, Edathua</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Right: Marquee Gallery */}
                    <div className="lg:w-[65%] relative overflow-hidden mask-linear-gradient flex items-center bg-white/50 border border-white backdrop-blur-sm rounded-none border-l-0">
                        {/* Gradient Masks for smooth fade edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10" />

                        {/* Scrolling Container */}
                        <div className="flex gap-5 animate-marquee hover:[animation-play-state:paused] py-4 h-full">
                            {marqueeImages.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative flex-none w-[300px] md:w-[350px] lg:w-[400px] h-[400px] md:h-[450px] lg:h-full group/card cursor-pointer perspective-1000"
                                >
                                    <div className="w-full h-full relative overflow-hidden rounded-none border border-slate-200 bg-white shadow-lg transition-all duration-500 group-hover/card:-translate-y-2 group-hover/card:shadow-xl">

                                        <img
                                            src={img.src}
                                            alt={img.label}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110 grayscale-[0.2] group-hover/card:grayscale-0"
                                            loading="lazy"
                                            decoding="async"
                                        />

                                        {/* Overlay Content */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                            <div className="translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-primary text-[9px] font-black uppercase tracking-[0.2em] bg-black/50 backdrop-blur-md px-2 py-1 rounded-none">
                                                        {img.category}
                                                    </span>
                                                    <ArrowUpRight className="w-4 h-4 text-white" />
                                                </div>
                                                <h3 className="text-white text-xl font-heading font-bold uppercase tracking-tight">
                                                    {img.label}
                                                </h3>
                                            </div>
                                        </div>
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

export default ShopGallerySection;
