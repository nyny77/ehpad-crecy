import { Metadata } from "next";
import { EHPAD_INFO } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Politique de Confidentialité | EHPAD de Crécy",
    description: "Politique de confidentialité et protection des données personnelles (RGPD) de l'EHPAD de Crécy-la-Chapelle.",
};

export default function PolitiqueConfidentialitePage() {
    return (
        <main className="min-h-screen bg-cream-50 pt-32 pb-20">
            <div className="container-custom">
                <div className="max-w-4xl mx-auto">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-900 mb-8">
                        Politique de Confidentialité
                    </h1>

                    <p className="text-lg text-charcoal-600 mb-8">
                        Conformément au Règlement Général sur la Protection des Données (RGPD) et à la
                        loi Informatique et Libertés, nous vous informons de la manière dont vos données
                        personnelles sont collectées et traitées.
                    </p>

                    <div className="prose prose-lg max-w-none text-charcoal-700 space-y-8">
                        {/* Responsable du traitement */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                1. Responsable du traitement
                            </h2>
                            <p className="mb-4">
                                Le responsable du traitement des données personnelles est :
                            </p>
                            <ul className="list-none space-y-2">
                                <li><strong>{EHPAD_INFO.fullName}</strong></li>
                                <li>{EHPAD_INFO.address.full}</li>
                                <li>Téléphone : {EHPAD_INFO.phone}</li>
                                <li>Email : {EHPAD_INFO.email}</li>
                            </ul>
                        </section>

                        {/* Données collectées */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                2. Données personnelles collectées
                            </h2>
                            <p className="mb-4">
                                Dans le cadre de l&apos;utilisation de notre site, nous pouvons être amenés à collecter les données suivantes :
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Formulaire de contact :</strong> nom, prénom, email, numéro de téléphone, message</li>
                                <li><strong>Formulaire de recrutement :</strong> nom, prénom, email, téléphone, CV, lettre de motivation</li>
                                <li><strong>Création de compte :</strong> email, mot de passe (crypté), rôle dans l&apos;établissement</li>
                                <li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées (via cookies)</li>
                            </ul>
                        </section>

                        {/* Finalités */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                3. Finalités du traitement
                            </h2>
                            <p className="mb-4">
                                Vos données personnelles sont collectées pour les finalités suivantes :
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Répondre à vos demandes de contact et d&apos;information</li>
                                <li>Traiter les candidatures pour les offres d&apos;emploi</li>
                                <li>Gérer les accès à l&apos;espace famille et personnel</li>
                                <li>Vous informer des actualités de l&apos;établissement (si vous y avez consenti)</li>
                                <li>Améliorer la navigation sur notre site</li>
                            </ul>
                        </section>

                        {/* Base légale */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                4. Base légale du traitement
                            </h2>
                            <p className="mb-4">
                                Le traitement de vos données repose sur :
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Votre consentement</strong> lors du remplissage des formulaires</li>
                                <li><strong>L&apos;exécution d&apos;un contrat</strong> ou de mesures précontractuelles (candidature, admission)</li>
                                <li><strong>L&apos;intérêt légitime</strong> de l&apos;établissement à communiquer avec les familles</li>
                            </ul>
                        </section>

                        {/* Destinataires */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                5. Destinataires des données
                            </h2>
                            <p className="mb-4">
                                Vos données personnelles sont destinées :
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Aux services internes de l&apos;{EHPAD_INFO.name} (direction, administration, RH)</li>
                                <li>À notre hébergeur (Netlify) pour le fonctionnement technique du site</li>
                            </ul>
                            <p className="mt-4">
                                Aucune donnée n&apos;est vendue ou louée à des tiers à des fins commerciales.
                            </p>
                        </section>

                        {/* Durée de conservation */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                6. Durée de conservation
                            </h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Données de contact :</strong> 3 ans à compter du dernier contact</li>
                                <li><strong>Candidatures :</strong> 2 ans après le dernier contact avec le candidat</li>
                                <li><strong>Comptes utilisateurs :</strong> durée de vie du compte + 3 ans après suppression</li>
                                <li><strong>Cookies :</strong> 13 mois maximum</li>
                            </ul>
                        </section>

                        {/* Vos droits */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                7. Vos droits
                            </h2>
                            <p className="mb-4">
                                Conformément au RGPD, vous disposez des droits suivants :
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Droit d&apos;accès :</strong> obtenir une copie de vos données personnelles</li>
                                <li><strong>Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
                                <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données</li>
                                <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
                                <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                                <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données</li>
                            </ul>
                            <p className="mt-4">
                                Pour exercer ces droits, contactez-nous par email à <a href={`mailto:${EHPAD_INFO.email}`} className="text-terracotta-600 hover:underline">{EHPAD_INFO.email}</a> ou
                                par courrier à l&apos;adresse de l&apos;établissement.
                            </p>
                        </section>

                        {/* Cookies */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                8. Cookies
                            </h2>
                            <p className="mb-4">
                                Notre site utilise des cookies pour :
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site (authentification)</li>
                                <li><strong>Cookies de préférences :</strong> mémoriser vos choix (session utilisateur)</li>
                            </ul>
                            <p className="mt-4">
                                Nous n&apos;utilisons pas de cookies publicitaires ou de tracking tiers.
                            </p>
                        </section>

                        {/* Sécurité */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                9. Sécurité des données
                            </h2>
                            <p>
                                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
                                pour protéger vos données personnelles contre tout accès non autorisé,
                                modification, divulgation ou destruction. Le site utilise le protocole HTTPS
                                pour sécuriser les échanges de données.
                            </p>
                        </section>

                        {/* Réclamation */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                10. Réclamation
                            </h2>
                            <p>
                                Si vous estimez que le traitement de vos données personnelles constitue
                                une violation du RGPD, vous avez le droit d&apos;introduire une réclamation
                                auprès de la CNIL (Commission Nationale de l&apos;Informatique et des Libertés) :
                            </p>
                            <ul className="list-none space-y-2 mt-4">
                                <li><strong>CNIL</strong></li>
                                <li>3 Place de Fontenoy, TSA 80715</li>
                                <li>75334 Paris Cedex 07</li>
                                <li>Site web : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-terracotta-600 hover:underline">www.cnil.fr</a></li>
                            </ul>
                        </section>

                        {/* Mise à jour */}
                        <section className="bg-white rounded-2xl p-8 shadow-soft">
                            <h2 className="font-serif text-2xl font-semibold text-charcoal-900 mb-4">
                                11. Mise à jour de la politique
                            </h2>
                            <p>
                                Cette politique de confidentialité peut être mise à jour à tout moment.
                                La date de dernière mise à jour est indiquée ci-dessous. Nous vous
                                encourageons à consulter régulièrement cette page.
                            </p>
                            <p className="mt-4 text-sm text-charcoal-500">
                                <strong>Dernière mise à jour :</strong> Février 2026
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
