# Configuration Firebase

1. Créer un projet sur Firebase Console.
2. Ajouter une application Web.
3. Copier les clés publiques dans `.env.local` selon `.env.example`.
4. Activer Authentication puis le fournisseur **Anonymous** pour le MVP de salles invitées.
5. Activer Firestore Database.
6. Déployer ou copier les règles de `firestore.rules`.

Collections suggérées :
- `rooms`
- `rooms/{roomId}/players`
- `rooms/{roomId}/rounds`
- `rooms/{roomId}/rounds/{roundId}/submissions`
- `rooms/{roomId}/private`
- `rooms/{roomId}/events`

Structure de `rooms` :

```json
{
  "code": "ABC123",
  "hostUid": "uid",
  "gameId": "would-you-rather",
  "scores": {},
  "phase": "lobby",
  "updatedAt": 1710000000000
}
```

Pour une démo MVP, limiter l'écriture aux utilisateurs authentifiés et valider que les joueurs appartiennent à la salle.

## Statut implémenté

Le mode Firebase réellement câblé dans le frontend couvre :

- authentification anonyme ;
- création de salle ;
- lien `/#/room/CODE` ;
- rejoindre une salle ;
- synchronisation des joueurs ;
- démarrage par l’hôte ;
- vote et résultats synchronisés pour **Tu préfères ?**.

Les autres jeux restent locaux et ne doivent pas être présentés comme synchronisés.
