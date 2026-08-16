# Supervision du site

## Points à surveiller

- page d'accueil : `https://ehpad-crecy.netlify.app/` ;
- état des fonctions : `https://ehpad-crecy.netlify.app/.netlify/functions/health` ;
- page Admissions et tarifs : `https://ehpad-crecy.netlify.app/admissions/` ;
- portail du Postier : `https://ehpad-crecy.netlify.app/familles/`.

## Configuration recommandée

Configurer un outil de surveillance HTTP avec les règles suivantes :

- contrôle toutes les cinq minutes de la page d'accueil et du point de santé ;
- succès attendu : HTTP 200 en moins de cinq secondes ;
- alerte après deux échecs consécutifs ;
- notification par e-mail à l'administrateur technique ;
- rapport mensuel de disponibilité.

Le Postier ne doit être surveillé qu'avec une requête GET sur sa page. Ne jamais placer un code de résident dans un outil externe de supervision.

## Contrôles après chaque déploiement

1. vérifier le résultat de l'action GitHub « Qualité du site » ;
2. ouvrir l'accueil, Admissions, Contact, Galerie et Familles ;
3. vérifier un envoi de test du formulaire de contact ;
4. vérifier la connexion administrateur ;
5. consulter les journaux Netlify Functions et rechercher les réponses 5xx ;
6. contrôler LCP, INP et CLS sur téléphone.

## Réaction à une alerte

- confirmer l'incident depuis un autre réseau ;
- consulter le dernier déploiement Netlify et les journaux des fonctions ;
- revenir au dernier déploiement sain si l'incident suit une publication ;
- noter la cause, la durée et la correction dans le journal de maintenance ;
- ne jamais copier de message familial, de code résident ou de photo dans un ticket d'incident.
