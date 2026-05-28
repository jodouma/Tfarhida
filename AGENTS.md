# AGENTS.md - Tfarhida Project Instructions

## Project Identity

Project name: Tfarhida
Subtitle: Mini-jeux sociaux tunisiens
Original concept: a multilingual social mini-games platform inspired by Tunisian culture.

The app must feel fun, modern, premium, Tunisian, social, and highly visual. It must not look like a basic text quiz app.

## Main Goal

Build a professional MVP for a PFE/PFA project.

The app should allow friends, families, students, and teams to play multiple social mini-games either:
1. Locally on one device, using local players and local saves.
2. Online in shared rooms, with multiple concurrent users and teams, using Firebase Auth and Firestore realtime sync when configured.

The app must be deployable on GitHub Pages.

## Hosting Constraint

The app will be hosted on GitHub Pages.

Therefore:
- It must be a static frontend application.
- It must work with Vite.
- It must support GitHub Pages routing and base path.
- It must not depend on a private server for the MVP.
- Any online account/multiplayer feature must use Firebase/Supabase-style external services.
- Do not hardcode secrets.
- Use `.env.example` for public frontend configuration keys.
- Never commit real `.env` files.

Expected GitHub repo: `jodouma/Tfarhida`
Expected GitHub Pages base: `/Tfarhida/`

Use `HashRouter` for GitHub Pages refresh safety.

## Tech Stack

Use React, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router, Zustand or React Context, Firebase Auth + Firestore as the optional online layer, localStorage for offline saves, and structured data files for questions, challenges, and translations.

Avoid heavy backends, SSR, overengineering, fake login systems that store real passwords locally, hardcoded secrets, and plain text-only UI.

## Languages

The app must support Tunisian Arabic / Derja as default, French, and English with language codes `tn`, `fr`, and `en`. UI and game content must be translated, and Derja views should be RTL-friendly.

## Core Product Modes

### Local Party Mode

Must work without internet account setup:
- Add/remove/edit players
- Choose avatars/emojis/colors
- Save players, language, settings, and session history per device
- Play all mini-games on one phone/tablet/PC
- Show scores, results, and winners

Use localStorage namespace `tfarhida.v1.*`.

### Online Room Mode

Implemented when Firebase config is available:
- Email/password auth with Firebase Auth
- Anonymous guest mode where possible
- Create/join room by code
- Realtime room state, teams, scores, current game, and results with Firestore

If Firebase env variables are missing, online mode must be disabled gracefully and local mode must keep working.

## Firebase Requirements

Create `src/services/firebase.ts`, `src/services/roomService.ts`, `src/services/authService.ts`, `.env.example`, and `docs/firebase-setup.md`. Never commit real keys.

## MVP Mini-Games

Implement at least:
- Would You Rather / تختار شنوّة؟ / Tu préfères ?
- Truth or Dare / صراحة ولا تحدّي / Action ou Vérité
- Guess the Word / إحزر الكلمة / Devine le mot
- Who's the Impostor / شكون الدخيل؟ / Qui est l'imposteur ?
- Tunisian Culture Quiz / كويز تونسي / Quiz culturel tunisien

Keep content funny, respectful, safe, and multilingual.

## Core Screens

Splash/Landing, Home, language selection, local player setup, online auth, create/join room, game library, game rules, game session, scoreboard, results, settings, and About/PFE presentation page.

## Design Direction

The design must be highly visual, responsive, mobile-first, and inspired by Tunisian pop culture, party cards, social board games, and warm modern app UI. Use local assets from `public/assets`, `public/assets/examples`, and `src/assets` where useful. Do not rely on external image URLs.

Use bright controlled color: yellow/orange for joy, pink/magenta for playful social energy, purple for mystery, teal/blue for clarity, red only for urgency, green for victory.

## Documentation

Create or update professional French docs in `docs/`: project overview, cahier de charge, architecture, game rules, Firebase setup, GitHub Pages deployment, MVP scope, and testing checklist.

## Quality Rules

Before finishing, run `npm run build`, `npm run typecheck`, and `npm run lint` if configured. Fix TypeScript errors. Do not pretend incomplete work is finished. Always list what was done, what remains, and how to test.
