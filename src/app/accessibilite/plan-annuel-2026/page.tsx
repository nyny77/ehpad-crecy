import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Plan annuel d’accessibilité 2026 | EHPAD de Crécy",
  description: "Actions d’accessibilité numérique prévues et réalisées en 2026 par l’EHPAD de Crécy-la-Chapelle.",
  alternates: {
    canonical: "/accessibilite/plan-annuel-2026",
  },
};

const actions = [
  ["Lien d’évitement et structure principale des pages", "Terminé"],
  ["Navigation clavier des menus, galeries et fenêtres", "En cours"],
  ["Accessibilité du simulateur tarifaire et de la FAQ", "Premier correctif terminé"],
  ["Premier correctif des formulaires Contact, Recrutement, Inscription et Postier", "Terminé"],
  ["Recette exhaustive des formulaires et messages d’erreur", "À réaliser"],
  ["Galerie photographique", "Description globale publiée ; images illustratives ignorées par les lecteurs d’écran"],
  ["Sous-titres et transcription de la vidéo locale", "Terminé"],
  ["Contrôle du reportage vidéo Facebook", "Sous-titrage vérifié le 16 août 2026"],
  ["Livret d’accueil PDF balisé", "Vérifié"],
  ["Alternative HTML de la Gazette janvier 2026", "Publiée"],
  ["Premier parcours utilisateur avec NVDA", "Réussi le 16 août 2026"],
  ["Contrôles utilisateur du zoom à 200 % et 400 %", "Réussis le 16 août 2026"],
  ["Recette NVDA publique et administration authentifiée", "Terminée le 16 août 2026"],
  ["Test VoiceOver sur Safari", "Amélioration continue"],
  ["Calcul du taux RGAA et publication du rapport", "Terminé — 100 %"],
] as const;

export default function PlanAnnuelPage() {
  return (
    <main className="pt-32 md:pt-40 min-h-screen bg-cream-100">
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: "/" },
          { name: "Accessibilité", url: "/accessibilite" },
          { name: "Plan annuel 2026", url: "/accessibilite/plan-annuel-2026" },
        ]}
      />
      <section className="section-padding">
        <div className="container-custom max-w-4xl space-y-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-terracotta-600">Accessibilité numérique</p>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl font-bold text-charcoal-900">Plan d’action 2026</h1>
            <p className="mt-4 text-lg text-charcoal-600">Dernière mise à jour : 16 août 2026.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white shadow-soft">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">État des actions d’accessibilité numérique pour 2026</caption>
              <thead className="bg-charcoal-900 text-white">
                <tr>
                  <th scope="col" className="p-4">Action</th>
                  <th scope="col" className="p-4">État</th>
                </tr>
              </thead>
              <tbody>
                {actions.map(([action, status]) => (
                  <tr key={action} className="border-b border-cream-200 last:border-0">
                    <th scope="row" className="p-4 font-medium text-charcoal-900">{action}</th>
                    <td className="p-4 text-charcoal-700">{status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link href="/accessibilite" className="inline-flex font-semibold text-terracotta-700 hover:underline">← Retour à la déclaration d’accessibilité</Link>
        </div>
      </section>
    </main>
  );
}
