# Notes de preuve — mode en ligne Firebase

## État implémenté

Le mode en ligne Firebase a été transformé d’un stub en MVP fonctionnel configurable.

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

## Validation du passage actuel

- Aucun fichier `.env.local` n’est présent dans l’environnement, donc le test Firebase réel à deux navigateurs n’a pas été exécuté.
- Le chemin “Firebase non configuré” est validé par inspection et build : l’UI affiche l’état configuration requise, et les services renvoient une erreur claire.
- Le build sépare désormais le bundle local et le bundle online :
  - `dist/assets/app.js` : environ 313 KB ;
  - `dist/assets/OnlineRoutes.js` : environ 454 KB.
- La commande de contrôle ne trouve pas de référence brute à `/src/main.tsx` dans `dist/index.html`.
- Les règles Firestore limitent désormais les mises à jour self-service des joueurs aux champs de présence/profil (`displayName`, `avatar`, `color`, `online`, `lastSeenAt`). Les champs sensibles comme `score` et `isHost` ne doivent pas être modifiés librement par un joueur non-hôte.

## Limites à présenter dans le rapport

- Le mode en ligne dépend d’un projet Firebase réel et de `.env.local`.
- Le jeu online complet validé est `Would You Rather`.
- Les jeux `Truth or Dare`, `Guess Word`, `Who’s the Impostor` et `Tunisian Quiz` restent locaux pour cette étape.
- Le modèle `private/{uid}` est prévu pour les jeux à données cachées, mais l’anti-triche complet n’est pas garanti dans une application frontend-only.
- Les règles Firestore sont raisonnables pour une démo PFE mais doivent être durcies avant production publique.
