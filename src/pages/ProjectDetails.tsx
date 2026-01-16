import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, MapPin, Calendar, CheckCircle2, Ruler, Share2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
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
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (id) {
            fetchProjectDetails();
        }
    }, [id]);

    useEffect(() => {
        if (!api) {
            return
        }

        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

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
                .eq('project_id', id)) as any;

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
                <Button asChild className="mt-4 rounded-none">
                    <Link to="/">Back to Home</Link>
                </Button>
            </div>
        );
    }

    const allImages = images.length > 0 ? images : [{ id: 'cover', image_url: project.cover_image_url, name: project.title }];

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Architectural Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Breadcrumb / Back */}
            <div className="relative border-b border-slate-200 bg-white/50 backdrop-blur-sm z-20">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/" className="inline-flex items-center text-slate-500 hover:text-primary transition-colors font-bold text-xs uppercase tracking-widest group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Gallery
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Column: Images (Hero Carousel + Grid) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Main Hero Carousel */}
                        <div className="relative group overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 bg-white">
                            <Carousel className="w-full" setApi={setApi}>
                                <CarouselContent>
                                    {allImages.map((img) => (
                                        <CarouselItem key={img.id}>
                                            <div className="aspect-video relative bg-slate-100">
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
                                        <CarouselPrevious className="left-0 w-12 h-12 rounded-none bg-black/20 hover:bg-black/80 text-white border-none transition-colors" />
                                        <CarouselNext className="right-0 w-12 h-12 rounded-none bg-black/20 hover:bg-black/80 text-white border-none transition-colors" />
                                    </>
                                )}
                            </Carousel>

                            {/* Slide Counter Overlay */}
                            <div className="absolute bottom-6 right-6 bg-black/80 text-white px-4 py-2 text-xs font-bold tracking-widest backdrop-blur-sm">
                                {String(current).padStart(2, '0')} / {String(allImages.length).padStart(2, '0')}
                            </div>
                        </div>

                        {/* Image Grid / Lightbox Triggers */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                {images.map((img, idx) => (
                                    <Dialog key={img.id}>
                                        <DialogTrigger asChild>
                                            <div className="aspect-square overflow-hidden cursor-pointer bg-white border border-slate-200 hover:ring-2 hover:ring-primary transition-all relative group">
                                                <img
                                                    src={img.image_url}
                                                    alt={img.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-[90vw] md:max-w-4xl bg-transparent border-none shadow-none p-0 flex justify-center">
                                            <img
                                                src={img.image_url}
                                                alt={img.name}
                                                className="max-h-[85vh] w-auto rounded-none shadow-2xl"
                                            />
                                        </DialogContent>
                                    </Dialog>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Project Details Card */}
                    <div className="lg:col-span-4 sticky top-24">
                        <div className="relative bg-white p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden group hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.15)] transition-shadow duration-500">

                            {/* Decorative Watermark */}
                            <span className="absolute -top-6 -right-6 text-[120px] font-black text-slate-100/50 leading-none select-none pointer-events-none z-0">
                                01
                            </span>

                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] text-white uppercase bg-black shadow-lg">
                                    {project.category}
                                </span>

                                <h1 className="text-3xl md:text-4xl font-heading font-black text-slate-900 mb-2 leading-[1.1] tracking-tight">
                                    {project.title}
                                </h1>

                                <div className="flex items-center text-slate-500 font-bold text-xs uppercase tracking-wider mb-8">
                                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                                    {project.location}
                                </div>

                                <p className="text-slate-600 leading-relaxed mb-8 text-sm md:text-base border-l-2 border-primary/20 pl-4">
                                    {project.description}
                                </p>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-slate-50 p-4 border border-slate-100 transition-colors hover:border-primary/20">
                                        <div className="flex items-center text-primary mb-2">
                                            <Ruler className="w-4 h-4" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Area</p>
                                        <p className="text-slate-900 font-bold">{project.sqft || 'N/A'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 border border-slate-100 transition-colors hover:border-primary/20">
                                        <div className="flex items-center text-primary mb-2">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Year</p>
                                        <p className="text-slate-900 font-bold">
                                            {project.completion_date ? new Date(project.completion_date).getFullYear() : '2023'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-10">
                                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        Project Highlights
                                    </h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-center text-slate-600 text-sm font-medium">
                                            <CheckCircle2 className="w-4 h-4 mr-3 text-green-500" />
                                            <span>Premium Quality Finish</span>
                                        </li>
                                        <li className="flex items-center text-slate-600 text-sm font-medium">
                                            <CheckCircle2 className="w-4 h-4 mr-3 text-green-500" />
                                            <span>10-Year Warranty</span>
                                        </li>
                                    </ul>
                                </div>

                                <Button className="w-full h-14 text-sm font-bold tracking-widest uppercase rounded-none shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all bg-primary hover:bg-primary/90" asChild>
                                    <a href={`https://wa.me/919446194178?text=Hi, I saw the project ${encodeURIComponent(project.title)} and I am interested in similar work.`} target="_blank" rel="noopener noreferrer">
                                        Enquire Similar Work
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
