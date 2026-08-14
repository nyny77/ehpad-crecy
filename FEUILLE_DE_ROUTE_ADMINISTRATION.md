# Feuille de route — reprise de l’administration du site

Document de passation préparé le 14 août 2026 pour reprendre le travail dans une nouvelle conversation.

## Objectif validé

Remplacer progressivement Decap CMS par une administration intégrée directement au site :

- connexion avec le compte administrateur Netlify Identity existant ;
- gestion des photos depuis `/administration` ;
- gestion du blog depuis la même page ;
- toutes les photos de la galerie sont publiques ;
- aucune utilisation de Cloudflare R2, Supabase ou d’un service demandant une carte bancaire ;
- stockage des images et du contenu dans le dépôt GitHub, puis déploiement automatique par Netlify.

## Décisions à conserver

1. Ne pas souscrire à Cloudflare R2 et ne pas fournir de carte bancaire.
2. Ne pas réintroduire de galerie privée : toutes les photos sont publiques.
3. Le dossier historique `public/images/private` porte un ancien nom, mais ses fichiers sont publics. Ne pas interpréter ce nom comme une protection.
4. Les nouvelles photos sont compressées dans le navigateur : WebP, largeur maximale de 1 920 px et miniature de 600 px.
5. Les fichiers source de plus de 15 Mo sont refusés et les fichiers compressés envoyés aux fonctions sont limités à 4 Mo.
6. Conserver Decap CMS comme solution de secours jusqu’à la validation complète en production.

## Travail déjà réalisé localement

- création de la page `/administration` ;
- protection de l’interface par Netlify Identity et rôle `admin` ;
- contrôle du rôle `admin` également dans chaque fonction Netlify ;
- ajout, modification, réorganisation, mise à la corbeille, restauration et suppression définitive des photos ;
- compression des images et création des miniatures dans le navigateur ;
- création, modification, suppression et brouillons pour le blog ;
- ajout d’une image principale aux articles ;
- enregistrement des photos, images de blog et articles dans GitHub ;
- liens du site redirigés vers `/administration` au lieu de Decap ;
- retrait du code et des dépendances Cloudflare R2/AWS ;
- ajout d’en-têtes `no-store` et `noindex` pour l’administration ;
- serveur local configuré avec Webpack sous Windows.

Fichiers principaux ajoutés ou modifiés :

- `src/app/administration/`
- `src/lib/admin-api.ts`
- `src/lib/image-processing.ts`
- `src/lib/blog.ts`
- `src/lib/gallery.ts`
- `netlify/functions/admin-gallery.ts`
- `netlify/functions/admin-blog.ts`
- `netlify/functions/admin-blog-image.ts`
- `netlify/functions/_shared/admin-auth.ts`
- `netlify/functions/_shared/github.ts`
- `ADMINISTRATION_SETUP.md`
- `netlify.toml`

## État des vérifications

Les contrôles suivants passent actuellement :

```powershell
& '.\node_modules\.bin\tsc.cmd' --noEmit
npm run lint
npm run build
```

La compilation de production génère correctement `/administration`, `/galerie` et `/blog`. Les 102 photos historiques sont présentes dans le JavaScript produit pour la galerie publique.

Le serveur local a été lancé sur :

```text
http://localhost:3000
http://localhost:3000/administration
```

Attention : les fonctions Netlify et l’authentification complète ne peuvent pas être validées avec le simple serveur Next.js. Le test final doit être effectué sur Netlify, ou avec Netlify Dev si l’environnement est correctement configuré.

## État Git important

Les changements ne sont pas encore commités ni poussés. La branche locale est `main` et le dépôt distant est :

```text
https://github.com/nyny77/ehpad-crecy.git
```

Les fichiers `dev-server.log` et `dev-server.error.log` étaient déjà modifiés par le fonctionnement du serveur. Ne pas les inclure automatiquement dans un commit sans vérifier leur utilité.

Avant toute modification supplémentaire :

```powershell
git status --short
git diff --check
```

Ne pas écraser les changements locaux avec `git reset --hard` ou `git checkout --`.

## Étapes à réaliser au travail

### 1. Relire et contrôler les changements locaux

```powershell
git status --short
git diff --stat
git diff --check
```

Vérifier en particulier que les modifications présentes correspondent bien à l’administration intégrée et qu’aucun secret n’a été ajouté au dépôt.

### 2. Créer un jeton GitHub sécurisé

Créer dans GitHub un **fine-grained personal access token** :

- propriétaire : compte possédant `nyny77/ehpad-crecy` ;
- accès limité uniquement au dépôt `ehpad-crecy` ;
- permission `Contents: Read and write` ;
- aucune autre permission nécessaire.

Ne jamais écrire la valeur du jeton dans un fichier, un commit, une capture d’écran ou une conversation.

### 3. Ajouter les variables dans Netlify

Dans **Site configuration → Environment variables**, ajouter :

```text
GITHUB_CONTENT_TOKEN=<jeton GitHub>
GITHUB_REPOSITORY=nyny77/ehpad-crecy
GITHUB_CONTENT_BRANCH=main
```

Puis déclencher un nouveau déploiement Netlify.

### 4. Vérifier le compte administrateur

Dans Netlify Identity, vérifier que le compte prévu pour administrer le site possède bien le rôle :

```text
admin
```

Un compte connecté sans ce rôle doit être refusé par l’interface et par les fonctions Netlify.

### 5. Commit et déploiement

Après revue, créer un commit ciblé sans inclure aveuglément les journaux du serveur. Pousser ensuite sur la branche reliée à Netlify.

Ne pas supprimer Decap CMS pendant cette étape.

### 6. Recette complète en production

Effectuer les tests suivants sur le véritable site Netlify :

- connexion avec le compte administrateur ;
- refus d’un compte non administrateur ;
- ajout d’une photo depuis un ordinateur ;
- ajout d’une photo depuis un téléphone ;
- vérification de la compression et de la miniature ;
- modification du titre et du texte alternatif ;
- changement de l’ordre des photos ;
- mise à la corbeille puis restauration ;
- suppression définitive d’une photo de test ;
- création d’un brouillon de blog, invisible publiquement ;
- publication d’un article avec une image ;
- modification puis suppression d’un article de test ;
- vérification de chaque commit automatique dans GitHub ;
- vérification du déploiement Netlify après chaque opération ;
- vérification publique de `/galerie` et `/blog` sans connexion.

### 7. Nettoyage final

Uniquement après réussite de toute la recette :

- retirer l’accès à Decap CMS du site ;
- supprimer ses fichiers de configuration devenus inutiles ;
- vérifier qu’aucun lien ne pointe encore vers `/admin` ;
- refaire TypeScript, lint et build ;
- conserver une procédure de renouvellement du jeton GitHub.

## Points de vigilance

- Chaque ajout ou modification crée un commit GitHub et déclenche normalement un déploiement Netlify. Éviter les dizaines d’actions de test inutiles.
- Une nouvelle photo n’apparaît pas instantanément : attendre la fin du déploiement Netlify.
- Une image ajoutée à un article est commitée avant l’article. Si l’article est finalement abandonné, l’image peut rester inutilisée dans `public/images/uploads/blog`.
- Le jeton GitHub doit avoir une date d’expiration raisonnable. Prévoir son renouvellement avant expiration.
- En cas d’erreur `403`, contrôler d’abord le rôle Netlify Identity du compte.
- En cas d’erreur GitHub, contrôler les trois variables Netlify et la permission `Contents: Read and write`.
- En cas d’erreur après une action réussie dans GitHub, consulter le déploiement Netlify correspondant.

## Statut Actuel : TERMINÉ ✅

**Mise à jour du 14 août 2026** :
- Les configurations Netlify et GitHub ont été finalisées et testées en production.
- **Nouvelle fonctionnalité ajoutée** : Gestion et archivage complet du "Petit Écho du Cœur" (Gazette) avec possibilité de consulter les anciens numéros directement sur le site public et de les nommer via l'administration.
- **Nettoyage final** : Decap CMS a été entièrement et définitivement retiré du code (suppression de `public/admin/` et des liens morts). L'administration intégrée sur mesure (`/administration`) prend officiellement et exclusivement le relais.

## Critère de fin

Le chantier est **officiellement terminé**. L’administrateur peut désormais gérer les photos publiques, le blog et l'Écho du Cœur entièrement depuis `/administration`, les opérations ont été testées, et Decap CMS a été retiré sans aucune régression.
