import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/images/asianpaints.png",
      title: "Asian Paints Royale",
      brand: "Asian Paints"
    },
    {
      image: "/images/berger-paint-silk.png",
      title: "Berger Silk",
      brand: "Berger Paints"
    },
    {
      image: "/images/berger-paint.png",
      title: "Berger Premium",
      brand: "Berger Paints"
    },
    {
      image: "/images/berger.png",
      title: "Berger Paints",
      brand: "Berger Paints"
    },
    {
      image: "/images/birla-color-smart.png",
      title: "Birla Color Smart",
      brand: "Birla Opus"
    },
    {
      image: "/images/weathercoat-long-life-can.png",
      title: "WeatherCoat Long Life",
      brand: "Berger Paints"
    },
    {
      image: "/images/indigo-paints.png",
      title: "Indigo Gloss",
      brand: "Indigo Paints"
    },
    {
      image: "/images/birla-ever-clear.png",
      title: "Birla Ever Clear",
      brand: "Birla Opus"
    },
    {
      image: "/images/JSW-Opera.png",
      title: "JSW Opera",
      brand: "JSW Paints"
    },
    {
      image: "/images/birla-opus-power-bright-shine.png",
      title: "Birla Opus Power",
      brand: "Birla Opus"
    },
    {
      image: "/images/berger-paint-silk.png",
      title: "Berger Silk Glamor",
      brand: "Berger Paints"
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section id="hero" className="relative min-h-[90vh] lg:min-h-[95vh] flex flex-col lg:flex-row items-center overflow-hidden bg-white pt-24 lg:pt-20">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        .animate-float-fast {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">

        {/* Left Column: Content Area */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest mb-6 lg:mb-8 animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {slides[currentSlide].brand}
          </div>

          <h1 className="font-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[0.9] tracking-tighter mb-6 lg:mb-8 uppercase animate-slide-up stagger-1">
            Transform <br />
            <span className="text-primary">Your World</span>
          </h1>

          <p className="font-body text-base sm:text-lg md:text-xl text-foreground/70 max-w-lg mb-8 lg:mb-10 leading-tight animate-slide-up stagger-2">
            Authorized dealers for Asian Paints, Berger & JSW. Premium solutions for Edathua's finest homes.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 animate-slide-up stagger-3">
            <a href="#gallery">
              <Button
                size="xl"
                className="bg-primary hover:bg-black text-white font-bold px-8 lg:px-10 py-6 rounded-none shadow-none transition-all duration-300 transform hover:skew-x-2"
              >
                See Recent Projects
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>

          <div className="mt-10 lg:mt-12 text-xs font-medium text-foreground/40 max-w-sm">
            Providing lasting finishes and protection for generations. Trusted by over 5000+ homeowners in Edathua since 1995.
          </div>
        </div>

        {/* Right Column: Carousel Visual */}
        <div className="w-full lg:w-1/2 relative flex items-center justify-center mt-8 lg:mt-0 h-[400px] sm:h-[500px] lg:h-[600px]">

          {/* Carousel Images with Fixed Size */}
          <div className="relative z-20 w-[260px] h-[260px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] flex items-center justify-center pointer-events-none">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute transition-all duration-1000 ease-in-out flex items-center justify-center ${index === currentSlide
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0"
                  }`}
                style={{
                  transform: index === currentSlide
                    ? `perspective(1000px) rotateY(${mousePos.x * 0.1}deg) rotateX(${mousePos.y * -0.1}deg)`
                    : 'none',
                }}
              >
                <div className={`relative w-[240px] h-[240px] sm:w-[380px] sm:h-[380px] lg:w-[480px] lg:h-[480px] flex items-center justify-center ${index === currentSlide ? 'animate-float-fast' : ''}`}>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.3)] filter brightness-110"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Indicators - Compact Version */}
          <div className="absolute bottom-0 lg:bottom-[10%] right-0 left-0 lg:left-auto lg:right-[10%] z-30 flex justify-center lg:justify-end gap-2 px-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentSlide
                  ? "bg-primary scale-125"
                  : "bg-gray-300 hover:bg-primary/50"
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
