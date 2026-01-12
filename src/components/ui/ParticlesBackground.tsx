import { useEffect, useState } from 'react';

const ParticlesBackground = () => {
    const [particles, setParticles] = useState<Array<{ id: number; style: React.CSSProperties }>>([]);

    useEffect(() => {
        // Generate static particles on mount to avoid hydration mismatch
        const particleCount = 20;
        const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            style: {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`, // 5px to 15px
                height: `${Math.random() * 10 + 5}px`,
                animationDuration: `${Math.random() * 10 + 10}s`, // 10s to 20s
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.3 + 0.1, // 0.1 to 0.4
                willChange: 'transform',
            },
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-primary/30 blur-sm animate-float"
                    style={p.style}
                />
            ))}
        </div>
    );
};

export default ParticlesBackground;
