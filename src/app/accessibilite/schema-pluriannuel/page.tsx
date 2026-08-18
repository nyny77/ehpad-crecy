import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Schéma pluriannuel d’accessibilité 2026-2028 | EHPAD de Crécy",
  description: "Stratégie pluriannuelle de mise en accessibilité numérique de l’EHPAD de Crécy-la-Chapelle.",
  alternates: {
    canonical: "/accessibilite/schema-pluriannuel",
  },
};

export default function SchemaPluriannuelPage() {
  return (
    <main className="pt-32 md:pt-40 min-h-screen bg-cream-100">
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: "/" },
          { name: "Accessibilité", url: "/accessibilite" },
          { name: "Schéma pluriannuel", url: "/accessibilite/schema-pluriannuel" },
        ]}
      />
      <section className="section-padding">
        <div className="container-custom max-w-4xl space-y-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-terracotta-600">Accessibilité numérique</p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-bold text-charcoal-900">Schéma pluriannuel 2026-2028</h1>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-soft space-y-4 text-charcoal-700">
            <h2 className="font-serif text-2xl font-semibold text-charcoal-900">Engagement</h2>
            <p>L’EHPAD de Crécy-la-Chapelle souhaite rendre ses services numériques utilisables par toutes et tous, notamment par les personnes en situation de handicap.</p>
            <p>La stratégie repose sur un audit représentatif, des corrections progressives, des tests réguliers et la formation des personnes qui publient les contenus.</p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-soft">
            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-5">Programme</h2>
            <div className="space-y-6">
              <section>
                <h3 className="font-bold text-lg text-charcoal-900">2026 — Mesurer et corriger les parcours essentiels</h3>
                <ul className="mt-2 list-disc pl-6 space-y-2 text-charcoal-700">
                  <li>audit RGAA d’un échantillon représentatif ;</li>
                  <li>correction de la navigation, des formulaires, du Postier et du simulateur tarifaire ;</li>
                  <li>tests clavier et premières vérifications avec lecteur d’écran ;</li>
                  <li>publication du taux et de la déclaration mise à jour.</li>
                </ul>
              </section>
              <section>
                <h3 className="font-bold text-lg text-charcoal-900">2027 — Étendre la conformité</h3>
                <ul className="mt-2 list-disc pl-6 space-y-2 text-charcoal-700">
                  <li>traitement des médias, PDF, archives et composants secondaires ;</li>
                  <li>formation des contributeurs aux textes alternatifs et contenus accessibles ;</li>
                  <li>tests utilisateurs et contre-audit.</li>
                </ul>
              </section>
              <section>
                <h3 className="font-bold text-lg text-charcoal-900">2028 — Maintenir dans la durée</h3>
                <ul className="mt-2 list-disc pl-6 space-y-2 text-charcoal-700">
                  <li>nouvel audit ou mise à jour selon l’évolution du référentiel ;</li>
                  <li>contrôles avant chaque nouvelle fonctionnalité ;</li>
                  <li>bilan public et nouveau schéma pluriannuel.</li>
                </ul>
              </section>
            </div>
          </div>

          <Link href="/accessibilite" className="inline-flex font-semibold text-terracotta-700 hover:underline">← Retour à la déclaration d’accessibilité</Link>
        </div>
      </section>
    </main>
  );
}
