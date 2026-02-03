"use client";

import { useRef, useState, MouseEvent } from "react";
import Image from "next/image";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { VALUES } from "@/lib/constants";
import WaveSeparator from "@/components/ui/WaveSeparator";

const iconMap: { [key: string]: React.ReactNode } = {
    heart: (
        <div className="relative w-full h-full">
            <Image
                src="/images/values/bienveillance.png"
                alt="Bienveillance"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    ),
    star: (
        <div className="relative w-full h-full">
            <Image
                src="/images/values/professionnalisme.png"
                alt="Professionnalisme"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    ),
    eye: (
        <div className="relative w-full h-full">
            <Image
                src="/images/values/transparence.png"
                alt="Transparence"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    ),
    users: (
        <div className="relative w-full h-full">
            <Image
                src="/images/values/vie-sociale.png"
                alt="Vie Sociale"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    ),
};

// Individual tiltable value card component - simplified structure
function ValueCard({ value, index }: { value: typeof VALUES[0], index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
            }}
            className="h-full cursor-pointer"
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="h-full"
            >
                <div className="relative group h-full">
                    {/* Animated Gradient Border (visible on hover) */}
                    <motion.div
                        className="absolute -inset-[2px] bg-gradient-to-r from-terracotta-500 via-forest-500 to-terracotta-500 rounded-[2rem] opacity-0 group-hover:opacity-100 blur-md transition duration-500 animate-gradient-x"
                    />

                    {/* Glass Card Content */}
                    <div
                        className={`relative h-full bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 flex flex-col items-center text-center transition-all duration-300 shadow-lg group-hover:shadow-2xl overflow-hidden`}
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* Internal Glow Effects */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta-300/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-forest-300/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                        <div
                            className="relative w-40 h-40 mb-6 transition-transform duration-300 z-10"
                            style={{
                                transform: isHovered ? "translateZ(40px) scale(1.1)" : "translateZ(0)",
                                transformStyle: "preserve-3d"
                            }}
                        >
                            {iconMap[value.icon]}
                        </div>
                        <h3
                            className="font-serif text-2xl font-bold text-charcoal-900 mb-3 z-10"
                            style={{
                                transform: isHovered ? "translateZ(25px)" : "translateZ(0)",
                            }}
                        >
                            {value.title}
                        </h3>
                        <p
                            className="text-charcoal-700 font-medium z-10"
                            style={{
                                transform: isHovered ? "translateZ(15px)" : "translateZ(0)",
                            }}
                        >
                            {value.description}
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function IntroSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="section-padding bg-cream-100 relative mt-0 pt-24 md:pt-32">
            {/* Wave top (transition from Hero) */}
            <WaveSeparator position="top" className="text-cream-100" />
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="inline-block text-terracotta-500 font-medium mb-4"
                    >
                        Ce qui nous définit
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal-900 mb-6"
                    >
                        Nos valeurs au quotidien
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-charcoal-600 max-w-2xl mx-auto"
                    >
                        Chaque jour, notre équipe s&apos;engage à offrir un accompagnement
                        personnalisé, dans le respect et la dignité de chaque résident.
                    </motion.p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {VALUES.map((value, index) => (
                        <ValueCard key={value.title} value={value} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
