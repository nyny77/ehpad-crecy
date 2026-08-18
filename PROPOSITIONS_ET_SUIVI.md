# Propositions et suivi des avancées

**Dernière mise à jour : 18 août 2026**

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

## SEO, micro-données et visibilité locale

- ~~Ajouter une adresse canonique à chaque page importante.~~ — **Adresses canoniques configurées sur l’ensemble des 45 routes et fiches dynamiques le 18 août 2026.**
- ~~Ajouter les données structurées `Article`, `FAQPage` et `BreadcrumbList`.~~ — **Schémas JSON-LD Schema.org intégrés pour les articles de blog, la FAQ d'admission et les fils d'Ariane le 18 août 2026.**
- ~~Créer une image sociale adaptée aux partages (Open Graph).~~ — **Configuration Open Graph et cartes de partage intégrées pour le blog et les pages publiques le 18 août 2026.**
- ~~Suivre anonymement les clics utiles et conversions sans cookie.~~ — **Événements GoatCounter non bloquants intégrés pour le formulaire de contact, les demandes de visite et l'envoi de cartes du Postier le 18 août 2026.**
- ~~Renforcer le parcours public d’admission.~~ — **Parcours `/admissions` complet et opérationnel (simulateur 2026, aides, ViaTrajectoire, trousseau et FAQ).**

## Idées et nouveaux services — Archivés / En pause

> **Note d'arbitrage (18 août 2026) :** L'ensemble des nouveaux services et fonctionnalités complémentaires ci-dessous est officiellement mis en pause et archivé à la demande du responsable du site, afin de préserver la stabilité, la simplicité et la légèreté du site existant.

### Aujourd’hui à Crécy — *Mis en pause le 18 août 2026*

- Page quotidienne avec menu, activités, météo et mode TV grand écran.

### Préparer mon entrée — *Service déjà en place sur `/admissions`, ajouts mis en pause le 17 août 2026*

- Guide pas-à-pas, simulateur, aides, ViaTrajectoire et listes déjà opérationnels sur `/admissions`.

### Vous avez dit, nous avons fait — *Mis en pause le 18 août 2026*

- Espace de suivi des engagements du CVS et synthèses d'enquêtes.

### Capsule de souvenirs — *Mis en pause le 18 août 2026*

- Espace privé familial et fiches repères pour l'animation.

### Mémoire vivante de Crécy — *Mis en pause le 18 août 2026*

- Carte interactive, témoignages audio et projet intergénérationnel communal.

### Visite virtuelle racontée — *Mis en pause le 18 août 2026*

- Parcours audio guidé dans la visite 360°.

### Gazette augmentée — *Mis en pause le 18 août 2026*

- ~~Intégrer dans l’administration de la Gazette un bouton utilisant l’API OpenAI et GPT Image 2.~~ — **Annulée : le responsable souhaite une solution sans abonnement ni facturation.**
- ~~Intégrer dans l’administration de la Gazette un bouton « Générer une image avec l’IA » utilisant le quota gratuit de Cloudflare Workers AI et le modèle FLUX.~~ — **Mis en ligne le 16 août 2026 après une génération réelle réussie.**
- ~~Protéger cette génération par le rôle administrateur et conserver les identifiants Cloudflare uniquement dans les variables secrètes Netlify.~~ — **Variables protégées dans Netlify et accès anonyme refusé en production le 16 août 2026.**
- ~~Générer une seule proposition à la fois, avec validation humaine avant insertion, pour garder la maîtrise des coûts.~~ — **Aperçu et validation manuelle ajoutés le 16 août 2026.**
- ~~Ajouter automatiquement la mention « Illustration générée par IA » lorsque l’image ne représente pas un événement réel de l’EHPAD.~~ — **Mention automatique ajoutée le 16 août 2026.**
- *(En pause)* Version audio, mode grand contraste TV et compilation annuelle.

### La Place du village — *Mis en pause le 18 août 2026*

- Calendrier d'ateliers ouverts, bénévolat et mur des mercis.

### Assistant Bonjour Crécy — *Mis en pause le 18 août 2026*

- Évolution du chatbot vers un assistant documentaire strict.

## Ordre de travail recommandé

1. ~~Protections simples et invisibles du Postier.~~ — **Terminé.**
2. ~~Fiabilité, tests et supervision.~~ — **Terminé.**
3. ~~Performance des médias et du JavaScript.~~ — **Terminé.**
4. SEO local, balises canoniques et suivi d'usage discret.
5. Maintenance et suivi de la production existante.
6. *(Nouveaux services en pause)*

## Principe de mise à jour

- Une action réellement terminée est barrée.
- Une action commencée reçoit la mention **En cours** sans être barrée.
- Une idée abandonnée est barrée avec la mention **Annulée**.
- Une idée ou un service suspendu reçoit la mention **Mis en pause**.
- Une action ne doit jamais être barrée uniquement parce qu’elle a été discutée.
