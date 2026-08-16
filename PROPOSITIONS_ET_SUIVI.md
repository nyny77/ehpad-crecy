# Propositions et suivi des avancées

**Dernière mise à jour : 16 août 2026**

Ce fichier est la liste de référence des améliorations proposées pour le site. À chaque nouvelle avancée, l’action terminée doit être barrée avec `~~action terminée~~`, accompagnée de la date si elle est connue.

## Règle concernant le Postier numérique

Le Postier doit rester volontairement très simple : un code résident, un message, une photo facultative, une impression puis une distribution.

- ~~Ajouter des fonctions complexes au Postier : vidéo, message vocal, QR code, programmation et accusés avancés~~ — **proposition annulée à la demande du responsable du site**.
- ~~Imposer CAPTCHA, parcours supplémentaires ou stockage complexe visible pour les familles~~ — **proposition annulée**.
- Ne pas ajouter de nouvelle étape dans le parcours famille sans demande explicite.
- Conserver uniquement des protections techniques invisibles qui ne compliquent pas l’utilisation.

## Travaux terminés

- ~~Intégration fonctionnelle du Postier numérique.~~
- ~~Publication des tarifs d’avril 2026.~~
- ~~Simulateur de reste à charge : chambre, GIR et APA.~~
- ~~Audit interne RGAA 4.1.2.~~
- ~~Déclaration d’accessibilité : totalement conforme, 100 %, 84 critères sur 84 applicables.~~
- ~~Tests NVDA sur les parcours publics.~~
- ~~Tests NVDA dans l’administration authentifiée.~~
- ~~Tests de zoom à 200 % et 400 %.~~
- ~~Navigation clavier, focus, menus, fenêtres et formulaires corrigés.~~
- ~~Sous-titres et transcription de la vidéo locale.~~
- ~~Suppression du lecteur vidéo tiers au profit de la vidéo locale.~~
- ~~Alternative HTML accessible pour la Gazette de janvier 2026.~~
- ~~Affichage multipage des PDF sur iPhone et iPad avec ouverture plein écran adaptée à Safari iOS.~~
- ~~Galerie déclarée illustrative, sans obligation de titrer chaque photographie.~~
- ~~Optimisation WebP et miniatures des photographies.~~
- ~~Chargement différé des médias lourds.~~
- ~~Vidéo automatique de l’accueil avec commande Pause/Lecture.~~
- ~~PWA et page hors connexion.~~
- ~~Sitemap, robots.txt et données structurées de l’établissement.~~
- ~~Correction des anciens liens et coordonnées.~~
- ~~Tests automatiques, ESLint, TypeScript et build de production.~~
- ~~CI GitHub et point de contrôle de santé.~~
- ~~Alignement des informations de la barre inférieure du pied de page sur une seule ligne sur ordinateur.~~ — **Terminé le 16 août 2026.**

## Protections simples du Postier — sans modifier le parcours famille

- ~~Vérifier que toutes les commandes d’administration du courrier exigent réellement le rôle administrateur.~~ — **Vérifié et couvert par un test automatique le 16 août 2026.**
- ~~Éviter les noms de résidents, expéditeurs et messages personnels dans les titres de commits GitHub.~~ — **Titres rendus génériques le 16 août 2026.**
- ~~Conserver la suppression de la photo après distribution.~~ — **Vérifiée, complétée et couverte par un test automatique le 16 août 2026.**
- ~~Définir une durée simple de conservation des courriers distribués.~~ — **Suppression automatique après 30 jours, pour les distributions enregistrées à partir du 16 août 2026.**
- ~~Documenter une procédure manuelle de suppression en cas de demande d’une famille.~~ — **Procédure ajoutée le 16 août 2026.**

## Fiabilité et maintenance

- Centraliser les coordonnées, horaires et tarifs dans une seule source technique.
- Supprimer l’ancienne copie tarifaire 2025 encore présente dans le code si elle est inutilisée.
- Ajouter des tests unitaires du calculateur tarifaire.
- Ajouter des tests d’intégration des fonctions Netlify importantes.
- Ajouter des parcours automatiques pour Contact, Admission, Administration et Postier.
- Ajouter un journal technique des erreurs.
- Mettre en place des alertes en cas d’échec d’une fonction importante.
- Documenter la sauvegarde et la restauration du site.
- Tester régulièrement que les formulaires et le Postier fonctionnent après déploiement.

## Sécurité générale discrète

- Vérifier l’authentification des fonctions `test-email`, `send-notification` et `ai-image`.
- Valider strictement les données reçues par les fonctions Netlify.
- Vérifier le type réel, la taille et les dimensions des fichiers envoyés.
- Assainir le HTML produit dans l’éditeur de Gazette.
- Ajouter progressivement les en-têtes de sécurité CSP, `X-Content-Type-Options`, `Referrer-Policy` et `Permissions-Policy`.
- Ne jamais ajouter de contrainte visible pour les familles sans nécessité démontrée.

## Performance et sobriété

- Ne plus inclure dans le déploiement les originaux d’images qui ne sont jamais affichés.
- Supprimer les doublons stricts de médias.
- Produire automatiquement plusieurs tailles WebP et AVIF.
- Préparer une version plus légère de la vidéo pour les téléphones.
- Transformer le panorama 360° en tuiles progressives.
- Charger le chatbot seulement après interaction.
- Charger Netlify Identity uniquement sur les pages concernées.
- Réduire les animations Framer Motion lorsque du CSS suffit.
- Réduire le nombre de composants exécutés dans le navigateur.
- Mesurer les Core Web Vitals réels en production.
- Ajouter un budget de performance aux tests automatiques.

## SEO et visibilité locale

- Ajouter une adresse canonique à chaque page importante.
- Ajouter les données structurées `Article`, `FAQPage` et `BreadcrumbList`.
- Créer une image sociale adaptée à chaque article.
- Suivre anonymement les clics sur le téléphone et les demandes de visite.
- Suivre les départs vers ViaTrajectoire, les candidatures et les cartes envoyées.
- Créer une page claire sur les disponibilités si l’établissement souhaite publier cette information.
- Renforcer le parcours public d’admission.
- Construire une FAQ à partir des questions réellement reçues à l’accueil.

## Nouvelles idées et nouveaux services

### Aujourd’hui à Crécy

- Créer une page quotidienne avec le menu, les activités et le prochain événement.
- Ajouter un message court de l’équipe.
- Ajouter les accès rapides Appeler, Gazette et Envoyer une carte.
- Prévoir un mode grand écran pour le hall.

### Préparer mon entrée

- Créer un parcours guidé selon la situation de la famille.
- Proposer une checklist imprimable des documents et affaires à préparer.
- Présenter une chronologie simple avant, pendant et après l’arrivée.
- Ajouter une demande de visite et un départ clair vers ViaTrajectoire.
- Réutiliser le simulateur tarifaire existant dans ce parcours.

### Vous avez dit, nous avons fait

- Publier les propositions du Conseil de la vie sociale.
- Afficher les engagements, leur état et leur date prévisionnelle.
- Présenter les actions terminées et les résultats des enquêtes de satisfaction.

### Capsule de souvenirs

- Étudier un espace familial privé pour les anecdotes, lieux et souvenirs heureux.
- Produire une fiche facultative « sujets qui font sourire » pour les équipes.
- Ne lancer ce service qu’après validation du consentement et du cadre de confidentialité.

### Mémoire vivante de Crécy

- Créer une carte interactive de la commune.
- Recueillir des témoignages audio volontaires de résidents.
- Comparer des photographies anciennes et actuelles.
- Associer les écoles, associations et habitants à un projet modéré.

### Visite virtuelle racontée

- Ajouter des commentaires volontaires de résidents et de professionnels.
- Ajouter des sous-titres et un plan interactif.
- Proposer les parcours « première visite », « journée type » et « futur professionnel ».

### Gazette augmentée

- Créer une version audio de la Gazette.
- Ajouter une version grand contraste et adaptée aux écrans du hall.
- Ajouter des QR codes vers des contenus accessibles lorsque cela apporte une vraie valeur.
- Créer une compilation annuelle « L’année à Crécy ».

### La Place du village

- Publier un calendrier des ateliers ouverts.
- Permettre aux bénévoles et associations de proposer une activité.
- Présenter les partenariats avec les écoles et la commune.
- Créer un mur des remerciements modéré.

### Assistant Bonjour Crécy

- Faire répondre l’assistant uniquement à partir de contenus validés du site.
- Afficher la source de chaque réponse.
- Refuser les conseils médicaux individuels.
- Proposer immédiatement le téléphone ou le formulaire en cas de doute.
- Analyser les questions sans réponse pour améliorer les pages du site.

## Ordre de travail recommandé

1. Protections simples et invisibles du Postier.
2. Fiabilité, tests et supervision.
3. Performance des médias et du JavaScript.
4. SEO local et parcours d’admission.
5. « Aujourd’hui à Crécy ».
6. « Préparer mon entrée ».
7. Choisir ensuite un seul projet signature parmi Capsule de souvenirs, Mémoire vivante ou Gazette augmentée.

## Principe de mise à jour

- Une action réellement terminée est barrée.
- Une action commencée reçoit la mention **En cours** sans être barrée.
- Une idée abandonnée est barrée avec la mention **Annulée**.
- Une action ne doit jamais être barrée uniquement parce qu’elle a été discutée.
