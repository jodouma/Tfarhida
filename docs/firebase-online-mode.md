# Mode en ligne Firebase

Ce document décrit l’état réel du mode en ligne de Tfarhida après le passage de stabilisation Firebase.

## Statut

- Mode local : fonctionnel sans compte et sans Firebase.
- Mode en ligne : disponible uniquement si les variables `VITE_FIREBASE_*` sont configurées.
- Jeu en ligne réellement synchronisé dans ce MVP : **Tu préfères ? / Would You Rather**.
- Les autres jeux restent jouables en mode local. Ils ne sont pas présentés comme multijoueurs temps réel.

## Principe

Tfarhida reste une application statique compatible GitHub Pages. Le navigateur charge le frontend React/Vite, puis Firebase fournit les services externes nécessaires au temps réel :

- Firebase Auth pour identifier les joueurs invités.
- Firestore pour synchroniser la salle, les joueurs, les manches, les votes et les scores.

Sans Firebase, l’application affiche une page de configuration requise et ne montre pas de faux formulaire de connexion ni de fausse salle.

Les routes online sont chargées paresseusement (`React.lazy`). Le SDK Firebase est donc placé dans un chunk séparé et n’alourdit pas le chargement initial du mode local.

## Variables d’environnement

Créer un fichier `.env.local` non commité :

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Ces valeurs sont les clés publiques de configuration client Firebase. Elles ne doivent pas être confondues avec des clés privées ou fichiers service account.

## Modèle Firestore

```text
rooms/{roomCode}
  code
  gameId
  hostUid
  hostName
  phase: lobby | playing | results | ended
  roundId
  roundIndex
  minPlayers
  maxPlayers
  settings.maxRounds
  scores
  createdAt
  updatedAt

rooms/{roomCode}/players/{uid}
  uid
  displayName
  avatar
  color
  isHost
  joinedAt
  lastSeenAt
  online
  score

rooms/{roomCode}/rounds/{roundId}
  roundId
  gameId
  phase: question | results
  roundIndex
  promptId
  choiceA
  choiceB
  createdAt
  updatedAt

rooms/{roomCode}/rounds/{roundId}/submissions/{uid}
  uid
  value
  submittedAt

rooms/{roomCode}/private/{uid}
  uid
  gameId
  privatePayload
```

## Parcours utilisateur

1. L’hôte ouvre `/#/online`.
2. Il saisit un pseudo et crée une salle.
3. L’application crée un utilisateur anonyme Firebase.
4. Firestore crée `rooms/{code}` et `rooms/{code}/players/{uid}`.
5. Le lien `https://jodouma.github.io/Tfarhida/#/room/CODE` peut être copié.
6. Les participants rejoignent avec un pseudo.
7. L’hôte démarre la partie si le nombre minimum de joueurs est atteint.
8. Chaque joueur vote.
9. Quand tous les votes sont présents, l’hôte révèle les résultats et les scores sont synchronisés.

## Limites MVP

- Le mode en ligne complet couvre seulement **Would You Rather**.
- Le client est une application frontend : il ne faut pas présenter ce mode comme anti-triche ou production-grade.
- Les données privées de jeux comme “Qui est l’imposteur” nécessitent un modèle `private/{uid}` et des règles plus strictes avant une vraie mise en ligne.
- Les règles Firestore fournies sont adaptées à une démo MVP authentifiée, mais elles doivent être revues avant une utilisation publique large.
