import { useState, useEffect } from "react";
import { Menu, X, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";


interface HeaderProps {
  forceWhite?: boolean;
}

const Header = ({ forceWhite = false }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#why-us" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Gallery", href: "#gallery" },

    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToSection(href);
    setIsMobileMenuOpen(false);
  };

  const handleContactClick = () => {
    scrollToSection('#contact');
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen || forceWhite
        ? "bg-white shadow-soft py-0.5"
        : "bg-transparent py-2"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between relative">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')}>
              <img
                src="/icons/icon.png"
                alt="KPH Logo"
                className={`transition-all duration-300 object-contain cursor-pointer ${isScrolled ? "w-14 h-14" : "w-16 h-16"}`}
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Contact Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+914772212217" className="flex items-center gap-2 text-primary font-bold">
              <Phone className="w-4 h-4" />
              <span className="text-sm">+91 477 2212217</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-border">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-body text-lg font-medium text-foreground/80 py-3 border-b border-border/50 active:text-primary transition-colors"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-4">
              <a href="tel:+914772212217" className="flex items-center gap-2 text-primary font-bold">
                <Phone className="w-5 h-5" />
                <span>+91 477 2212217</span>
              </a>
              <Button
                className="w-full bg-primary py-6 rounded-xl"
                onClick={handleContactClick}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

