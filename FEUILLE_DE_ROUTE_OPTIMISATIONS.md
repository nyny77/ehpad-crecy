# 🚀 Feuille de route - Prochaines étapes et Optimisations

Ce document liste les chantiers restants et les nouvelles idées validées pour continuer à améliorer le site de l'EHPAD de Crécy, suite à la mise en place de la PWA et de la refonte de l'administration.

## 1. Le Grand Chantier : Le "Postier Numérique" (Carte Postale) 💌
**Statut : Validé - À implémenter lors de la prochaine session**
- **Objectif** : Créer un service où les familles peuvent envoyer un mot et une photo à un résident via le site.
- **Approche technique** :
  - **Authentification** : Utilisation d'un système de "Code Secret" par résident (ex: `MARIE-7845`) pour éviter aux familles de devoir créer des mots de passe.
  - **Espace Famille** : Une page `/familles` permettant d'entrer le code et de rédiger le message avec upload de photo (compression automatique WebP intégrée).
  - **Stockage** : Utilisation de l'API GitHub via une Netlify Function pour sauvegarder les messages dans un fichier JSON (`data/messages.json`).
  - **Espace Admin** : Ajout d'onglets `/administration/residents` (pour gérer les codes secrets) et `/administration/courrier` (pour lire et imprimer les messages reçus).
  - **Nettoyage auto** : Suppression de la photo sur GitHub une fois le message marqué "Distribué" pour ne pas saturer le stockage gratuit.

## 2. Optimisations des Médias (Éco-conception) 🍃
**Statut : Terminé 🎉**
- La page "Histoire" (`/histoire`) a été optimisée avec un composant vidéo plus léger et une meilleure compression des assets pour garantir un chargement instantané.

## 3. Micro-animations au défilement ✨
**Statut : Terminé 🎉**
- L'intégration de `framer-motion` a été réalisée sur les pages "Admissions" et "Contact", offrant une apparition en douceur des paragraphes et formulaires lors du défilement.

## 4. Générateur de Gazette intégré 📰
**Statut : Terminé 🎉**
- **Réalisation** : Au lieu d'uploader un simple PDF, l'interface `/administration` possède désormais un éditeur de Gazette complet.
- **Fonctionnalités** : 
  - Création via des blocs empilables (Gros Titre, Paragraphe, Photo, Sommaire automatique).
  - Intégration d'un moteur de recherche de photos libres de droits (Flickr) directement dans l'interface, sans clé d'API requise.
  - Sauvegarde et génération automatique en page web responsive (remplaçant le PDF statique).

---

## 📋 Message à transmettre à la prochaine conversation

Lorsque vous reprendrez le travail avec l'assistant IA, vous pourrez simplement lui **copier-coller le texte suivant** pour qu'il reprenne exactement là où nous nous sommes arrêtés :

> "Reprends le chantier d'optimisation du site EHPAD Crécy. Nous venons de terminer avec succès la création du **Générateur de Gazette intégré** avec son moteur de recherche d'images Flickr.
> Ton objectif immédiat est de commencer l'implémentation du **Postier Numérique** (le système de carte postale des familles) tel que décrit dans le fichier `FEUILLE_DE_ROUTE_OPTIMISATIONS.md`. Lis ce fichier, analyse l'état de l'administration actuelle dans `src/app/administration`, et propose-moi le plan d'action pour créer l'accès par code secret et la gestion du courrier."
