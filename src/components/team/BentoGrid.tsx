"use client";

import ServiceCard from "./ServiceCard";
import { SERVICES } from "@/lib/constants";

export default function BentoGrid() {
    // Configuration "Tetris" pour 10 cartes
    // 0: La soignante (Large)
    // 1: L'infirmière (Vertical)
    // 2: Animatrice (Small)
    // 3: Cuisinier (Small)
    // 4: Coiffeuse (Horizontal)
    // 5: Kiné (Small)
    // 6: Lingère (Small)
    // 7: Admin (Vertical)
    // 8: Technicien (Large)
    // 9: Hôtelier (Vertical)

    const getSize = (index: number): "small" | "large" | "horizontal" | "vertical" => {
        const sizes: Record<number, "small" | "large" | "horizontal" | "vertical"> = {
            0: "large",
            1: "vertical",
            2: "small",
            3: "small",
            4: "horizontal",
            5: "small",
            6: "small",
            7: "vertical",
            8: "large",
            9: "vertical",
            10: "small", // RH
            11: "large", // Direction
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
                    description={service.description}
                    image={service.image}
                    index={index}
                    size={getSize(index)}
                />
            ))}
        </div>
    );
}
