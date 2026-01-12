import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ChevronRight, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <footer className="relative bg-zinc-950 text-slate-300 overflow-hidden pt-20 pb-10 border-t border-zinc-900">
            {/* Decorative Red Glow Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                    {/* Brand Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div>

                            <h3 className="font-heading text-3xl font-black text-white tracking-tight mb-4">
                                <span className="text-primary">KPH</span> Paints
                            </h3>
                            <p className="font-body text-zinc-400 leading-relaxed text-sm max-w-sm">
                                Your trusted partner for premium home painting solutions in Edathua. We bring color to your life with top-tier brands, expert advice, and unmatched service since 1995.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            {[Facebook, Instagram, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:-translate-y-1">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>

                        <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 shadow-inner group transition-colors hover:border-zinc-700">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm mb-1">Visit Our Store</h4>
                                    <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">
                                        St. George Shopping Complex,<br />
                                        Edathua, Kerala 689573
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links (2 cols) */}
                    <div className="lg:col-span-2">
                        <h4 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {["Home", "About Us", "Services", "Gallery", "Contact"].map((item) => (
                                <li key={item}>
                                    <a href={`#${item.toLowerCase().replace(" ", "-")}`} className="group flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                                        <ChevronRight className="w-3 h-3 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                        <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Offerings (3 cols) */}
                    <div className="lg:col-span-3">
                        <h4 className="font-heading text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            Our Services
                        </h4>
                        <ul className="space-y-3">
                            {[
                                "Interior Painting",
                                "Exterior Protection",
                                "Waterproofing Solutions",
                                "Texture & Stencils",
                                "Wood & Metal Care",
                                "Wall Putty & Primers"
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors cursor-default group">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-primary transition-colors" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Map (3 cols) */}
                    <div className="lg:col-span-3 space-y-6">
                        <h4 className="font-heading text-lg font-bold text-white mb-6">Locate Us</h4>
                        <div className="w-full h-48 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-black relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15752.484967332568!2d76.4716773!3d9.3752535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b089c10bd083819%3A0xc3f7a177b94101e4!2sEdathua%2C%20Kerala!5e0!3m2!1sen!2sin!4v1710925234567!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                            ></iframe>
                            <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl" />
                        </div>
                        <a href="tel:04772212444" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5 animate-in fade-in zoom-in duration-300">
                            <Phone className="w-4 h-4" />
                            Call Now: 0477 2212444
                        </a>
                    </div>

                </div>

                {/* Footer Bottom */}
                <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
                    <p className="text-center md:text-left">
                        © {new Date().getFullYear()} Kalangara Paint House. All rights reserved.
                    </p>
                    <div className="flex gap-6 justify-center md:justify-end">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
