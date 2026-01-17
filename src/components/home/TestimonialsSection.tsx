import { Star, MessageSquare, Quote, ArrowRight } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Thomas Joseph",
      location: "Edathua",
      image: " https://i.pravatar.cc/150?u=thomas",
      rating: 5,
      message:
        "Tomychen’s Kalangara Paint House provided excellent service. They helped me choose the perfect shade for my new home. The quality of Asian Paints they supplied is top-notch.",
    },
    {
      id: 2,
      name: "Sarah Kurian",
      location: "Alappuzha",
      image: " https://i.pravatar.cc/150?u=sarah",
      rating: 5,
      message:
        "Best pricing in the area! I saved significantly on my Berger Paints purchase. The staff is very knowledgeable and helpful. They recommended the perfect painting crew.",
    },
    {
      id: 3,
      name: "Mathew Varghese",
      location: "Changanassery",
      image: " https://i.pravatar.cc/150?u=mathew",
      rating: 5,
      message:
        "Highly professional and reliable. They are the authorized dealers for all major brands, so you can trust the authenticity. Worth every rupee for the peace of mind.",
    }
  ];

  return (
    <section id="testimonials" className="py-12 bg-slate-50 relative overflow-hidden">
      {/* Texture Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-70 pointer-events-none" />

      {/* Soft Gradient Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-100/40 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />

      <div className="container mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm text-slate-800 font-bold text-xs uppercase tracking-widest">
            <MessageSquare className="w-3 h-3 text-orange-500" />
            Client Chronicles
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Trusted by the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">Best in Town.</span>
          </h2>
          <p className="text-slate-500 text-lg font-light max-w-xl mx-auto">
            See why homeowners and contractors across Alappuzha prefer KPH for their dream projects.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white p-8 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 border border-slate-100 overflow-hidden"
            >
              {/* Top Gradient Bar (Hidden by default, reveals on hover) */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {/* Quote Icon */}
              <div className="absolute top-8 right-8 text-slate-100 group-hover:text-orange-50 transition-colors duration-300">
                <Quote size={64} fill="currentColor" stroke="none" />
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-6">

                {/* User Profile */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 overflow-hidden shadow-md ring-2 ring-white group-hover:ring-orange-200 transition-all">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" width="64" height="64" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {item.location}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-orange-400 fill-orange-400 drop-shadow-sm"
                    />
                  ))}
                </div>

                {/* Message */}
                <p className="text-slate-600 leading-relaxed font-light text-[15px] italic">
                  "{item.message}"
                </p>

                {/* 'Read Story' Link */}
                <div className="pt-2 flex items-center gap-2 text-sm font-bold text-slate-900 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  Read full story <ArrowRight className="w-4 h-4" />
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
