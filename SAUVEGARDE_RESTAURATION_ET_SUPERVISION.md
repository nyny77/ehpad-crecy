# Sauvegarde, restauration et supervision

## Ce qui est sauvegardé

Le dépôt GitHub est la source de référence du site. Il contient le code, les pages, les médias publiés et les données actives utilisées par le Postier et l’administration. Chaque modification enregistrée crée une version récupérable dans l’historique Git.

Les variables secrètes Netlify ne se trouvent pas dans le dépôt. Elles doivent être conservées séparément par le responsable du site : paramètres Netlify, noms des variables, propriétaire des comptes et procédure de renouvellement. Ne jamais copier leur valeur dans un document du dépôt.

## Sauvegarde avant une intervention importante

1. Vérifier que les changements en cours sont enregistrés et publiés sur GitHub.
2. Créer une étiquette Git datée sur la dernière version saine : `git tag sauvegarde-AAAA-MM-JJ`.
3. Publier l’étiquette : `git push origin sauvegarde-AAAA-MM-JJ`.
4. Vérifier dans Netlify que le dernier déploiement de production est marqué comme réussi.
5. Vérifier que les variables indispensables sont toujours présentes dans **Site configuration > Environment variables**, sans les recopier dans GitHub.

## Restaurer le site

### Un fichier ou une donnée

Retrouver sa dernière version saine dans l’historique GitHub, rétablir cette version dans une nouvelle modification, puis laisser les tests et Netlify redéployer le site. Cette méthode préserve l’historique et évite les réinitialisations destructrices.

### Une version complète

1. Identifier le commit ou l’étiquette saine.
2. Créer une branche de restauration depuis la branche principale.
3. Utiliser `git revert` sur les modifications fautives, puis ouvrir une demande de fusion.
4. Attendre la réussite des contrôles automatiques avant la fusion.
5. Après le déploiement Netlify, vérifier l’accueil, Contact, Admissions, Administration, le Postier et `/.netlify/functions/health`.

Ne pas utiliser `git reset --hard` sur la branche principale : cela peut effacer des versions utiles et compliquer la récupération des courriers ou médias.

## Journal technique des erreurs

Les fonctions Netlify importantes écrivent désormais des événements structurés comprenant la date, la fonction concernée, l’identifiant technique de la requête et le type d’erreur. Le contenu des messages familiaux et des formulaires n’est pas journalisé. Ces événements sont consultables dans **Netlify > Logs & Metrics > Functions**.

## Supervision et alertes

Le workflow **Supervision de production** contrôle automatiquement le site toutes les six heures. Il vérifie les pages essentielles, le formulaire Contact, les pages Admission et Administration, le Postier, le contrôle de santé et la protection de la fonction d’administration.

Si un contrôle échoue, le workflow GitHub échoue et crée une alerte dans les issues du dépôt. Une nouvelle défaillance complète la même alerte pour limiter les doublons. Les responsables doivent activer les notifications GitHub du dépôt pour être avertis par courriel.

L’adresse surveillée par défaut est `https://ehpadcrecy.netlify.app`. La variable GitHub facultative `PRODUCTION_URL` permet de la remplacer plus tard par un nom de domaine officiel sans modifier le script.
