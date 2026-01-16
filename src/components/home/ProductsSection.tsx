import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

// Real products data based on user input
const realProducts = [
  {
    id: 1,
    title: "Asian Paints Ultima Protech",
    description: "Premium exterior paint with 10-year warranty. Ultimate protection against algal attacks.",
    image: "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?w=800&q=80",
    category: "Exterior",
  },
  {
    id: 2,
    title: "Asian Paints Apex Ultima",
    description: "High-performance exterior emulsion specially designed to withstand extreme weather conditions.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    category: "Exterior",
  },
  {
    id: 3,
    title: "Berger All Guard",
    description: "Superior exterior emulsion with silicon technology for long-lasting protection.",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80",
    category: "Exterior",
  },
  {
    id: 4,
    title: "Berger Long Life",
    description: "Advanced exterior paint with a 7-year performance warranty.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    category: "Exterior",
  },
  {
    id: 5,
    title: "SmartCare Damp Proof",
    description: "Advanced waterproofing solution. Single solution for summer heat and monsoon leaks.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80",
    category: "Waterproofing",
  },
  {
    id: 6,
    title: "JSW Any Colour One Price",
    description: "Innovative pricing model: Choose any color for your home at a single price point.",
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80",
    category: "Interior",
  },
];

const categories = ["All", "Exterior", "Interior", "Waterproofing"];

const ProductsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = activeCategory === "All"
    ? realProducts
    : realProducts.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-none bg-slate-100 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-6 border-l-2 border-primary">
            Our Collection
          </span>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-[0.9]">
            Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-400">Products</span>
          </h2>
          <p className="font-medium text-slate-500 max-w-xl mx-auto">
            From 10-year warranty finishes to advanced waterproofing, we stock the best brands in the industry.
          </p>

          {/* Brand List */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-10 opacity-70">
            {["Asian Paints", "Berger", "JSW Paints", "Indigo", "Birla Opus", "Dr. Fixit", "MRF Vapocure", "Esdee", "Maxel", "Birla White"].map((brand) => (
              <span key={brand} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${activeCategory === category
                ? "bg-black text-white border-black shadow-lg"
                : "bg-white text-slate-500 border-slate-200 hover:border-black hover:text-black"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white border border-slate-100 hover:border-slate-300 transition-all duration-500 hover:shadow-2xl"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 grayscale-[0.1] group-hover:grayscale-0"
                  loading="lazy"
                />

                <span className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest">
                  {product.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="font-heading text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors uppercase tracking-tight">
                  {product.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
                  {product.description}
                </p>
                <button
                  onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 group/btn"
                >
                  Enquire Now
                  <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProductsSection;
