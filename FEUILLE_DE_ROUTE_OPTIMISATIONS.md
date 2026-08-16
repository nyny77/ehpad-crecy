# Feuille de route 2026-2027 — EHPAD de Crécy

**Dernière mise à jour : 16 août 2026**

**Rôle du document :** source de vérité pour les travaux terminés, les risques à traiter et les prochaines évolutions du site.

## 1. Vision

Le site ne doit plus être seulement une vitrine. Il peut devenir le **compagnon numérique de la vie à Crécy** : rassurant avant une admission, utile chaque jour aux familles, simple pour les équipes et porteur de la mémoire des résidents.

La ligne directrice proposée est :

> **Rassurer, relier, simplifier et transmettre.**

Les choix futurs devront respecter quatre principes :

- aucune donnée médicale dans le site public ou dans Git ;
- accessibilité et simplicité avant l'effet décoratif ;
- consentement explicite pour les photos, voix et témoignages ;
- chaque nouveau service doit avoir un responsable éditorial et un indicateur d'usage.

## 2. État des lieux vérifié

Audit réalisé sur le dépôt et sur un build de production le 16 août 2026.

### Socle actuel

- Next.js 16, React 19 et export statique pour Netlify ;
- 45 pages statiques générées, incluant les fiches dynamiques de l'équipe, les documents d'accessibilité, le rapport d'audit, la Gazette accessible, `robots.txt` et le sitemap ;
- 14 fonctions Netlify pour l'administration, les médias, les comptes, le Postier et le contrôle de santé ;
- PWA installable avec page hors connexion ;
- authentification Netlify Identity et contrôle du rôle `admin` sur les principales fonctions d'administration ;
- statistiques respectueuses de la vie privée avec GoatCounter ;
- interface responsive, mode d'affichage renforcé et prise en compte de la réduction des animations.

### Contrôles techniques

- build de production : **réussi** ;
- TypeScript : **réussi pendant le build** ;
- ESLint : **0 erreur et 0 avertissement** après nettoyage ;
- audit des dépendances de production : **0 vulnérabilité connue** au jour de l'audit ;
- lint global : les artefacts `.netlify` sont désormais correctement ignorés.

### Mesures observées

- 467 fichiers dans `public`, pour environ **489 Mo** ;
- export final `out` d'environ **495 Mo** ;
- 102 grandes photos de galerie, environ **198 Mo** ;
- 100 miniatures déjà générées ;
- au moins 27 Mo récupérables par suppression de doublons stricts ;
- 58 composants client sur 86 fichiers TSX ;
- Framer Motion importé dans 48 fichiers ;
- JavaScript exporté : environ 1,41 Mo au total, réparti par route.

Ces chiffres mesurent surtout le poids du déploiement. Le poids réellement téléchargé par visite doit encore être mesuré en production avec les Core Web Vitals.

## 3. Travaux déjà réalisés

### Expérience publique — terminé

- refonte graphique responsive et navigation structurée ;
- accueil enrichi, présentation de l'établissement, hébergement, admissions, histoire et équipe ;
- tarifs d'avril 2026 publiés avec choix chambre simple/double, GIR, prise en compte de l'APA et estimation mensuelle du reste à charge ;
- blog et actualités ;
- espace Animation et Vie sociale ;
- galerie de photos avec miniatures, chargement progressif et visionneuse ;
- visite virtuelle à 360° ;
- page de recrutement et candidature ;
- livret d'accueil interactif pour les agents ;
- page de contact conversationnelle ;
- assistant virtuel local à base de règles ;
- affichage adapté, focus visible et réduction des mouvements ;
- PWA, icônes d'installation et fonctionnement hors connexion minimal.

### Médias et performances — terminé

- écran d'accueil réduit à environ 0,6 seconde et affiché une seule fois par session ;
- vidéo principale de 21,9 Mo chargée seulement après interaction ;
- conversion automatique des images publiques vers WebP ;
- réduction estimée de 92 % sur les variantes optimisées ;
- miniatures de galerie à 600 px ;
- cache longue durée pour les ressources statiques optimisées ;
- composant vidéo allégé sur la page Histoire ;
- animations adaptées aux téléphones et à `prefers-reduced-motion`.

### Administration intégrée — terminé

- authentification administrateur par rôle ;
- ajout, modification, classement, corbeille et suppression des photos ;
- compression et génération de miniature dans le navigateur ;
- création, modification, brouillon, publication et suppression d'articles ;
- gestion des utilisateurs et validation des comptes ;
- génération des contenus par commits atomiques dans GitHub.

### Gazette « L'Écho du Cœur » — terminé

- éditeur de Gazette par blocs ;
- titres, paragraphes, photos, légendes et sommaire ;
- recherche d'images externes ;
- archives et rendu responsive ;
- impression depuis la version web.

### Postier numérique — terminé fonctionnellement

- accès famille par code secret du résident ;
- vérification du code avant composition ;
- saisie du nom de l'expéditeur et du message ;
- ajout et compression d'une photo en WebP ;
- aperçu, conseil d'orientation et traitement de la rotation EXIF ;
- rendu amélioré des formats portrait à l'impression ;
- réception dans l'administration ;
- impression, marquage comme distribué et nettoyage de la photo ;
- suppression individuelle et suppression en masse ;
- gestion des résidents et renouvellement des codes.

Le Postier est donc **livré sur le plan fonctionnel**, mais doit encore passer par la phase de sécurisation décrite en priorité P0.

### Qualité, accessibilité, SEO et supervision — premier lot terminé

- lien d'évitement vers le contenu principal et correction des landmarks imbriqués ;
- navigation principale et menu mobile mieux utilisables au clavier ;
- états ARIA du menu, de l'assistant et de la galerie ;
- fermeture de l'assistant et de la visionneuse avec la touche Échap ;
- sémantique et états accessibles renforcés sur le simulateur tarifaire, la FAQ, les modales et les boutons visuels ;
- suppression des liens contenant des boutons imbriqués ;
- titres `h1` ajoutés sur les pages Accessibilité et Galerie ;
- métadonnées ajoutées aux pages Animation, Gazette, Familles, Visite et Livret d'accueil ;
- métadonnées dynamiques pour les fiches de l'équipe ;
- sitemap, `robots.txt`, cartes sociales et données structurées `NursingHome` ;
- correction du lien `/tarifs`, des anciens liens `/vie-sociale` et du numéro du chatbot ;
- six tests automatiques de non-régression, dont des contrôles d'accessibilité structurelle ;
- CI GitHub : lint, TypeScript, tests et build à chaque push ou pull request ;
- point de santé Netlify et procédure de supervision documentée.
- audit interne RGAA 4.1.2 terminé : 95,2 % (80 critères respectés sur 84 applicables), statut « partiellement conforme », déclaration et rapport détaillé publiés ;
- premiers tests NVDA et zoom réussis, PDF inspectés, Gazette accessible et vidéo locale sous-titrée ;
- la galerie dispose d'une description globale ; les images purement illustratives ne génèrent plus d'annonces répétitives et les vidéos sont déclarées sous-titrées.

## 4. Constats et risques issus de l'audit

### P0 — données personnelles et sécurité

1. **Le Postier stocke aujourd'hui les résidents, codes, messages et photos via GitHub.**

   Les suppressions courantes n'effacent pas automatiquement l'historique Git. Les messages et certains noms apparaissent également dans les titres de commits. Git est adapté au contenu éditorial, pas au courrier familial.

2. **Les photos du Postier sont placées temporairement sous `public/images/messages`.**

   Elles disposent donc d'une URL publique jusqu'à leur suppression et au déploiement suivant.

3. **Les codes du Postier sont conservés en clair et sont relativement prévisibles.**

   L'API n'a ni limitation de tentatives, ni délai progressif, ni CAPTCHA après échecs répétés.

4. **La fonction `test-email` peut être déclenchée sans contrôle administrateur.**

5. **La fonction `send-notification` lit l'utilisateur connecté mais ne refuse pas réellement les visiteurs non administrateurs.**

   Elle accepte aussi du sujet et du HTML dérivés de la requête sans assainissement suffisant.

6. **Le proxy `ai-image` est public et sans limitation.**

   Il peut être utilisé comme relais par un tiers et générer des contenus non souhaités.

7. **La Gazette affiche du HTML enregistré avec `dangerouslySetInnerHTML`.**

   Le contenu doit être assaini à l'enregistrement et avant rendu.

8. **Les en-têtes de sécurité sont incomplets.**

   Il manque notamment une stratégie CSP, `X-Content-Type-Options`, `Referrer-Policy` et `Permissions-Policy`.

### P1 — confiance, contenu et accessibilité

- les tarifs d'avril 2026 sont bien publiés en ligne ; une ancienne copie technique marquée 2025 subsiste toutefois dans `src/lib/constants.ts` et devra être supprimée ou reliée à la source tarifaire 2026 pour éviter une régression future ;
- la déclaration d'accessibilité affiche désormais le statut « partiellement conforme — 95,2 % » et renvoie vers le rapport d'audit détaillé ;
- les menus déroulants, fenêtres modales, visionneuses, simulateur et chatbot ont reçu une correction technique ; une recette NVDA authentifiée de l'administration et un test VoiceOver restent des améliorations recommandées ;
- les boutons visuels repérés dans les parcours principaux ont reçu un libellé accessible ; le contrôle exhaustif de l'échantillon reste à faire ;
- la vidéo locale dispose désormais de sous-titres et d'une transcription ; le sous-titrage du reportage Facebook a été vérifié par l'utilisateur ;
- les textes alternatifs génériques de type « Photo privée 1 » sont neutralisés au rendu ; une description globale présente l'album et les descriptions individuelles restent possibles lorsqu'une image transmet une information utile ;
- le livret PDF est balisé ; le PDF image de la Gazette dispose désormais d'une alternative HTML structurée.

### P1 — qualité et exploitation

- six tests de structure et de non-régression sont présents ; les tests métier d'intégration et les parcours E2E restent à créer ;
- une vérification continue GitHub Actions contrôle désormais lint, TypeScript, tests et build ;
- plusieurs règles ESLint importantes sont désactivées, dont les règles des hooks React ;
- les actions courantes du CMS génèrent de très nombreux commits sur la branche principale ;
- il n'existe pas de stratégie documentée de sauvegarde, de restauration, de journal d'audit ni de durée de conservation ;
- la supervision des erreurs des fonctions et des parcours famille reste à mettre en place.

### P2 — performance et éco-conception

- les originaux lourds sont encore copiés dans le déploiement en plus des variantes optimisées ;
- le panorama de 12,9 Mo et la vidéo de 21,9 Mo restent coûteux pour les connexions lentes ;
- 27 Mo de doublons stricts ont été détectés ;
- Netlify Identity, le chatbot, le défilement fluide et plusieurs animations sont chargés globalement ;
- 58 composants sur 86 sont hydratés côté navigateur ;
- Framer Motion est utilisé dans 48 fichiers, parfois pour des effets simples réalisables en CSS ;
- l'export statique désactive l'optimisation dynamique de `next/image` ;
- aucune mesure RUM des Core Web Vitals n'est encore collectée.

### P2 — référencement et acquisition

- `robots.txt`, sitemap et données structurées `NursingHome` sont en place ; les schémas `BreadcrumbList`, `Article` et `FAQPage` restent à ajouter aux pages concernées ;
- pas de stratégie canonique ni d'image Open Graph globale complète ;
- les principales métadonnées manquantes ont été ajoutées ; les pages éditoriales doivent encore recevoir des cartes sociales propres à chaque contenu ;
- les objectifs utiles ne sont pas suivis : clic téléphone, demande de visite, départ vers ViaTrajectoire, envoi de carte, candidature ;
- aucune page publique clairement dédiée aux disponibilités, au parcours d'admission ou aux questions fréquentes principales.

### Droit à l'image

Les 102 photos placées dans le dossier technique `private` sont actuellement diffusées publiquement, ce que confirme la documentation d'administration. Les autorisations signées doivent préciser explicitement : site Internet public, durée, retrait, réseaux sociaux distincts et représentation adaptée pour les résidents protégés.

Deux choix cohérents sont possibles :

- diffusion publique autorisée : renommer le dossier pour supprimer l'ambiguïté et tenir un registre des consentements ;
- diffusion réservée aux familles : déplacer les fichiers vers un stockage privé et les délivrer par URL signée après authentification.

## 5. Plan d'action priorisé

### Phase 0 — sécuriser avant d'enrichir (0 à 10 jours)

**Objectif : supprimer les risques disproportionnés sur les données familiales.**

- [ ] protéger ou retirer `test-email` ;
- [ ] imposer rôle administrateur, méthode POST et validation stricte dans `send-notification` ;
- [ ] protéger `ai-image`, limiter sa fréquence et filtrer les usages ;
- [ ] ajouter des limites de taille, type MIME réel, dimensions et décodage d'image côté serveur ;
- [ ] ajouter limitation par IP/code, délai progressif et CAPTCHA adaptatif au Postier ;
- [ ] remplacer les codes lisibles par des secrets aléatoires plus robustes et ne stocker que leur empreinte ;
- [ ] retirer noms, expéditeurs et résidents des messages de commits ;
- [ ] migrer messages, résidents et médias du Postier vers une base et un stockage objet privés ;
- [ ] servir les photos par URL signée à courte durée ;
- [ ] définir une conservation courte : nouveau, distribué, supprimé automatiquement après délai validé ;
- [ ] préparer une procédure contrôlée de purge de l'historique Git et de rotation des secrets ;
- [ ] assainir le HTML de la Gazette ;
- [ ] ajouter les en-têtes de sécurité et tester une CSP en mode rapport avant blocage ;
- [ ] faire valider le cadre RGPD, le droit à l'image et les mentions du Postier.

**Critères de sortie :** aucune photo de courrier accessible par URL publique permanente, aucun code en clair, endpoints sensibles authentifiés et test de brute force bloqué.

### Phase 1 — fiabilité, exactitude et accessibilité (1 à 3 semaines)

**Objectif : rendre le site fiable avant toute campagne de visibilité.**

- [x] corriger `/tarifs`, `/vie-sociale` et ajouter un contrôle automatique des liens internes ;
- [ ] centraliser téléphone, e-mail, adresse, horaires et tarifs dans une seule source ;
- [x] publier les tarifs d'avril 2026 et afficher leur date de mise à jour ;
- [ ] supprimer l'ancienne copie tarifaire 2025 inutilisée dans `src/lib/constants.ts` ;
- [ ] supprimer les données de démonstration susceptibles d'apparaître dans l'administration ;
- [ ] corriger ESLint pour ignorer `.netlify` et réactiver progressivement les règles des hooks ;
- [ ] ajouter tests unitaires des calculateurs et validations ;
- [ ] ajouter tests d'intégration des fonctions sensibles ;
- [ ] ajouter parcours E2E : admission, contact, connexion admin, Postier, impression et suppression ;
- [x] mettre en place une CI : lint, typecheck, tests, build et contrôle des liens ;
- [ ] ajouter journal d'audit, alertes d'erreur et procédure de restauration ;
- [x] réaliser l'audit interne RGAA sur un échantillon représentatif et corriger les parcours essentiels ;
- [ ] organiser une contre-vérification indépendante si une assurance supplémentaire est souhaitée ;
- [x] ajouter les `h1`, labels, états ARIA, premières gestions du focus, fermeture par Échap et navigation clavier sur les composants prioritaires ;
- [x] fournir les sous-titres et la transcription de la vidéo locale ;
- [x] publier une alternative HTML structurée pour la Gazette PDF de janvier 2026 ;
- [x] neutraliser les descriptions génériques des images illustratives, décrire globalement la galerie et vérifier le reportage Facebook tiers ;
- [x] publier le statut « partiellement conforme — 95,2 % », le schéma pluriannuel et le plan annuel ;
- [x] compléter la déclaration d'accessibilité avec l'échantillon, les résultats, les non-conformités et le taux.

**Critères de sortie :** aucun lien interne cassé, coordonnées cohérentes, CI verte et parcours principaux utilisables uniquement au clavier.

### Phase 2 — vitesse, sobriété et visibilité (2 à 5 semaines)

**Objectif : être excellent sur téléphone et connexion moyenne.**

- [ ] ne plus copier les originaux inutilisés dans `out` ;
- [ ] dédupliquer les médias et appliquer une politique de nommage par empreinte ;
- [ ] déplacer les médias lourds vers un stockage/CDN avec transformations à la demande ;
- [ ] produire AVIF/WebP responsifs et conserver JPEG seulement lorsque nécessaire ;
- [ ] découper le panorama 360° en tuiles multi-résolution ;
- [ ] proposer vidéo adaptative ou version mobile plus légère ;
- [ ] charger le chatbot seulement après interaction ;
- [ ] charger Netlify Identity uniquement sur les routes concernées ;
- [ ] remplacer les micro-animations simples par CSS et réduire Framer Motion ;
- [ ] convertir davantage de composants informatifs en composants serveur ;
- [ ] réévaluer le défilement fluide global pour les appareils modestes ;
- [ ] collecter LCP, INP et CLS anonymisés en production ;
- [ ] ajouter budget de performance dans la CI ;
- [x] créer sitemap, robots, carte sociale globale et données structurées de l'établissement ;
- [ ] compléter les canoniques et données structurées propres aux articles, FAQ et fils d'Ariane ;
- [ ] suivre les conversions utiles sans profilage publicitaire.

**Cibles :** LCP < 2,5 s, INP < 200 ms, CLS < 0,1 et aucune régression au-delà du budget défini.

### Phase 3 — rendre le site utile chaque semaine (1 à 2 mois)

#### A. « Aujourd'hui à Crécy » — priorité produit n°1

Une page vivante, très lisible sur téléphone, écran d'accueil et borne :

- menu du jour et allergènes généraux ;
- activités du jour et de la semaine ;
- prochain événement ;
- message de l'équipe ;
- météo et suggestion adaptée au jardin ;
- boutons Appeler, Envoyer une carte, Voir la Gazette et S'inscrire à un événement ;
- mode affichage TV pour le hall.

**Effet attendu :** donner une raison concrète de revenir chaque jour.

#### B. « Préparer mon entrée » — priorité produit n°2

- parcours guidé selon la situation ;
- simulateur pédagogique hébergement + GIR + aides, avec avertissement non contractuel ;
- comparaison chambre simple/double ;
- checklist personnalisée et imprimable ;
- chronologie avant, pendant et après l'arrivée ;
- prise de rendez-vous ;
- départ clair vers ViaTrajectoire ;
- FAQ issue des vraies questions reçues à l'accueil.

**Effet attendu :** réduire l'anxiété et le nombre d'appels répétitifs.

#### C. « Vous avez dit, nous avons fait »

- décisions du Conseil de la vie sociale ;
- propositions anonymisées ;
- engagements, responsable et date cible ;
- réalisations avant/après ;
- résultats simplifiés des enquêtes de satisfaction.

**Effet attendu :** matérialiser la transparence et la qualité.

### Phase 4 — services “effet waouh” (trimestre suivant)

#### 1. Le Postier vivant

Faire évoluer la carte postale vers une expérience émotionnelle :

- message vocal avec transcription imprimable ;
- mini-vidéo familiale convertie en QR code privé sur la carte ;
- accusé simple « remis à votre proche » sans donnée médicale ;
- modèles anniversaire, saison et souvenir ;
- programmation d'une carte pour une date future ;
- réponse du résident dictée à un professionnel, avec consentement.

#### 2. La Capsule de souvenirs

Chaque famille peut préparer un petit musée numérique privé : photos, voix, chansons évoquées sans héberger d'œuvres protégées, lieux importants et anecdotes. L'équipe peut générer une fiche « sujets qui font sourire » utilisable lors des animations.

#### 3. Mémoire vivante de Crécy

- carte interactive de Crécy-la-Chapelle ;
- témoignages audio des résidents ;
- photos anciennes et actuelles ;
- parcours sonore dans la ville ;
- contributions modérées des familles, écoles et associations ;
- exposition annuelle et épisode de podcast.

**Vision :** les résidents deviennent les passeurs de mémoire de la commune.

#### 4. Visite virtuelle racontée

Transformer la visite 360° en parcours guidé par des voix de résidents et de professionnels, avec sous-titres, plan interactif et versions « une journée type », « première visite » et « futur professionnel ».

#### 5. La Place du village

- calendrier d'ateliers ouverts ;
- appels à bénévoles et compétences recherchées ;
- partenariats écoles, médiathèque, associations et commerces ;
- formulaire de proposition d'activité ;
- mur des mercis modéré.

#### 6. Gazette augmentée

- version audio lue par les résidents ou une voix validée ;
- QR codes vers des témoignages et galeries ;
- édition automatique grand contraste ;
- version imprimée A4 et version écran TV ;
- compilation annuelle « L'année à Crécy ».

#### 7. Assistant « Bonjour Crécy »

Remplacer progressivement le chatbot à mots-clés par un guide strictement fondé sur les contenus validés du site :

- réponses sourcées avec lien vers la page officielle ;
- mode vocal et gros caractères ;
- aucune réponse médicale individuelle ;
- transfert immédiat vers le téléphone ou le formulaire en cas de doute ;
- tableau des questions sans réponse pour améliorer le contenu.

## 6. Matrice de décision

| Initiative | Valeur | Effort | Risque | Décision recommandée |
|---|---:|---:|---:|---|
| Sécurisation du Postier | Très forte | Moyen | Très élevé si reporté | Immédiat |
| Verrouillage des fonctions publiques | Très forte | Faible | Élevé | Immédiat |
| Liens, téléphone et données tarifaires dupliquées | Forte | Faible | Moyen | Immédiat |
| Audit RGAA et corrections essentielles | Très forte | Moyen | Élevé | Phase 1 |
| CI, tests et supervision | Forte | Moyen | Moyen | Phase 1 |
| Allègement des médias et du JavaScript | Forte | Moyen/fort | Faible | Phase 2 |
| SEO local et données structurées | Forte | Faible/moyen | Faible | Phase 2 |
| Aujourd'hui à Crécy | Très forte | Moyen | Faible | Premier nouveau service |
| Préparer mon entrée | Très forte | Moyen | Faible | Deuxième nouveau service |
| Postier vivant | Très forte | Moyen/fort | Vie privée | Après sécurisation |
| Mémoire vivante de Crécy | Forte | Fort | Consentement | Projet signature |

## 7. Indicateurs de réussite

### Sécurité et exploitation

- 100 % des fonctions sensibles authentifiées et limitées ;
- zéro donnée de courrier familial dans Git ou sous URL publique permanente ;
- restauration testée au moins deux fois par an ;
- délai de correction des erreurs critiques inférieur à 24 heures.

### Expérience

- taux de réussite des parcours clés supérieur à 90 % en test utilisateur ;
- baisse des questions répétitives sur tarifs, visite et admission ;
- progression des demandes de visite et des départs vers ViaTrajectoire ;
- suivi du nombre de cartes envoyées et distribuées sans profiler les familles.

### Performance et accessibilité

- Core Web Vitals dans le vert au 75e percentile mobile ;
- zéro lien interne cassé en CI ;
- conformité RGAA mesurée et publiée ;
- sous-titres ou transcription pour 100 % des vidéos éditoriales.

### Vie sociale

- contenu « Aujourd'hui à Crécy » mis à jour au moins 4 jours sur 5 ;
- au moins une contribution intergénérationnelle par trimestre ;
- mesure qualitative de la satisfaction des familles et des équipes.

## 8. Gouvernance proposée

Chaque service doit avoir :

- un propriétaire métier ;
- un remplaçant ;
- une fréquence de mise à jour ;
- une règle de consentement ;
- une durée de conservation ;
- un indicateur de succès ;
- une procédure de retrait ou d'arrêt.

Répartition indicative :

| Domaine | Responsable proposé |
|---|---|
| Actualités, animations, « Aujourd'hui » | Animation |
| Admissions, tarifs, coordonnées | Administration / Direction |
| Postier et consentements famille | Administration avec référent RGPD |
| Galerie et droit à l'image | Animation + Direction |
| Recrutement et livret agents | RH |
| Sécurité, sauvegardes, performances | Référent technique |
| Accessibilité | Direction + référent accessibilité |

## 9. Prochain lot recommandé

Le prochain lot ne doit pas encore être une nouvelle animation visuelle. Il doit produire un **socle de confiance** :

1. verrouiller les trois fonctions exposées ;
2. corriger les liens et le téléphone, puis supprimer l'ancienne copie tarifaire 2025 ;
3. sécuriser l'architecture du Postier ;
4. ajouter tests et CI ;
5. réaliser la recette RGAA et mobile ;
6. lancer ensuite « Aujourd'hui à Crécy » comme premier service quotidien.

Une fois ce lot terminé, le site sera prêt à passer d'une excellente vitrine à un véritable service numérique de proximité.
