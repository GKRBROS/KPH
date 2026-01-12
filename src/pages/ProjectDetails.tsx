import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, MapPin, Calendar, CheckCircle2, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface Project {
    id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    cover_image_url: string;
    completion_date: string;
    sqft: string;
}

interface WorkImage {
    id: string;
    image_url: string;
    name: string;
}

const ProjectDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<Project | null>(null);
    const [images, setImages] = useState<WorkImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProjectDetails();
        }
    }, [id]);

    const fetchProjectDetails = async () => {
        try {
            // Fetch Project
            const { data: projectData, error: projectError } = await (supabase
                .from('projects' as any)
                .select('*')
                .eq('id', id)
                .single()) as any;

            if (projectError) throw projectError;
            setProject(projectData);

            // Fetch Related Images
            const { data: imageData, error: imageError } = await (supabase
                .from('work_images' as any)
                .select('*')
                .eq('project_id', id)) as any; // Logic to get images for this project

            // If no linked images, maybe fallback to showing just the cover or filtering by something else?
            // For now, assuming standard linking.
            if (imageError) console.error("Error fetching images:", imageError);
            if (imageData) setImages(imageData);

        } catch (error) {
            console.error("Error fetching details:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex justify-center items-center bg-zinc-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <h2 className="text-2xl font-bold">Project Not Found</h2>
                <Button asChild className="mt-4">
                    <Link to="/">Back to Home</Link>
                </Button>
            </div>
        );
    }

    // Combine cover image with other images for the main slider if desired, 
    // or just use the images array if it contains everything.
    // Let's assume images array has the "gallery" images.
    const allImages = images.length > 0 ? images : [{ id: 'cover', image_url: project.cover_image_url, name: project.title }];

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb / Back */}
            <div className="container mx-auto px-4 py-4 border-b border-slate-100">
                <Link to="/" className="inline-flex items-center text-slate-500 hover:text-primary transition-colors font-medium text-sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Gallery
                </Link>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Images (Hero Carousel + Grid) */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Main Hero Carousel */}
                        <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50">
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {allImages.map((img) => (
                                        <CarouselItem key={img.id}>
                                            <div className="aspect-video relative">
                                                <img
                                                    src={img.image_url}
                                                    alt={img.name || project.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {allImages.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-4 bg-white/10 hover:bg-white text-white border-none" />
                                        <CarouselNext className="right-4 bg-white/10 hover:bg-white text-white border-none" />
                                    </>
                                )}
                            </Carousel>
                        </div>

                        {/* Image Grid / Lightbox Triggers */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                {images.map((img, idx) => (
                                    <Dialog key={img.id}>
                                        <DialogTrigger asChild>
                                            <div className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-slate-100">
                                                <img
                                                    src={img.image_url}
                                                    alt={img.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl bg-transparent border-none shadow-none p-0">
                                            <img
                                                src={img.image_url}
                                                alt={img.name}
                                                className="w-full h-auto rounded-md"
                                            />
                                        </DialogContent>
                                    </Dialog>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Project Details Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
                                    {project.category}
                                </span>
                                <h1 className="text-3xl font-black text-slate-900 mb-2 leading-tight">
                                    {project.title}
                                </h1>
                                <div className="flex items-center text-slate-500 font-medium">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {project.location}
                                </div>
                            </div>

                            <p className="text-slate-600 leading-relaxed mb-8 border-b border-slate-100 pb-8">
                                {project.description}
                            </p>

                            <div className="space-y-4 mb-8">
                                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Project Highlights</h3>
                                <ul className="space-y-3">
                                    {project.sqft && (
                                        <li className="flex items-center text-slate-600">
                                            <Ruler className="w-5 h-5 mr-3 text-primary/60" />
                                            <span>Area: <strong className="text-slate-900">{project.sqft}</strong></span>
                                        </li>
                                    )}
                                    {project.completion_date && (
                                        <li className="flex items-center text-slate-600">
                                            <Calendar className="w-5 h-5 mr-3 text-primary/60" />
                                            <span>Completed: <strong className="text-slate-900">{new Date(project.completion_date).toLocaleDateString()}</strong></span>
                                        </li>
                                    )}
                                    <li className="flex items-center text-slate-600">
                                        <CheckCircle2 className="w-5 h-5 mr-3 text-primary/60" />
                                        <span>Premium Quality Finish</span>
                                    </li>
                                </ul>
                            </div>

                            <Button className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20" asChild>
                                <a href="https://wa.me/918301921926?text=Hi, I saw the project ${encodeURIComponent(project.title)} and I am interested in similar work." target="_blank" rel="noopener noreferrer">
                                    Enquire Similar Work
                                </a>
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
