# Tests du mode en ligne

Contexte de validation actuel :

- Firebase project ID : `tfarhida-d1f5c`
- Firestore rules : déployées avec succès
- Build GitHub Pages : doit recevoir les variables `VITE_FIREBASE_*` via GitHub Actions
- Auth anonyme : doit être activé dans Firebase Console pour exécuter les tests réels

## Sans Firebase

- Ouvrir `/#/online`.
- Vérifier que l’écran indique clairement que Firebase est requis.
- Vérifier qu’aucun formulaire email/mot de passe factice n’apparaît.
- Vérifier que le bouton “Jouer en local” mène à la configuration des joueurs.
- Ouvrir `/#/room/ABC123`.
- Vérifier que la page explique que les liens de salle nécessitent Firebase.

## Avec Firebase configuré

Préparer `.env.local`, activer Firebase Auth anonyme et Firestore, puis lancer :

```bash
npm run dev
```

Scénario création :

1. Ouvrir `/#/online`.
2. Saisir un pseudo hôte.
3. Créer une salle.
4. Vérifier que l’URL devient `/#/room/CODE`.
5. Copier le lien.
6. Ouvrir le lien dans un autre navigateur ou profil.
7. Rejoindre avec un autre pseudo.
8. Vérifier que les joueurs apparaissent en temps réel.
9. Démarrer la partie depuis l’hôte.
10. Voter dans chaque navigateur.
11. Vérifier que les résultats et scores se synchronisent.
12. Démarrer une manche suivante.
13. Quitter la salle.

## Passage validé localement

La validation réelle a été exécutée en deux contexts Playwright, avec :

- création de salle ;
- join par code ;
- lobby visible côté hôte et invité ;
- rafraîchissement invité ;
- vote croisé ;
- révélation des résultats ;
- passage à la manche suivante ;
- fin de partie ;
- sortie de salle.

Captures locales disponibles :

- `docs/report/evidence/runtime/01-host-lobby.png`
- `docs/report/evidence/runtime/02-guest-lobby.png`
- `docs/report/evidence/runtime/03-host-vote.png`
- `docs/report/evidence/runtime/05-host-results-round1.png`
- `docs/report/evidence/runtime/07-host-ended.png`

## Si GitHub CLI ne peut pas gérer les variables

Créer manuellement les variables dans :

GitHub → Settings → Secrets and variables → Actions → Variables

Variables attendues :

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Résultat attendu pour le build

Le mode online est lazy-loaded. Après `npm run build`, on doit observer :

```text
dist/assets/app.js
dist/assets/OnlineRoutes.js
```

Le SDK Firebase doit se trouver dans le chunk `OnlineRoutes.js`, pas dans le flux local principal.

## Commandes de validation

```bash
npm run typecheck
npm run lint
npm run build
grep -R "/src/main.tsx" dist/index.html
```

La dernière commande ne doit rien retourner en production.
