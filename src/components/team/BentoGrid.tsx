"use client";

import ServiceCard from "./ServiceCard";
import { SERVICES_EXTENDED as SERVICES } from "@/lib/services-data";

export default function BentoGrid() {
    // Configuration "Tetris" optimisée pour 16 tuiles
    // Layout équilibré: 2 large + 3 horizontal + 3 vertical + 8 small = 28 cells (7 rows)

    const getSize = (index: number): "small" | "large" | "horizontal" | "vertical" => {
        const sizes: Record<number, "small" | "large" | "horizontal" | "vertical"> = {
            0: "large",       // Soignante - tuile principale
            1: "vertical",    // Infirmière
            2: "small",       // Animatrice
            3: "small",       // Cuisinier
            4: "horizontal",  // Coiffeuse
            5: "small",       // Kiné
            6: "small",       // Lingère
            7: "vertical",    // Admin
            8: "horizontal",  // Technicien
            9: "vertical",    // Hôtelier
            10: "small",      // RH
            11: "large",      // Direction - tuile importante
            12: "horizontal", // Psychologue
            13: "small",      // IDEC
            14: "small",      // Médecins
            15: "small",      // Bénévoles
        };
        return sizes[index] || "small";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[300px] gap-4 md:gap-6 grid-flow-dense">
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
                />
            ))}
        </div>
    );
}
