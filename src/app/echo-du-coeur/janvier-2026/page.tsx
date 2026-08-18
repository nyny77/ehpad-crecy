import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Petit Écho du Cœur — Janvier 2026 | Version accessible",
  description: "Version textuelle accessible du Petit Écho du Cœur de janvier 2026, journal rédigé par les résidents de l’EHPAD de Crécy.",
  alternates: {
    canonical: "/echo-du-coeur/janvier-2026",
  },
};

const retrospective = [
  ["Janvier", "Première sortie de l’année et confection de galettes des rois avec les enfants du centre de loisirs de Crécy-la-Chapelle."],
  ["Vie de l’établissement", "Premier loto de l’année, repas partagés et réunion du Conseil de la vie sociale."],
  ["Ateliers et fêtes", "Atelier Saint-Valentin avec les agents du service civique, aquarelle les lundis après-midi, Chandeleur, gâteaux au chocolat, carnaval, curling et jeux en ville."],
  ["Sorties", "Visite à France Services, sorties au marché de Crécy-la-Chapelle, journées à thème, visite d’une galerie d’exposition, Intermarché et pique-niques d’été."],
  ["Rencontres", "Spectacle de clowns, repas champêtre avec la ville, rencontre avec la Grande Ourse et rencontres avec les élèves du collège Mon Plaisir."],
  ["Bien-être", "Jardinage, karaté adapté avec le club CKS de Crécy, réveil musculaire, danse assise et ateliers des sens."],
  ["Temps forts", "Fête de l’EHPAD sur le thème du cabaret, forum des associations, marché de Noël, Halloween, Beaujolais nouveau, fête du Nouvel An et arbre de Noël."],
  ["Vie associative", "Participation des bénévoles, chants avec Christelle Amand et spectacle offert par la Croix-Rouge."],
] as const;

const agenda = [
  ["Lundi 2 février à 10 h 30", "Comité des fêtes"],
  ["Lundi 2 février à 14 h 30", "Chandeleur et rencontre avec les élèves du collège"],
  ["Mercredi 4 février à 10 h", "Préparation de pâte à crêpes avec les enfants du centre de loisirs de Crécy"],
  ["Lundi 9 février à 14 h 30", "Resto du Cœur avec les collégiens à Intermarché"],
  ["Mardi 10 février à 10 h 30", "Conseil de la vie sociale"],
  ["Jeudi 12 février à 14 h 30", "Réunion avec les bénévoles"],
  ["Lundi 16 février à 11 h 30", "Repas à l’EHPAD avec les collégiens"],
  ["Mardi 17 février à 11 h", "Carnaval"],
  ["Mercredi 18 février à 14 h", "Jeux avec les enfants du centre de loisirs"],
  ["Jeudi 26 février à 14 h 30", "Anniversaires de février"],
  ["Vendredi 27 février à 15 h", "Messe"],
  ["Tous les lundis à 14 h 30, hors vacances scolaires", "Aquarelles avec Nicole"],
  ["Tous les lundis après-midi", "Visites individuelles par des bénévoles, sur inscription auprès de l’animatrice"],
  ["Tous les mardis à 14 h", "Karaté avec le club CKS de Crécy"],
  ["Tous les mercredis à 10 h 30", "Réveil musculaire et danse assise"],
  ["Un vendredi sur deux", "Diaporama"],
] as const;

export default function GazetteJanvier2026AccessiblePage() {
  return (
    <main className="min-h-screen bg-cream-100 pt-32 pb-20">
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: "/" },
          { name: "L’Écho du Cœur", url: "/echo-du-coeur" },
          { name: "Janvier 2026 (Accessible)", url: "/echo-du-coeur/janvier-2026" },
        ]}
      />
      <ArticleJsonLd
        article={{
          title: "Le Petit Écho du Cœur — janvier 2026",
          description: "Version textuelle accessible du Petit Écho du Cœur de janvier 2026.",
          datePublished: "2026-01-01T00:00:00+01:00",
          url: "/echo-du-coeur/janvier-2026",
        }}
      />
      <article className="container-custom max-w-4xl px-4">
        <header className="rounded-3xl bg-white p-7 shadow-soft md:p-10">
          <p className="font-bold uppercase tracking-wider text-terracotta-600">Version textuelle accessible</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-charcoal-900 md:text-5xl">Le Petit Écho du Cœur — janvier 2026</h1>
          <p className="mt-4 text-lg text-charcoal-700">Numéro 1 — journal rédigé par les résidents.</p>
          <p className="mt-4 text-charcoal-600">Cette page restitue les informations du PDF sous une forme structurée utilisable au clavier et avec un lecteur d’écran. Les photographies du numéro illustrent les activités décrites ci-dessous.</p>
        </header>

        <section className="mt-8 rounded-3xl bg-white p-7 shadow-soft md:p-10" aria-labelledby="retrospective-title">
          <h2 id="retrospective-title" className="font-serif text-3xl font-bold text-charcoal-900">L’année 2025 en images</h2>
          <ul className="mt-6 space-y-5">
            {retrospective.map(([title, description]) => (
              <li key={title}>
                <h3 className="text-xl font-bold text-charcoal-900">{title}</h3>
                <p className="mt-1 text-charcoal-700">{description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-3xl bg-white p-7 shadow-soft md:p-10" aria-labelledby="agenda-title">
          <h2 id="agenda-title" className="font-serif text-3xl font-bold text-charcoal-900">Agenda de février 2026</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Dates, horaires et activités de février 2026</caption>
              <thead>
                <tr className="border-b-2 border-charcoal-900">
                  <th scope="col" className="p-3">Date et heure</th>
                  <th scope="col" className="p-3">Activité</th>
                </tr>
              </thead>
              <tbody>
                {agenda.map(([date, activity]) => (
                  <tr key={`${date}-${activity}`} className="border-b border-cream-300">
                    <th scope="row" className="p-3 font-semibold text-charcoal-900">{date}</th>
                    <td className="p-3 text-charcoal-700">{activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border-l-4 border-terracotta-600 bg-white p-7 shadow-soft md:p-10" aria-labelledby="minette-title">
          <h2 id="minette-title" className="font-serif text-3xl font-bold text-charcoal-900">Les aventures de Minette</h2>
          <p className="mt-4 text-charcoal-700">Minette semble avoir pris du poids. Il est strictement interdit de lui donner de la nourriture : elle dispose de ses croquettes dans la salle d’animation.</p>
          <p className="mt-3 font-bold text-terracotta-600">Rappel important : Minette ne doit pas entrer dans les salles de restauration.</p>
        </section>

        <nav aria-label="Documents du Petit Écho du Cœur" className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link href="/images/uploads/janvier2026.pdf" className="inline-flex justify-center rounded-full border-2 border-terracotta-600 px-6 py-3 font-semibold text-terracotta-600 hover:bg-white">Consulter le PDF illustré</Link>
          <Link href="/echo-du-coeur" className="inline-flex justify-center rounded-full bg-charcoal-900 px-6 py-3 font-semibold text-white hover:bg-charcoal-700">Retour aux numéros</Link>
        </nav>
      </article>
    </main>
  );
}
