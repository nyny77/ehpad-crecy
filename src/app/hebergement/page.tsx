import type { Metadata } from "next";
import Link from "next/link";
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
            <section className="bg-cream-100 px-4 pb-8 pt-28 sm:pb-10 sm:pt-32" aria-labelledby="hebergement-title">
                <div className="container-custom text-center">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-terracotta-600">
                        Hébergement, tarifs et aides
                    </p>
                    <h1 id="hebergement-title" className="font-serif text-4xl font-bold leading-tight text-charcoal-900 sm:text-5xl">
                        Tarifs et aides
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-charcoal-700 sm:text-lg">
                        Découvrez nos chambres, estimez simplement votre reste à charge et retrouvez les aides financières disponibles.
                    </p>
                    <nav className="mt-6 flex flex-col items-stretch justify-center gap-3 min-[380px]:flex-row" aria-label="Accès rapides aux tarifs et aux aides">
                        <Link href="#tarifs" className="inline-flex min-h-12 items-center justify-center rounded-full bg-terracotta-600 px-6 py-3 font-bold text-white shadow-md transition-colors hover:bg-terracotta-700">
                            Estimer mon tarif
                        </Link>
                        <Link href="/admissions#aides-financieres" className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-forest-600 bg-white px-6 py-3 font-bold text-forest-700 transition-colors hover:bg-forest-50">
                            Voir les aides
                        </Link>
                    </nav>
                </div>
            </section>
            <HebergementClient />
        </main>
    );
}
