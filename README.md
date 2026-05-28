# Tfarhida

Mini-jeux sociaux tunisiens, construits comme MVP PFE/PFA avec React, Vite, TypeScript, Tailwind CSS et Firebase optionnel.

## Public URL

Application déployée sur GitHub Pages :

https://jodouma.github.io/Tfarhida/

## Contexte académique

Tfarhida est un projet PFE/Bachelor réalisé à Leaders University — Nabeul pour l’année universitaire 2025–2026.

Réalisé par :

- Yosra El Hadj Brayek
- Wassim Chommakh

Encadrante pédagogique :

- Madame Imen Herzi

Le concept initial **BitBox** a évolué vers **Tfarhida**, une identité plus ancrée dans la culture tunisienne et mieux adaptée à une application de mini-jeux sociaux.

## Fonctionnalités

- Mode local immédiat avec joueurs, avatars, scores et sauvegarde `localStorage`
- Aucun faux joueur créé automatiquement; les bots démo doivent être ajoutés explicitement
- Cinq mini-jeux MVP: Impostor, Action ou Vérité, Tu préfères, Devine le mot, Quiz culturel tunisien
- Interface multilingue: `tn`, `fr`, `en`
- UI responsive, mobile-first, visuelle et animée avec Framer Motion
- Architecture Firebase Auth + Firestore optionnelle pour les salles en ligne
- Liens de partage locaux pour ouvrir le même jeu sur un autre appareil
- Déploiement GitHub Pages avec base `/Tfarhida/` et `HashRouter`
- Rapport PFE final généré en Markdown, DOCX et PDF dans `docs/report/`

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

Important :

- Un lien local ouvre seulement le même jeu; les scores restent locaux à chaque appareil.
- Un lien de salle `/#/room/:roomCode` devient temps réel seulement avec Firebase configuré.
- L'application ne stocke jamais de mots de passe dans `localStorage`.

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

## Captures et rapport

Les captures finales sont disponibles dans :

```text
docs/assets/report/screenshots/
```

Le rapport final est disponible dans :

```text
docs/report/rapport-pfe-tfarhida.md
docs/report/Rapport_PFE_Tfarhida_Yosra_El_Hadj_Brayek.docx
docs/report/Rapport_PFE_Tfarhida_Yosra_El_Hadj_Brayek.pdf
```

## Limitations

- Le mode local est fonctionnel.
- Les salles en ligne temps réel nécessitent une configuration Firebase réelle.
- L’application ne simule pas de faux multijoueur.
