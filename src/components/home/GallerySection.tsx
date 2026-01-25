import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Camera } from "lucide-react";
import { GalleryCarousel } from "./GalleryCarousel";
import { Project } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Sample projects for when DB is empty
const SAMPLE_PROJECTS: Project[] = [
    {
        id: "sample-1",
        title: "Modern Minimalist Villa",
        location: "Kottayam",
        category: "Interior",
        cover_image_url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "sample-2",
        title: "Classic Colonial Estate",
        location: "Alappuzha",
        category: "Exterior",
        cover_image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "sample-3",
        title: "Luxury Penthouse Suite",
        location: "Ernakulam",
        category: "Interior",
        cover_image_url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

const GallerySection = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*, work_images(*)')
                .order('created_at', { ascending: false })
                .limit(6);

            if (error) {
                console.error("Error fetching projects:", error);
            }

            if (data && data.length > 0) {
                setProjects(data as any);
            } else {
                setProjects(SAMPLE_PROJECTS);
            }
        } catch (error) {
            console.error("Error in fetchProjects:", error);
            setProjects(SAMPLE_PROJECTS);
        } finally {
            setLoading(false);
        }
    };

    const optimizedProjects = useMemo(() => {
        return projects.slice(0, 6);
    }, [projects]);

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <section id="gallery" className="py-20 bg-white relative overflow-hidden">
            {/* Artistic Grid Background */}
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8A2BE2 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-16 gap-8 text-center lg:text-left">
                    <div className="space-y-6">
                        <span className="inline-flex items-center gap-3 px-4 py-2 rounded-none bg-slate-50 text-primary font-black text-[10px] uppercase tracking-[0.3em] border-l-2 border-primary">
                            <Camera className="w-3 h-3" />
                            Curated Masterpieces
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-normal text-slate-900 tracking-tighter leading-[0.9] uppercase">
                            Visionary <br /> <span className="text-primary font-serif">Architectural Spaces</span>
                        </h2>
                    </div>

                    <Button asChild className="hidden lg:flex bg-black hover:bg-zinc-800 text-white transition-all rounded-none px-10 py-7 text-xs font-bold tracking-widest uppercase border border-black hover:shadow-2xl">
                        <Link to="/all-works">
                            EXPLORE ALL WORKS
                        </Link>
                    </Button>
                </div>

                <div className="relative">
                    <GalleryCarousel projects={optimizedProjects} />
                </div>

                <div className="mt-16 text-center lg:hidden px-4">
                    <Button asChild className="bg-black hover:bg-zinc-800 text-white transition-all rounded-none px-8 py-6 text-xs font-bold tracking-widest w-full">
                        <Link to="/all-works">
                            VIEW FULL GALLERY
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default GallerySection;
