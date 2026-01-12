import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, MapPin } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

import Autoplay from "embla-carousel-autoplay"

import { Project, ProjectCard } from "@/components/ui/ProjectCard"

interface GalleryCarouselProps {
    projects: Project[]
}

export const GalleryCarousel = ({ projects }: GalleryCarouselProps) => {
    // Duplicate projects if there are few, to ensure seamless looping
    const displayProjects = projects.length > 0 && projects.length < 6
        ? [...projects, ...projects, ...projects]
        : projects;

    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 4000,
                    stopOnInteraction: false,
                }),
            ]}
            className="w-full"
        >
            <CarouselContent className="-ml-2 md:-ml-4">
                {displayProjects.map((project, index) => (
                    <CarouselItem key={`${project.id}-${index}`} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                        <ProjectCard project={project} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-8 pr-4">
                <CarouselPrevious className="static translate-y-0 hover:bg-primary hover:text-white transition-colors" />
                <CarouselNext className="static translate-y-0 hover:bg-primary hover:text-white transition-colors" />
            </div>
        </Carousel>
    )
}

