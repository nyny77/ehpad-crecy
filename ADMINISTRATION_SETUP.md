# Administration intégrée — configuration GitHub/Netlify

L’interface est disponible à l’adresse `/administration`. Elle utilise le compte Netlify Identity existant et exige le rôle `admin`.

Toutes les photos de la galerie sont publiques. Lors d’un ajout, le navigateur redimensionne l’image à 1 920 px, la convertit en WebP et produit une miniature de 600 px avant l’envoi.

## 1. Créer le jeton GitHub

Dans GitHub, créer un **fine-grained personal access token** :

- propriétaire : compte qui possède `nyny77/ehpad-crecy` ;
- accès limité au dépôt `ehpad-crecy` ;
- permission **Contents: Read and write** ;
- aucune autre permission nécessaire.

Le même jeton gère la galerie et le blog. Ne jamais le placer dans le code ou le communiquer dans une conversation.

## 2. Variables Netlify

Dans **Site configuration → Environment variables**, ajouter :

```text
GITHUB_CONTENT_TOKEN=valeur-du-jeton
GITHUB_REPOSITORY=nyny77/ehpad-crecy
GITHUB_CONTENT_BRANCH=main
```

Déclencher ensuite un nouveau déploiement Netlify pour rendre la variable disponible aux fonctions.

## 3. Fonctionnement

### Photos

- ajout, compression et miniature depuis `/administration` ;
- commit atomique de l’image, de sa miniature et de `gallery.json` ;
- corbeille récupérable ;
- suppression définitive du fichier ;
- modification du titre, du texte alternatif et de l’ordre ;
- affichage après le déploiement Netlify, généralement en une à deux minutes.

### Blog

- création, modification et suppression depuis la même administration ;
- brouillons présents dans GitHub mais invisibles sur le blog public ;
- chaque enregistrement déclenche un déploiement Netlify.

## 4. Validation avant retrait de Decap

1. Vérifier la connexion d’un compte avec le rôle `admin`.
2. Vérifier le refus d’un compte famille.
3. Ajouter une photo depuis un téléphone.
4. Modifier son titre et son ordre.
5. Tester la corbeille, la restauration et la suppression définitive.
6. Publier puis modifier un article.
7. Vérifier le déploiement et l’affichage public.
8. Retirer Decap CMS seulement après ces contrôles.
