# Site Officiel de l'EHPAD de Crécy-la-Chapelle

Site web public, accessible (RGAA 100%), éco-conçu et intégrant des services d'assistance IA et de vie sociale.

---

## 🚀 Déploiement & Préservation du Quota Netlify

> **⚠️ Quota Netlify (Build Minutes) :** Les builds automatiques sont mis en pause (**Stopped builds**) pour ne pas gaspiller le quota gratuit de 300 minutes.

### 1. Déploiement direct en local (Recommandé — 0 minute Netlify !)
```bash
npm run deploy:direct
```
*Cette commande compile le site en local et le publie directement sur Netlify en quelques secondes sans utiliser de minutes de build serveur.*

### 2. Développement local
```bash
npm run dev
```

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Dépannage / Troubleshooting

### Erreur Build Netlify : TypeScript & Framer Motion

Si le build échoue avec une erreur TypeScript concernant `RefAttributes<HTMLSpanElement>` ou des types incompatibles dans `PageHeader.tsx` (ou autres composants utilisant framer-motion), c'est souvent dû à une inférence de type stricte sur les variants.

**Solution :**
Il faut typer explicitement les objets variants avec `Variants` de `framer-motion`.

Exemple :
```typescript
import { Variants } from "framer-motion";

const variants: Variants = {
  hidden: { ... },
  visible: (i: number) => ({ ... })
};
```

Cette modification a été appliquée le 28/01/2026 pour corriger l'erreur de build exit code 2.
