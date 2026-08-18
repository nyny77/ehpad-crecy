import type { Metadata } from "next";
import HebergementClient from "./HebergementClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
    title: "Tarifs & Hébergement | EHPAD de Crécy-la-Chapelle - Seine-et-Marne",
    description: "Consultez les tarifs 2026 de l'EHPAD de Crécy-la-Chapelle (77). Chambres simples et doubles, aides financières (APA, APL, ASH). Établissement habilité aide sociale.",
    alternates: {
        canonical: "/hebergement",
    },
};

export default function HebergementPage() {
    return (
        <main>
            <BreadcrumbJsonLd
                items={[
                    { name: "Accueil", url: "/" },
                    { name: "Tarifs & Hébergement", url: "/hebergement" },
                ]}
            />
            <h1 className="sr-only">Hébergement et tarifs</h1>
            <HebergementClient />
        </main>
    );
}
