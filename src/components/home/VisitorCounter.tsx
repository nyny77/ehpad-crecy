"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { Users, Eye } from "lucide-react";

// Animation component to count up to a number
function AnimatedCounter({ value }: { value: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const duration = 2000; // 2 seconds
            const increment = value / (duration / 16); // 60fps

            const timer = setInterval(() => {
                start += increment;
                if (start >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return <span ref={ref}>{count.toLocaleString('fr-FR')}</span>;
}

export default function VisitorCounter() {
    const [visits, setVisits] = useState(4821);
    const [uniqueVisits, setUniqueVisits] = useState(1542);

    useEffect(() => {
        // Use a base number + simulated visits from local storage for reliability
        const storedVisits = localStorage.getItem("ehpad_visits") || "0";
        const hasVisited = localStorage.getItem("ehpad_has_visited");

        let currentVisits = parseInt(storedVisits, 10);
        let isNewUnique = !hasVisited;

        if (isNewUnique) {
            localStorage.setItem("ehpad_has_visited", "true");
        }

        currentVisits += 1;
        localStorage.setItem("ehpad_visits", currentVisits.toString());

        setVisits(4821 + currentVisits);
        setUniqueVisits(1542 + (isNewUnique ? 1 : 0));
    }, []);

    return (
        <section className="py-12 bg-cream-100 relative overflow-hidden">
            <div className="container-custom px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12"
                >
                    {/* Unique Visitors */}
                    <div className="flex w-full sm:w-auto items-center gap-4 bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-white/50 group hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-terracotta-100 text-terracotta-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-charcoal-500 font-medium uppercase tracking-wider">Visiteurs uniques</p>
                            <p className="text-3xl font-bold text-charcoal-900 font-serif">
                                <AnimatedCounter value={uniqueVisits} />
                            </p>
                        </div>
                    </div>

                    {/* Total Visits */}
                    <div className="flex w-full sm:w-auto items-center gap-4 bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-white/50 group hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-sage-100 text-sage-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                            <Eye className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-charcoal-500 font-medium uppercase tracking-wider">Vues totales</p>
                            <p className="text-3xl font-bold text-charcoal-900 font-serif">
                                <AnimatedCounter value={visits} />
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
