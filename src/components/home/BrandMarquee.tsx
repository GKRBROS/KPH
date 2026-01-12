const BrandMarquee = () => {
    const brands = [
        { name: "Asian Paints", logo: "/icons/asian-paints.png" },
        { name: "Berger Paints", logo: "/icons/berger-paints-seeklogo.png" },
        { name: "Birla Opus", logo: "/icons/birla-opus-paints-seeklogo.png" },
        { name: "JSW Paints", logo: "/icons/jsw-paints-seeklogo.png" },
        { name: "Esdee Paints", logo: "/icons/esdee-paints-seeklogo.png" },
        { name: "Indigo Paints", logo: "/icons/indigo-paints-seeklogo.png" },
        { name: "Birla White", logo: "/icons/birla-white-seeklogo.png" },
        { name: "Grass Hopper", logo: "/icons/grass-hopper-paints.png" },
        { name: "Sheenlac Paints", logo: "/icons/sheenlac-whiteLogo.png" },
    ];

    // Double the brands to create seamless loop
    const marqueeBrands = [...brands, ...brands, ...brands]; // Triple for smoother long scrolling

    return (
        <div className="py-6 bg-background border-y border-border overflow-hidden relative group">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

            <div className="flex whitespace-nowrap animate-marquee">
                {marqueeBrands.map((brand, index) => (
                    <div
                        key={`${brand.name}-${index}`}
                        className="flex items-center justify-center px-12 h-16"
                    >
                        <img
                            src={brand.logo}
                            alt={brand.name}
                            loading="lazy"
                            className="h-full w-auto object-contain max-w-[180px]"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrandMarquee;
