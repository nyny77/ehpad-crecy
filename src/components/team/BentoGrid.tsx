"use client";

import ServiceCard from "./ServiceCard";
import { SERVICES_EXTENDED as SERVICES } from "@/lib/services-data";

export default function BentoGrid() {
    // Configuration "Tetris" optimisée pour 16 tuiles
    // Layout équilibré: 2 large + 3 horizontal + 3 vertical + 8 small = 28 cells (7 rows)

    const getSize = (index: number): "small" | "large" | "horizontal" | "vertical" => {
        const sizes: Record<number, "small" | "large" | "horizontal" | "vertical"> = {
            0: "large",       // Direction (Photo) - tuile principale
            1: "vertical",    // IDEC (Photo)
            2: "horizontal",  // Animatrice (Photo)
            3: "vertical",    // Psychologue (Photo)
            4: "horizontal",  // Technique (Photo)
            5: "small",       // RH (Photo)
            6: "small",       // Lingerie (Photo)
            7: "vertical",    // Admin (Photo)
            8: "small",       // Cuisine (Photo)
            9: "small",       // Hotelier (Photo)
            10: "small",      // Soignante (Dessin)
            11: "large",      // Infirmiere (Dessin) - tuile importante bas
            12: "horizontal", // Bien-etre (Dessin)
            13: "small",      // Kine (Dessin)
            14: "small",      // Medecins (Dessin)
            15: "small",      // Benevoles (Dessin)
        };
        return sizes[index] || "small";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 auto-rows-[300px] gap-4 md:gap-6 grid-flow-dense">
            {SERVICES.map((service, index) => (
                <ServiceCard
                    key={service.id}
                    id={service.id}
                    title={service.title}
                    subtitle={service.subtitle}
                    description={service.shortDescription}
                    image={service.image}
                    index={index}
                    size={getSize(index)}
                    imagePosition={service.imagePosition}
                />
            ))}
        </div>
    );
}
