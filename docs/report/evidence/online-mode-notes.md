# Notes de preuve — mode en ligne Firebase

## État implémenté

Le mode en ligne Firebase a été transformé d’un stub en MVP fonctionnel configurable.

Contexte de validation :

- Firebase project ID : `tfarhida-d1f5c`
- App Web créée : `Tfarhida Web`
- Firestore rules déployées avec succès
- `.env.local` présent localement pour la validation du runtime
- Variables GitHub Actions attendues : `VITE_FIREBASE_*`

Fonctions présentes dans le code :

- détection sûre de la configuration Firebase ;
- initialisation Firebase uniquement si les variables Vite existent ;
- authentification anonyme ;
- création de salle Firestore ;
- route `/#/room/:code` compatible HashRouter ;
- inscription des joueurs dans `rooms/{code}/players/{uid}` ;
- synchronisation en temps réel de la salle et des joueurs ;
- démarrage de partie par l’hôte ;
- jeu en ligne synchronisé pour `would-you-rather` ;
- votes stockés dans `rounds/{roundId}/submissions/{uid}` ;
- résultats et scores synchronisés ;
- règles Firestore MVP dans `firestore.rules`.
- routes online chargées paresseusement dans `OnlineRoutes.js` afin de garder le mode local léger.
- listeners Firestore protégés par callbacks d’erreur afin d’éviter un écran cassé en cas de permission refusée ou salle absente.
- la build GitHub Pages doit injecter les variables publiques Firebase au moment du build, sans service account.

## Validation du passage actuel

- Le fichier `.env.local` de travail existe localement, reste non commité et est ignoré par Git.
- Le test Firebase réel à deux navigateurs a été exécuté et validé dans ce passage.
- Le chemin “Firebase non configuré” est validé par inspection et build : l’UI affiche l’état configuration requise, et les services renvoient une erreur claire.
- Le build sépare désormais le bundle local et le bundle online :
  - `dist/assets/app.js` : environ 313.54 KB ;
  - `dist/assets/OnlineRoutes.js` : environ 454.34 KB.
- La commande de contrôle ne trouve pas de référence brute à `/src/main.tsx` dans `dist/index.html`.
- Les règles Firestore limitent désormais les mises à jour self-service des joueurs aux champs de présence/profil (`displayName`, `avatar`, `color`, `online`, `lastSeenAt`). Les champs sensibles comme `score` et `isHost` ne doivent pas être modifiés librement par un joueur non-hôte.
- Les domaines autorisés à vérifier dans Firebase Console sont `jodouma.github.io`, `localhost`, `127.0.0.1`.
- Capture d’écran locale disponible :
  - `docs/report/evidence/runtime/01-host-lobby.png`
  - `docs/report/evidence/runtime/02-guest-lobby.png`
  - `docs/report/evidence/runtime/03-host-vote.png`
  - `docs/report/evidence/runtime/04-host-after-vote.png`
  - `docs/report/evidence/runtime/05-host-results-round1.png`
  - `docs/report/evidence/runtime/06-guest-results-round1.png`
  - `docs/report/evidence/runtime/07-host-ended.png`
  - `docs/report/evidence/runtime/08-guest-ended.png`

## Résultat runtime validé

- Création de salle : validée.
- Rejoindre une salle par code : validé sur deux contexts Playwright.
- Affichage du lobby côté hôte et côté invité : validé.
- Rafraîchissement côté invité : validé.
- Vote croisé sur `Would You Rather` : validé.
- Blocage du double vote par l’UI : validé.
- Révélation et synchronisation des scores : validées.
- Passage à la manche suivante : validé.
- Fin de partie : validée.
- Quitter la salle : validé.

## Limites à présenter dans le rapport

- Le mode en ligne dépend d’un projet Firebase réel et de `.env.local`.
- Le jeu online complet validé est `Would You Rather`.
- Les jeux `Truth or Dare`, `Guess Word`, `Who’s the Impostor` et `Tunisian Quiz` restent locaux pour cette étape.
- Le modèle `private/{uid}` est prévu pour les jeux à données cachées, mais l’anti-triche complet n’est pas garanti dans une application frontend-only.
- Les règles Firestore sont raisonnables pour une démo PFE mais doivent être durcies avant production publique.
