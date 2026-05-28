# Architecture

## Frontend

React/Vite/TypeScript avec Tailwind CSS. Le routage utilise `HashRouter` pour éviter les erreurs 404 sur GitHub Pages.

## État local

Zustand centralise la langue, les joueurs, les scores et l'historique. Les données persistantes utilisent le namespace `tfarhida.v1.*`.

## Mode en ligne

Firebase est chargé uniquement si les variables `VITE_FIREBASE_*` sont présentes. Les services `authService` et `roomService` encapsulent Firebase Auth et Firestore.

## Données

Les questions et prompts sont dans `src/data/games/content.ts`, avec les traductions `tn`, `fr`, `en`.
