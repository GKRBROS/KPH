import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import BrandMarquee from "@/components/home/BrandMarquee";
import AboutSection from "@/components/home/AboutSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GallerySection from "@/components/home/GallerySection";
import CTASection from "@/components/home/CTASection";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";


import { useEffect } from "react";

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
        <AboutSection />
        <BrandMarquee />
        <WhyUsSection />
        <TestimonialsSection />
        <GallerySection />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
