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
**Statut : En attente**
- La page "Histoire" (`/histoire`) contient des vidéos et des images en très haute définition.
- **À faire** : Mettre en place un composant vidéo plus léger, compresser davantage les assets de la page, et s'assurer que le chargement est instantané même sur une connexion 3G/4G moyenne.

## 3. Micro-animations au défilement ✨
**Statut : En attente**
- Les pages "Admissions" et "Contact" sont un peu statiques comparées à l'Accueil et la page Histoire.
- **À faire** : Intégrer `framer-motion` sur ces pages pour que les paragraphes et les formulaires apparaissent en douceur lors du défilement (scroll).

## 4. Générateur de Gazette intégré 📰
**Statut : Idée bonus**
- Plutôt que d'uploader un PDF fait sur Word, créer un outil dans l'interface `/administration` permettant de rédiger la gazette "Petit Écho du Cœur" directement avec des blocs de texte et d'images, et qui s'occupe de la mise en page tout seul.

---

## 📋 Message à transmettre à la prochaine conversation

Lorsque vous reprendrez le travail avec l'assistant IA, vous pourrez simplement lui **copier-coller le texte suivant** pour qu'il reprenne exactement là où nous nous sommes arrêtés :

> "Reprends le chantier d'optimisation du site EHPAD Crécy. Nous avons récemment supprimé Decap CMS pour une administration sur mesure, implémenté l'archivage de la gazette, et transformé le site en PWA. 
> Ton objectif immédiat est de commencer l'implémentation du **Postier Numérique** (le système de carte postale des familles) tel que décrit dans le fichier `FEUILLE_DE_ROUTE_OPTIMISATIONS.md`. Lis ce fichier, analyse l'état de l'administration actuelle dans `src/app/administration`, et propose-moi le plan d'action pour créer l'accès par code secret."
