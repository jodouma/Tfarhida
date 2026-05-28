# Tfarhida

Mini-jeux sociaux tunisiens, construits comme MVP PFE/PFA avec React, Vite, TypeScript, Tailwind CSS et Firebase optionnel.

## Public URL

Application déployée sur GitHub Pages :

https://jodouma.github.io/Tfarhida/

## Fonctionnalités

- Mode local immédiat avec joueurs, avatars, scores et sauvegarde `localStorage`
- Cinq mini-jeux MVP: Impostor, Action ou Vérité, Tu préfères, Devine le mot, Quiz culturel tunisien
- Interface multilingue: `tn`, `fr`, `en`
- UI responsive, mobile-first, visuelle et animée avec Framer Motion
- Architecture Firebase Auth + Firestore optionnelle pour les salles en ligne
- Déploiement GitHub Pages avec base `/Tfarhida/` et `HashRouter`

## Stack

React, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router, Zustand, Firebase.

## Développement local

```bash
npm install
npm run dev
```

Local URL: `http://localhost:5173/`

## Qualité

```bash
npm run typecheck
npm run lint
npm run build
```

## Déploiement GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit `dist/` et le publie sur GitHub Pages depuis `main`.

URL publique attendue :

```text
https://jodouma.github.io/Tfarhida/
```

La configuration Vite utilise `/Tfarhida/` en production et `/` en développement local.

Pour déployer :

```bash
git push origin main
```

Ensuite, vérifier l'action GitHub Pages dans l'onglet **Actions** du dépôt.

## Firebase optionnel

Copier `.env.example` vers `.env.local`, remplir les clés publiques Firebase, activer Auth email/password et Firestore. Sans ces variables, le mode en ligne est désactivé proprement et le mode local reste fonctionnel.

## Structure

```text
src/
  app/              état global
  components/       UI, layout, joueurs, jeux
  data/games/       contenu multilingue
  i18n/             traductions UI
  services/         localStorage, Firebase, auth, rooms
  types/            types TypeScript
docs/               documentation PFE/PFA
public/assets/      images locales
```

## Captures

Ajouter les captures finales dans `docs/` après déploiement ou présentation.
