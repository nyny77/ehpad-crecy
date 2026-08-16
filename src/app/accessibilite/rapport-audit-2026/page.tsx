import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rapport d’audit RGAA 2026 | EHPAD de Crécy",
  description: "Résultats détaillés de l’audit interne RGAA 4.1.2 du site de l’EHPAD de Crécy-la-Chapelle.",
};

const results = [
  ["1. Images", 5, 5],
  ["2. Cadres", 2, 2],
  ["3. Couleurs", 3, 3],
  ["4. Multimédia", 9, 9],
  ["5. Tableaux", 4, 4],
  ["6. Liens", 2, 2],
  ["7. Scripts", 5, 5],
  ["8. Éléments obligatoires", 7, 7],
  ["9. Structuration", 4, 4],
  ["10. Présentation", 14, 14],
  ["11. Formulaires", 12, 12],
  ["12. Navigation", 8, 8],
  ["13. Consultation", 9, 9],
] as const;

const sample = [
  "Accueil", "Admissions et simulateur tarifaire", "Contact et formulaire", "Hébergement", "Animation",
  "Blog et lecture d’article", "Galerie et visionneuse", "Petit Écho du Cœur et sa version accessible",
  "Histoire et vidéos", "Postier numérique", "Authentification et inscription", "Recrutement",
  "Équipe et une fiche service", "Visite", "Déclaration d’accessibilité", "Mentions légales",
  "Livret d’accueil PDF",
] as const;

export default function RapportAuditPage() {
  return (
    <main className="min-h-screen bg-cream-100 pt-32 pb-20">
      <article className="container-custom max-w-5xl px-4 space-y-8">
        <header className="rounded-3xl bg-white p-7 shadow-soft md:p-10">
          <p className="font-bold uppercase tracking-wider text-terracotta-600">Audit interne — RGAA 4.1.2</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-charcoal-900 md:text-5xl">Rapport d’audit d’accessibilité 2026</h1>
          <p className="mt-5 text-xl text-charcoal-700"><strong>Résultat : 100 %</strong> — 84 critères respectés sur 84 critères applicables.</p>
          <p className="mt-3 text-charcoal-600">État déclaré : totalement conforme. Audit interne clôturé le 16 août 2026.</p>
        </header>

        <section className="rounded-3xl bg-white p-7 shadow-soft md:p-10">
          <h2 className="font-serif text-3xl font-bold text-charcoal-900">Résultats par thématique</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Nombre de critères RGAA applicables et respectés pour chaque thématique</caption>
              <thead><tr className="border-b-2 border-charcoal-900"><th scope="col" className="p-3">Thématique</th><th scope="col" className="p-3">Applicables</th><th scope="col" className="p-3">Respectés</th></tr></thead>
              <tbody>{results.map(([theme, applicable, passed]) => <tr key={theme} className="border-b border-cream-300"><th scope="row" className="p-3 font-semibold text-charcoal-900">{theme}</th><td className="p-3">{applicable}</td><td className="p-3">{passed}</td></tr>)}</tbody>
              <tfoot><tr className="font-bold"><th scope="row" className="p-3">Total</th><td className="p-3">84</td><td className="p-3">84</td></tr></tfoot>
            </table>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-7 shadow-soft md:p-10">
          <h2 className="font-serif text-3xl font-bold text-charcoal-900">Corrections de clôture</h2>
          <ul className="mt-6 list-disc space-y-3 pl-6 text-charcoal-700">
            <li><strong>Images :</strong> la galerie de souvenirs est déclarée illustrative, décrite globalement et ses images sont ignorées par les lecteurs d’écran.</li>
            <li><strong>Couleurs :</strong> les teintes de texte, bordures, états et indicateurs de focus ont été corrigées et couvertes par des tests de contraste automatisés.</li>
            <li><strong>Multimédia :</strong> le lecteur tiers a été retiré ; la vidéo locale possède des commandes natives, des sous-titres français et une transcription adjacente.</li>
            <li><strong>Scripts :</strong> la navigation publique et les interfaces d’administration authentifiées ont été validées avec NVDA.</li>
          </ul>
        </section>

        <section className="rounded-3xl bg-white p-7 shadow-soft md:p-10">
          <h2 className="font-serif text-3xl font-bold text-charcoal-900">Échantillon audité</h2>
          <ul className="mt-6 grid gap-2 pl-6 text-charcoal-700 sm:grid-cols-2 list-disc">{sample.map((page) => <li key={page}>{page}</li>)}</ul>
        </section>

        <section className="rounded-3xl bg-white p-7 shadow-soft md:p-10">
          <h2 className="font-serif text-3xl font-bold text-charcoal-900">Méthode et environnement</h2>
          <ul className="mt-6 list-disc space-y-2 pl-6 text-charcoal-700">
            <li>Contrôle des critères RGAA 4.1.2 applicables sur l’échantillon représentatif.</li>
            <li>Navigation clavier, parcours public et administration authentifiée avec NVDA sur Windows validés par l’utilisateur ; version du navigateur non consignée.</li>
            <li>Zoom navigateur à 200 % et 400 % validé par l’utilisateur.</li>
            <li>Analyse du HTML généré sur 40 pages, administration comprise : langue, titres, régions principales, images, cadres, commandes, formulaires, tableaux et identifiants ; aucune anomalie relevée.</li>
            <li>Outils : ESLint, TypeScript, tests Node, lxml, pypdf, PyMuPDF, ffprobe et transcription locale.</li>
          </ul>
        </section>

        <nav aria-label="Documents d’accessibilité" className="flex flex-col gap-4 sm:flex-row">
          <Link href="/accessibilite" className="inline-flex justify-center rounded-full bg-charcoal-900 px-6 py-3 font-semibold text-white hover:bg-charcoal-700">Retour à la déclaration</Link>
          <Link href="/accessibilite/plan-annuel-2026" className="inline-flex justify-center rounded-full border-2 border-terracotta-600 px-6 py-3 font-semibold text-terracotta-600">Consulter le plan d’action</Link>
        </nav>
      </article>
    </main>
  );
}
