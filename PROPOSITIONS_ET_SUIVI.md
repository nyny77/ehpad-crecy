# Propositions et suivi des avancées

**Dernière mise à jour : 17 août 2026**

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

- ~~Centraliser les coordonnées, horaires et tarifs dans une seule source technique.~~ — **Coordonnées et horaires dans `constants.ts`, tarifs 2026 dans `pricing-data.ts`, vérifiés le 16 août 2026.**
- ~~Supprimer l’ancienne copie tarifaire 2025 encore présente dans le code si elle est inutilisée.~~ — **Copie et composant inutilisé supprimés le 16 août 2026.**
- ~~Ajouter des tests unitaires du calculateur tarifaire.~~ — **Cas APA, sans APA et valeurs invalides couverts le 16 août 2026.**
- ~~Ajouter des tests d’intégration des fonctions Netlify importantes.~~ — **Santé, protection administrative et Postier couverts le 16 août 2026.**
- ~~Ajouter des parcours automatiques pour Contact, Admission, Administration et Postier.~~ — **Quatre parcours Playwright ajoutés et exécutés le 16 août 2026.**
- ~~Ajouter un journal technique des erreurs.~~ — **Journal structuré et sans contenu personnel ajouté aux fonctions le 16 août 2026.**
- ~~Mettre en place des alertes en cas d’échec d’une fonction importante.~~ — **Supervision toutes les six heures et alerte GitHub activées pour `ehpadcrecy.netlify.app` le 16 août 2026.**
- ~~Documenter la sauvegarde et la restauration du site.~~ — **Procédure ajoutée le 16 août 2026.**
- ~~Tester régulièrement que les formulaires et le Postier fonctionnent après déploiement.~~ — **Huit contrôles de production validés et programmés toutes les six heures le 16 août 2026.**

## Sécurité générale discrète

- ~~Vérifier l’authentification des fonctions `test-email`, `send-notification` et `ai-image`.~~ — **Accès administrateur et méthodes HTTP vérifiés automatiquement le 17 août 2026.**
- ~~Valider strictement les données reçues par les fonctions Netlify.~~ — **Corps JSON, actions, longueurs, formats et chemins validés côté serveur le 17 août 2026.**
- ~~Vérifier le type réel, la taille et les dimensions des fichiers envoyés.~~ — **Images contrôlées par Sharp et PDF vérifiés par signature, avec limites de taille et dimensions, le 17 août 2026.**
- ~~Assainir le HTML produit dans l’éditeur de Gazette.~~ — **Liste blanche de balises, attributs, styles et protocoles appliquée côté serveur le 17 août 2026.**
- ~~Ajouter progressivement les en-têtes de sécurité CSP, `X-Content-Type-Options`, `Referrer-Policy` et `Permissions-Policy`.~~ — **CSP et en-têtes complémentaires activés globalement sur Netlify le 17 août 2026.**
- Ne jamais ajouter de contrainte visible pour les familles sans nécessité démontrée.

## Performance et sobriété

- ~~Regrouper les déploiements Netlify lors du chargement de plusieurs photos.~~ — **Les commits intermédiaires sont ignorés par Netlify et un seul déploiement est lancé à la fin du lot, avec publication de secours en cas d’interruption, le 17 août 2026. Tests, build, fonctions Netlify, parcours navigateur et contrôle de production validés.**
- ~~Ne plus inclure dans le déploiement les originaux d’images qui ne sont jamais affichés.~~ — **Élagage automatique et prudent ajouté au build le 17 août 2026 : seuls les originaux disposant d’une variante WebP et sans aucune référence dans l’export sont retirés de `out`, sans supprimer les sources. Le build validé retire 50 fichiers et 85,2 Mo.**
- ~~Supprimer les doublons stricts de médias.~~ — **Déduplication automatique par empreinte SHA-256 ajoutée au build le 17 août 2026, avec réécriture des références et redirections de compatibilité sans supprimer les sources. Le build validé élimine 15 copies réparties dans 12 groupes, soit 4,1 Mo supplémentaires.**
- ~~Produire automatiquement plusieurs tailles WebP et AVIF.~~ — **Trois largeurs AVIF et deux variantes WebP, complétées par le WebP optimisé existant, sont générées automatiquement et servies avec `srcset` le 17 août 2026.**
- ~~Préparer une version plus légère de la vidéo pour les téléphones.~~ — **Version MP4 mobile compatible créée et utilisée sur l’accueil ainsi que sur la page Histoire le 17 août 2026, avec une réduction de 41 %.**
- ~~Optimiser le chargement progressif du panorama 360°.~~ — **Le panorama déployé étant déjà passé de 13,5 Mo à 1,2 Mo, le découpage en dizaines de tuiles a été écarté comme disproportionné. Un aperçu de 63 Ko est désormais affiché et le panorama complet ainsi que son lecteur ne se chargent qu’après activation, le 17 août 2026.**
- ~~Charger le chatbot seulement après interaction.~~ — **Le bouton léger reste visible partout ; le composant complet et Framer Motion ne sont importés qu’au premier clic depuis le 17 août 2026.**
- ~~Charger Netlify Identity uniquement sur les pages concernées.~~ — **Chargement limité à Administration, Galerie, Recrutement et aux liens d’authentification spéciaux le 17 août 2026.**
- ~~Réduire les animations Framer Motion lorsque du CSS suffit.~~ — **Premier lot converti en CSS sur l’accueil, le blog et le livret le 17 août 2026 ; les imports passent de 48 à 44 fichiers.**
- ~~Réduire le nombre de composants exécutés dans le navigateur.~~ — **Trois composants purement informatifs sont redevenus des composants serveur le 17 août 2026.**
- ~~Instrumenter les Core Web Vitals réels en production.~~ — **LCP, INP et CLS sont envoyés anonymement à GoatCounter par route et par niveau de qualité depuis le 17 août 2026 ; les premières données apparaîtront après publication.**
- ~~Ajouter un budget de performance aux tests automatiques.~~ — **Seuils sur l’export, JavaScript, CSS, vidéo mobile et aperçu 360° ajoutés au build CI le 17 août 2026.**

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

### Préparer mon entrée — service déjà en place, améliorations en pause

La page `/admissions` propose déjà le guide pas-à-pas, les aides financières, les quatre étapes du parcours, l’accès à ViaTrajectoire, les listes de documents et de trousseau ainsi qu’une FAQ. Les éléments ci-dessous sont uniquement des améliorations facultatives et ne constituent plus un nouveau service à créer.

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

- ~~Intégrer dans l’administration de la Gazette un bouton utilisant l’API OpenAI et GPT Image 2.~~ — **Annulée : le responsable souhaite une solution sans abonnement ni facturation.**
- ~~Intégrer dans l’administration de la Gazette un bouton « Générer une image avec l’IA » utilisant le quota gratuit de Cloudflare Workers AI et le modèle FLUX.~~ — **Mis en ligne le 16 août 2026 après une génération réelle réussie.**
- ~~Protéger cette génération par le rôle administrateur et conserver les identifiants Cloudflare uniquement dans les variables secrètes Netlify.~~ — **Variables protégées dans Netlify et accès anonyme refusé en production le 16 août 2026.**
- ~~Générer une seule proposition à la fois, avec validation humaine avant insertion, pour garder la maîtrise des coûts.~~ — **Aperçu et validation manuelle ajoutés le 16 août 2026.**
- ~~Ajouter automatiquement la mention « Illustration générée par IA » lorsque l’image ne représente pas un événement réel de l’EHPAD.~~ — **Mention automatique ajoutée le 16 août 2026.**
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
6. ~~Créer « Préparer mon entrée ».~~ — **Service déjà présent sur `/admissions` ; améliorations complémentaires mises en pause le 17 août 2026.**
7. Choisir ensuite un seul projet signature parmi Capsule de souvenirs, Mémoire vivante ou Gazette augmentée.

## Principe de mise à jour

- Une action réellement terminée est barrée.
- Une action commencée reçoit la mention **En cours** sans être barrée.
- Une idée abandonnée est barrée avec la mention **Annulée**.
- Une action ne doit jamais être barrée uniquement parce qu’elle a été discutée.
