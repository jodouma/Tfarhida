# Déploiement GitHub Pages

Le projet est configuré avec :
- `base: "/Tfarhida/"` dans `vite.config.ts`
- `HashRouter` pour le routage
- Workflow GitHub Actions dans `.github/workflows/deploy.yml`
- Bundle racine `assets/app.js` et `assets/app.css` pour éviter que GitHub Pages serve le `index.html` Vite brut si la source Pages est configurée sur la branche `main`.

Étapes :

```bash
npm ci
npm run build
git push origin main
```

Dans GitHub, activer Pages avec la source GitHub Actions.

## Vérification anti page blanche

Le fichier public ne doit pas charger `/src/main.tsx` en production. La page doit charger :

```text
/Tfarhida/assets/app.js
/Tfarhida/assets/app.css
```

Commande de contrôle :

```bash
curl -L https://jodouma.github.io/Tfarhida/
```
