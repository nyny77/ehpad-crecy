"use client";

import { motion } from "framer-motion";
import Image from "@/components/ui/OptimizedImage";

// Photos d'exemple pour la galerie
const galleryItems = [
    {
        id: 1,
        title: "Atelier peinture",
        date: "15 janvier 2026",
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=400",
        height: "h-64",
    },
    {
        id: 2,
        title: "Fête des rois",
        date: "6 janvier 2026",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400",
        height: "h-80",
    },
    {
        id: 3,
        title: "Spectacle de Noël",
        date: "20 décembre 2025",
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=400",
        height: "h-72",
    },
    {
        id: 4,
        title: "Gymnastique douce",
        date: "12 janvier 2026",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400",
        height: "h-56",
    },
    {
        id: 5,
        title: "Visite des écoliers",
        date: "10 janvier 2026",
        image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=400",
        height: "h-72",
    },
    {
        id: 6,
        title: "Atelier jardinage",
        date: "8 janvier 2026",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=400",
        height: "h-64",
    },
    {
        id: 7,
        title: "Concert de jazz",
        date: "5 janvier 2026",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400",
        height: "h-80",
    },
    {
        id: 8,
        title: "Atelier cuisine",
        date: "3 janvier 2026",
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400",
        height: "h-56",
    },
];

export default function MasonryGallery() {
    // Diviser les items en 3 colonnes
    const columns = [
        galleryItems.filter((_, i) => i % 3 === 0),
        galleryItems.filter((_, i) => i % 3 === 1),
        galleryItems.filter((_, i) => i % 3 === 2),
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {columns.map((column, columnIndex) => (
                <div key={columnIndex} className="flex flex-col gap-4 md:gap-6">
                    {column.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div
                                className={`relative ${item.height} rounded-2xl overflow-hidden card-warm cursor-pointer`}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Contenu */}
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="font-serif text-lg font-semibold text-white mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-cream-200">{item.date}</p>
                                </div>

                                {/* Badge date (toujours visible) */}
                                <div className="absolute top-4 left-4">
                                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-charcoal-700">
                                        {item.date}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ))}
        </div>
    );
}
