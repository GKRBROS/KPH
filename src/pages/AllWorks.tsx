import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import { Project, ProjectCard } from "@/components/ui/ProjectCard";

const AllWorks = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data, error } = await supabase
                    .from('projects')
                    .select('*, work_images(*)')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) setProjects(data as any);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Header / Nav Area */}
            <div className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-slate-600 hover:text-primary hover:bg-slate-50"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold text-base">Back</span>
                    </Button>

                    <div className="hidden md:block">
                        <Link to="/">
                            <img src="/icons/icon.png" alt="KPH Paints" className="h-10 w-auto" />
                        </Link>
                    </div>

                    <div className="w-20 md:hidden"></div> {/* Spacer for mobile centering if needed */}
                </div>
            </div>

            {/* Page Title Section */}
            <section className="bg-white pt-12 pb-8 border-b border-slate-100">
                <div className="container mx-auto px-4 text-center">
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-[0.2em] text-primary uppercase bg-primary/5 rounded-full border border-primary/10">
                        Our Portfolio
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Our Finishes <span className="text-primary">Gallery</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
                        Explore our collection of transformed spaces, showcasing excellence in every detail.
                    </p>
                </div>
            </section>

            {/* Works Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                            <p className="text-slate-500 text-lg font-medium">No projects found. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <div key={project.id} className="h-full">
                                    <ProjectCard project={project} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AllWorks;
