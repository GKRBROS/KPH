import { Play, Instagram, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

const VideoSection = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Instagram direct mp4 URL (extracted via subagent)
    const videoSrc = "https://instagram.fcok15-1.fna.fbcdn.net/o1/v/t2/f2/m367/AQMj4Xh_--UVDHWvUa1wCugxlF-r2hjJ7Yqz46SWCX1e5XmrNrPVzBBZVOVb-i6QFfGNLzYqXVds-6qyYeZOSrJKXemiuVCXsEkY8aA.mp4?_nc_cat=102&_nc_oc=Adl1IwNdqZnAK2MqaI72tWnyrBKqjuX58u8mwwnb94-nl-jbdfheq4GEP8-u9nfXNDU&_nc_sid=9ca052&_nc_ht=instagram.fcok15-1.fna.fbcdn.net&_nc_ohc=boeCXpD29dYQ7kNvwFiigiV&efg=eyJ2ZW5jb2RlX3RhZyI6ImlnLXhwdmRzLmNsaXBzLmMyLUMzLmRhc2hfYmFzZWxpbmVfMV92MSIsInZpZGVvX2lkIjpudWxsLCJvaWxfdXJsZ2VuX2FwcF9pZCI6OTM2NjE5NzQzMzkyNDU5LCJjbGllbnRfbmFtZSI6ImlnIiwieHB2X2Fzc2V0X2lkIjoxMjEyNjQwNzUwNjUwNzA2LCJhc3NldF9hZ2VfZGF5cyI6MjQ3LCJ2aV91c2VjYXNlX2lkIjoxMDA5OSwiZHVyYXRpb25fcyI6NTgsImJpdHJhdGUiOjIwNDc5MjcsInVybGdlbl9zb3VyY2UiOiJ3d3cifQ%3D%3D&ccb=17-1&_nc_gid=tzlJkq3YKAqnKY2fbgMKSQ&_nc_zt=28&oh=00_AfojamQ6FfuO-2298gyRNRMpnMPoEIiEhwV1F50edPwvVw&oe=696FB663";

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Autoplay was prevented:", error);
            });
        }
    }, []);

    return (
        <section className="bg-black py-24 relative overflow-hidden group">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#ffffff08_0%,transparent_70%)] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col items-center">

                    {/* Minimalist Narrative */}
                    <div className="mb-16 text-center space-y-4">
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-px w-8 bg-primary/40" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">The Showcase</span>
                            <div className="h-px w-8 bg-primary/40" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-heading font-black text-white uppercase tracking-tighter leading-none">
                            Legacy In <span className="text-primary italic">Motion</span>
                        </h2>
                        <p className="text-slate-500 text-xs md:text-sm font-medium tracking-widest uppercase">
                            Step Inside Kalangara Paint House • Edathua
                        </p>
                    </div>

                    {/* The Video: Large, Frameless, High-Impact */}
                    <div className="relative w-full max-w-4xl aspect-[16/9] bg-zinc-900 shadow-[0_0_100px_rgba(0,0,0,1)] group/video">
                        {/* Decorative Corner Accents */}
                        <div className="absolute -top-1 -left-1 w-12 h-12 border-t border-l border-primary/30 group-hover/video:w-full group-hover/video:h-full transition-all duration-1000" />
                        <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b border-r border-primary/30 group-hover/video:w-full group-hover/video:h-full transition-all duration-1000" />

                        {/* Autoplay Video Tag */}
                        <div className="w-full h-full overflow-hidden relative">
                            <video
                                ref={videoRef}
                                src={videoSrc}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />

                            {/* Cinematic Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                        </div>

                        {/* Centered Focus Glyph */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover/video:opacity-100 transition-opacity duration-1000">
                            <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-sm">
                                <Play className="w-6 h-6 text-white fill-current" />
                            </div>
                        </div>

                        {/* Side Branding */}
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 vertical-text">
                            <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.8em]">QUALTIY SINCE 1995</span>
                        </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-12">
                        <a
                            href="https://www.instagram.com/reel/DJmKDihz7yK/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-primary transition-colors group/link"
                        >
                            <Instagram className="w-4 h-4" />
                            Watch Original Reel
                            <ArrowUpRight className="w-3 h-3 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default VideoSection;
