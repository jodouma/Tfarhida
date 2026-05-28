# Architecture

## Frontend

React/Vite/TypeScript avec Tailwind CSS. Le routage utilise `HashRouter` pour éviter les erreurs 404 sur GitHub Pages.

## État local

Zustand centralise la langue, les joueurs, les scores et l'historique. Les données persistantes utilisent le namespace `tfarhida.v1.*`.

## Mode en ligne

Firebase est initialisé uniquement si toutes les variables `VITE_FIREBASE_*` sont présentes. Sans configuration, les routes `/online` et `/room/:code` affichent un état honnête indiquant que Firebase est requis.

Lorsque Firebase est configuré, `authService` utilise l’authentification anonyme pour identifier les joueurs invités. `roomService` synchronise les documents Firestore `rooms`, `players`, `rounds` et `submissions`. Le MVP en ligne validé couvre le jeu **Tu préfères ?** avec lobby, lien partageable `/#/room/CODE`, votes temps réel, révélation et scores synchronisés.

Les autres jeux restent locaux dans cette version. Le rapport doit donc distinguer clairement les jeux locaux et le jeu synchronisé en ligne.

## Données

Les questions et prompts sont dans `src/data/games/content.ts`, avec les traductions `tn`, `fr`, `en`.
