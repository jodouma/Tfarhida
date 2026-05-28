# Déploiement GitHub Pages

Le projet est configuré avec :
- `base: "/Tfarhida/"` dans `vite.config.ts`
- `HashRouter` pour le routage
- Workflow GitHub Actions dans `.github/workflows/deploy.yml`

Étapes :

```bash
npm ci
npm run build
git push origin main
```

Dans GitHub, activer Pages avec la source GitHub Actions.
