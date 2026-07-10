"use client";

import ServiceCard from "./ServiceCard";
import { SERVICES_EXTENDED as SERVICES } from "@/lib/services-data";

export default function BentoGrid() {
    // Configuration "Tetris" optimisée pour 16 tuiles
    // Layout équilibré: 2 large + 3 horizontal + 3 vertical + 8 small = 28 cells (7 rows)

    const getSize = (id: string): "small" | "large" | "horizontal" | "vertical" => {
        // Mapping sizes strictly based on their original index in SERVICES_EXTENDED
        const sizes: Record<string, "small" | "large" | "horizontal" | "vertical"> = {
            "direction": "large",       // original index 0
            "hotelier": "vertical",     // original index 1
            "animation": "horizontal",  // original index 2
            "psychologue": "vertical",  // original index 3
            "technique": "horizontal",  // original index 4
            "rh": "small",              // original index 5
            "lingerie": "small",        // original index 6
            "admin": "vertical",        // original index 7
            "cuisine": "small",         // original index 8
            "idec": "small",            // original index 9
            "soignants": "small",       // original index 10
            "infirmiere": "large",      // original index 11
            "bienetre": "horizontal",   // original index 12
            "kine": "vertical",         // new photo, made vertical
            "medecins": "small",        // original index 14
            "benevoles": "horizontal",  // changed to horizontal
        };
        return sizes[id] || "small";
    };

    const ORDER = [
        "direction",
        "hotelier",
        "animation",
        "psychologue",
        "technique",
        "rh",
        "lingerie",
        "admin",
        "cuisine",
        "idec",
        "benevoles",
        "kine",
        "soignants",
        "infirmiere",
        "bienetre",
        "medecins"
    ];

    const orderedServices = ORDER.map(id => SERVICES.find(s => s.id === id)).filter(Boolean) as typeof SERVICES;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 auto-rows-[300px] gap-4 md:gap-6 grid-flow-dense">
            {orderedServices.map((service, index) => (
                <ServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.title}
                    subtitle={service.subtitle}
                    description={service.shortDescription}
                    image={service.image}
                    index={index}
                    size={getSize(service.id)}
                    imagePosition={service.imagePosition}
                />
            ))}
        </div>
    );
}
