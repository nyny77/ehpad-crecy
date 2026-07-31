"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Eye } from "lucide-react";

export default function VisitorCounter() {
    const [visits, setVisits] = useState<number | null>(null);
    const [uniqueVisits, setUniqueVisits] = useState<number | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const fetchCounters = async () => {
            try {
                // Check if this user is unique
                const hasVisited = localStorage.getItem("ehpad_has_visited");

                if (!hasVisited) {
                    // It's a new unique visitor
                    localStorage.setItem("ehpad_has_visited", "true");

                    // Increment unique visits
                    const uniqueRes = await fetch("https://api.counterapi.dev/v1/ehpadcrecy/unique_visits/up");
                    const uniqueData = await uniqueRes.json();
                    setUniqueVisits(uniqueData.count);
                } else {
                    // Just get the current unique visits count without incrementing
                    const uniqueRes = await fetch("https://api.counterapi.dev/v1/ehpadcrecy/unique_visits");
                    const uniqueData = await uniqueRes.json();
                    setUniqueVisits(uniqueData.count);
                }

                // Always increment total visits
                const visitsRes = await fetch("https://api.counterapi.dev/v1/ehpadcrecy/visits/up");
                const visitsData = await visitsRes.json();
                setVisits(visitsData.count);
                
                setHasLoaded(true);
            } catch (error) {
                console.error("Erreur lors du chargement des compteurs", error);
            }
        };

        fetchCounters();
    }, []);

    if (!hasLoaded) return null;

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
                                {uniqueVisits !== null ? uniqueVisits.toLocaleString('fr-FR') : "..."}
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
                                {visits !== null ? visits.toLocaleString('fr-FR') : "..."}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
