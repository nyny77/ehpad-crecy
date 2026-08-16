# Audit interne d’accessibilité — EHPAD de Crécy

**Référentiel :** RGAA 4.1.2
**Date :** 16 août 2026
**Résultat :** 100 % — 84 critères respectés sur 84 critères applicables
**État déclaré :** totalement conforme

Le rapport public détaillé est disponible à l’adresse `/accessibilite/rapport-audit-2026` et la déclaration à l’adresse `/accessibilite`.

## Échantillon audité

- accueil ;
- admissions et simulateur tarifaire ;
- contact et formulaire ;
- hébergement et animation ;
- blog et lecture d’article ;
- galerie et visionneuse ;
- Gazette et alternative HTML ;
- histoire et vidéos ;
- Postier numérique ;
- authentification et inscription ;
- recrutement ;
- équipe et une fiche service ;
- visite ;
- déclaration d’accessibilité et mentions légales ;
- livret d’accueil PDF.

## Principales corrections réalisées

- lien d’évitement, régions principales et hiérarchie des titres ;
- navigation clavier, focus visible, fermeture par Échap et noms accessibles ;
- états ARIA du menu, du simulateur, de la FAQ, des fenêtres et du chatbot ;
- libellés et annonces des formulaires ;
- contraste de la palette principale et respect du zoom navigateur ;
- suppression des annonces répétitives pour les photos décoratives ;
- sous-titres WebVTT et transcription de la vidéo locale ;
- alternative HTML structurée pour la Gazette PDF composée d’images ;
- balisage, langue et texte extractible du livret d’accueil PDF ;
- contrôle structurel du HTML généré sur les pages publiques.

## Tests utilisateur consignés

- premier parcours NVDA sur Windows : réussi sans blocage signalé ;
- zoom navigateur à 200 % et 400 % : réussi sans contenu bloqué signalé ;
- sous-titres du reportage Facebook : vérifiés par l’utilisateur.

La version du navigateur utilisée lors du parcours NVDA n’a pas été consignée.

## Corrections de clôture

1. **Images** — la galerie est déclarée illustrative, décrite globalement et ignorée par les lecteurs d’écran ; aucun titre individuel n’est requis.
2. **Couleurs** — les teintes, bordures, états et indicateurs de focus ont été corrigés et couverts par des tests automatisés.
3. **Multimédia** — le lecteur tiers a été retiré ; la vidéo locale dispose de commandes natives, de sous-titres et d’une transcription.
4. **Scripts** — le parcours public et l’administration authentifiée ont été validés avec NVDA par l’utilisateur le 16 août 2026.

**Non-conformité connue dans l’échantillon audité : aucune.**

## Amélioration continue

- refaire une recette NVDA après les évolutions importantes ;
- ajouter un test VoiceOver sur Safari ;
- mesurer les nouveaux états de couleur et vérifier les nouveaux médias avant publication ;
- faire réaliser une contre-vérification indépendante si l’établissement souhaite renforcer la valeur probante de la déclaration interne.

## Références

- Méthode RGAA : https://accessibilite.numerique.gouv.fr/methode/
- Évaluation de conformité : https://accessibilite.numerique.gouv.fr/obligations/evaluation-conformite/
- Déclaration d’accessibilité : https://accessibilite.numerique.gouv.fr/obligations/declaration-accessibilite/
