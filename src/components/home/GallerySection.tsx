
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { GalleryCarousel } from "./GalleryCarousel";
import { Project } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching projects:", error);
                return;
            }

            if (data) {
                setProjects(data as any);
            }
        } catch (error) {
            console.error("Error in fetchProjects:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (projects.length === 0) {
        return null;
    }

    return (
        <section id="gallery" className="section-padding bg-slate-50">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="text-left">
                        <span className="text-primary font-bold tracking-widest uppercase mb-2 block">
                            Our Portfolio
                        </span>
                        <h2 className="text-3xl md:text-4xl font-heading font-black text-slate-900">
                            Recent Masterpieces
                        </h2>
                        <p className="text-slate-500 mt-4 max-w-xl">
                            Explore our latest projects showcasing our expertise in interior and exterior transformations across Kerala.
                        </p>
                    </div>

                    <Button asChild variant="outline" className="hidden md:flex border-primary text-primary hover:bg-primary hover:text-white transition-colors rounded-full px-6">
                        <Link to="/all-works">
                            View All Works
                        </Link>
                    </Button>
                </div>

                <GalleryCarousel projects={projects} />

                <div className="mt-8 text-center md:hidden">
                    <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-colors rounded-full px-6 w-full">
                        <Link to="/all-works">
                            View All Works
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default GallerySection;

