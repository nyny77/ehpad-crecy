# Déploiement en Production (Préservation du Quota Netlify)

> **⚠️ Quota Netlify (Build Minutes) :** Les builds automatiques sont en mode **Stopped builds** sur Netlify pour éviter de consommer les 300 min/mois gratuites.

---

## Méthode 1 : Déploiement direct en local (Recommandé — 0 minute Netlify !)

Cette méthode compile le site sur votre PC et l'envoie directement en ligne sans consommer aucune minute Netlify :

```powershell
npm run deploy:direct
```
*(Ou demander simplement à Antigravity : « Déploie le site en production »).*

---

## Méthode 2 : Push GitHub & Déclenchement manuel

1. Dans **GitHub Desktop**, commiter les modifications (mettre `[skip ci]` dans le titre pour les commits intermédiaires).
2. Cliquer sur **Push origin**.
3. Quand vous souhaitez publier la version en ligne :
   - Aller sur [app.netlify.com](https://app.netlify.com) ➡️ **Deploys**
   - Cliquer sur **Trigger deploy** ➡️ **Deploy site**.

