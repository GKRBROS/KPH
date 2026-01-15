import { lazy, Suspense, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

// Lazy load heavy sections for better performance
const BrandMarquee = lazy(() => import("@/components/home/BrandMarquee"));
const AboutSection = lazy(() => import("@/components/home/AboutSection"));
const WhyUsSection = lazy(() => import("@/components/home/WhyUsSection"));
const TestimonialsSection = lazy(() => import("@/components/home/TestimonialsSection"));
const GallerySection = lazy(() => import("@/components/home/GallerySection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  useEffect(() => {
    document.title = "Kalangara Paint House | Premium Paints & Design in Alappuzha";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* SEO: Single H1 in HeroSection, proper heading hierarchy throughout */}
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={<SectionLoader />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <BrandMarquee />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <WhyUsSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <GallerySection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <CTASection />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
