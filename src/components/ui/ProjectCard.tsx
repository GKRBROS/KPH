import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type ProjectRow = Database['public']['Tables']['projects']['Row'];

export interface Project extends ProjectRow {
    work_images?: { image_url: string }[];
}

export const ProjectCard = ({ project }: { project: Project }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const allImages = useMemo(() => {
        const images = [project.cover_image_url];
        // Check if work_images exists and is an array (it might be an error object if join failed)
        if (project.work_images && Array.isArray(project.work_images)) {
            project.work_images.forEach((img: any) => {
                if (img.image_url && img.image_url !== project.cover_image_url) {
                    images.push(img.image_url);
                }
            });
        }
        return images;
    }, [project]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHovered && allImages.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
            }, 1500);
        } else {
            setCurrentImageIndex(0); // Reset on mouse leave
        }
        return () => clearInterval(interval);
    }, [isHovered, allImages.length]);

    return (
        <Link to={`/gallery/${project.id}`} className="block h-full">
            <div
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-lg cursor-pointer h-full border border-slate-100 bg-slate-900"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Layer */}
                <div className="absolute inset-0 w-full h-full">
                    {allImages.map((img, index) => (
                        <img
                            key={img}
                            src={img}
                            alt={`${project.title} - ${index}`}
                            loading="lazy"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${index === currentImageIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                                }`}
                        />
                    ))}
                </div>

                {/* Progress Indicators (if multiple) */}
                {allImages.length > 1 && (
                    <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {allImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-300 ${idx === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                )}


                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold tracking-widest text-white uppercase bg-primary/90 rounded-full backdrop-blur-sm shadow-sm">
                            {project.category}
                        </span>
                        <h3 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight drop-shadow-md">
                            {project.title}
                        </h3>
                        <div className="flex items-center text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            <MapPin className="w-4 h-4 mr-1.5 text-primary" />
                            {project.location}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};
