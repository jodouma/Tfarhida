# Configuration Firebase

1. Créer un projet sur Firebase Console.
2. Ajouter une application Web.
3. Copier les clés publiques dans `.env.local` selon `.env.example`.
4. Activer Authentication puis Email/Password.
5. Activer Firestore Database.

Collections suggérées :
- `rooms`
- `rooms/{roomId}/events`

Structure de `rooms` :

```json
{
  "code": "ABC123",
  "hostId": "uid",
  "gameId": "impostor",
  "players": [],
  "teams": [],
  "scores": {},
  "phase": "lobby",
  "updatedAt": 1710000000000
}
```

Pour une démo MVP, limiter l'écriture aux utilisateurs authentifiés et valider que les joueurs appartiennent à la salle.
