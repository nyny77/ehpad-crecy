import type { Metadata } from "next";
import Link from "next/link";
import { EHPAD_INFO } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Accessibilité | EHPAD de Crécy-la-Chapelle",
  description: "Déclaration d’accessibilité et résultats de l’audit RGAA 2026 de l’EHPAD de Crécy-la-Chapelle.",
};

export default function AccessibilitePage() {
  return (
    <main className="min-h-screen bg-cream-100 pt-32 md:pt-40">
      <section className="section-padding">
        <div className="container-custom max-w-4xl space-y-8">
          <header><h1 className="font-serif text-4xl font-bold text-charcoal-900 md:text-5xl">Accessibilité du site</h1></header>

          <section className="rounded-2xl bg-white p-8 shadow-soft">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-charcoal-900">Déclaration d’accessibilité</h2>
            <p className="text-charcoal-600">L’<strong>EHPAD de Crécy-la-Chapelle</strong> s’engage à rendre son site internet accessible conformément à l’article 47 de la loi n° 2005-102 du 11 février 2005. Cette déclaration s’applique au site <strong>ehpadcrecy.netlify.app</strong>.</p>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-soft">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-charcoal-900">État de conformité</h2>
            <div className="rounded-r-lg border-l-4 border-forest-500 bg-forest-50 p-4">
              <p className="text-charcoal-700">Le site est <strong>totalement conforme au RGAA 4.1.2</strong>. Le taux de conformité est de <strong>100 %</strong> : 84 critères respectés sur 84 critères applicables.</p>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-soft">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-charcoal-900">Résultat des tests</h2>
            <p className="mb-4 text-charcoal-600">L’audit interne a été réalisé le 16 août 2026 sur un échantillon représentatif du site avec le référentiel RGAA 4.1.2.</p>
            <ul className="list-disc space-y-2 pl-6 text-charcoal-600">
              <li>84 critères applicables et 84 critères respectés.</li>
              <li>Navigation au clavier, parcours public et administration authentifiée avec NVDA sous Windows validés par l’utilisateur.</li>
              <li>Zoom navigateur à 200 % et 400 % validé par l’utilisateur.</li>
              <li>40 pages HTML générées analysées : aucune anomalie structurelle détectée.</li>
              <li>Livret d’accueil PDF vérifié ; alternative HTML publiée pour la Gazette image.</li>
              <li>Vidéo locale sous-titrée et transcrite ; sous-titrage du reportage Facebook vérifié.</li>
            </ul>
            <Link href="/accessibilite/rapport-audit-2026" className="mt-6 inline-flex rounded-full bg-charcoal-900 px-6 py-3 font-semibold text-white hover:bg-charcoal-700">Consulter le rapport d’audit détaillé</Link>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-soft">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-charcoal-900">Contenus non accessibles</h2>
            <p className="text-charcoal-600">Aucun contenu non accessible n’a été relevé dans l’échantillon audité. Tout nouveau contenu fera l’objet des mêmes contrôles avant publication.</p>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-soft">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-charcoal-900">Technologies et outils utilisés</h2>
            <p className="text-charcoal-600">HTML5, CSS3, JavaScript, React, Next.js et Tailwind CSS. Contrôles avec NVDA sous Windows, zoom navigateur, ESLint, TypeScript, tests Node, lxml, pypdf, PyMuPDF et ffprobe.</p>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-soft">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-charcoal-900">Stratégie et plan d’action</h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Link href="/accessibilite/schema-pluriannuel" className="inline-flex justify-center rounded-full bg-charcoal-900 px-6 py-3 font-semibold text-white hover:bg-charcoal-700">Schéma pluriannuel 2026-2028</Link>
              <Link href="/accessibilite/plan-annuel-2026" className="inline-flex justify-center rounded-full border-2 border-terracotta-500 px-6 py-3 font-semibold text-terracotta-700 hover:bg-terracotta-50">Plan d’action 2026</Link>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-soft">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-charcoal-900">Retour d’information et contact</h2>
            <p className="mb-4 text-charcoal-600">Si vous n’arrivez pas à accéder à un contenu ou un service, contactez-nous afin d’obtenir une alternative accessible.</p>
            <address className="not-italic text-charcoal-600"><strong className="text-charcoal-700">EHPAD de Crécy-la-Chapelle</strong><br />{EHPAD_INFO.address.full}<br />Téléphone : <a href={`tel:${EHPAD_INFO.phone.replace(/\s/g, "")}`} className="text-terracotta-600 hover:underline">{EHPAD_INFO.phone}</a><br />Email : <a href={`mailto:${EHPAD_INFO.email}`} className="text-terracotta-600 hover:underline">{EHPAD_INFO.email}</a></address>
          </section>

          <section className="rounded-2xl bg-white p-8 shadow-soft">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-charcoal-900">Voie de recours</h2>
            <p className="mb-4 text-charcoal-600">Si vous constatez un défaut d’accessibilité, que vous nous le signalez et que vous n’obtenez pas de réponse satisfaisante, vous pouvez saisir le Défenseur des droits.</p>
            <a href="https://formulaire.defenseurdesdroits.fr/" target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-charcoal-800 px-6 py-3 font-semibold text-white hover:bg-charcoal-700">Contacter le Défenseur des droits</a>
          </section>

          <p className="text-center text-sm text-charcoal-500">Déclaration établie le 3 février 2026 et mise à jour le 16 août 2026.</p>
        </div>
      </section>
    </main>
  );
}
