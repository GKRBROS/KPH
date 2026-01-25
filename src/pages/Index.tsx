import { lazy, Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

// Lazy load heavy sections for better performance
const BrandMarquee = lazy(() => import("@/components/home/BrandMarquee"));
const AboutSection = lazy(() => import("@/components/home/AboutSection"));
const ServicesSection = lazy(() => import("@/components/home/ServicesSection"));
const WhyUsSection = lazy(() => import("@/components/home/WhyUsSection"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const GallerySection = lazy(() => import("@/components/home/GallerySection"));
const VideoSection = lazy(() => import("@/components/home/VideoSection"));


// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Kalangara Paint House | Premium Paints & Design in Alappuzha";

    // Handle hash scrolling with retry for lazy loaded components
    if (location.hash) {
      const scrollToElement = () => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      if (!scrollToElement()) {
        const interval = setInterval(() => {
          if (scrollToElement()) {
            clearInterval(interval);
          }
        }, 100);

        // Stop retrying after 3 seconds
        setTimeout(() => clearInterval(interval), 3000);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      {/* SEO: Single H1 in HeroSection, proper heading hierarchy throughout */}
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={<SectionLoader />}>
          <BrandMarquee />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ServicesSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <AboutSection />
        </Suspense>
        {/* <Suspense fallback={<SectionLoader />}>
          <WhyUsSection />
        </Suspense> */}
        <Suspense fallback={<SectionLoader />}>
          <GallerySection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <VideoSection />
        </Suspense>

        {/* <Suspense fallback={<SectionLoader />}>
          <TestimonialsSection />
        </Suspense> */}
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
