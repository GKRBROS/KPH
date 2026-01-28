import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowUpRight } from "lucide-react";
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
            }, 1800);
        } else {
            setCurrentImageIndex(0); // Reset on mouse leave
        }
        return () => clearInterval(interval);
    }, [isHovered, allImages.length]);

    return (
        <Link to={`/gallery/${project.id}`} className="block h-full group">
            <div
                className="relative overflow-hidden rounded-none aspect-square md:aspect-[4/3] shadow-lg cursor-pointer h-full border-none bg-foreground ring-1 ring-black/5"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Layer */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    {allImages.map((img, index) => (
                        (index === 0 || isHovered) && (
                            <img
                                key={img}
                                src={img}
                                alt={`${project.title} - ${index}`}
                                loading="lazy"
                                decoding="async"
                                className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100 scale-105" : "opacity-0 scale-100"
                                    } group-hover:grayscale-[0.2] transition-all duration-1000`}
                            />
                        )
                    ))}
                </div>

                {/* Progress Indicators */}
                {allImages.length > 1 && (
                    <div className="absolute top-6 left-0 right-0 flex justify-center gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        {allImages.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-none transition-all duration-500 ${idx === currentImageIndex ? "w-8 bg-primary" : "w-2 bg-white/40"
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Content - Only render if title exists */}
                {project.title && (
                    <>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 space-y-3">
                                <div className="flex justify-between items-end">
                                    <div>
                                        {project.category && (
                                            <span className="inline-block px-4 py-1.5 text-[11px] font-bold tracking-widest text-white uppercase bg-primary rounded-none shadow-lg mb-2">
                                                {project.category}
                                            </span>
                                        )}
                                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                                            {project.title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-white/80 text-xs font-semibold tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 uppercase border-t border-white/20 pt-4 mt-2">
                                    <div className="flex items-center">
                                        {project.location && (
                                            <>
                                                <MapPin className="w-4 h-4 mr-2 text-primary" strokeWidth={2.5} />
                                                {project.location}
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-center text-primary group-hover:text-white transition-colors">
                                        View Details
                                        <ArrowUpRight className="w-4 h-4 ml-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Link>
    );
};
