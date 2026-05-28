# Configuration Firebase

Projet réellement utilisé pour le MVP :

- Project ID : `tfarhida-d1f5c`
- Nom d’affichage du projet : `Tfarhida`
- Application Web : `Tfarhida Web`

## Étapes de configuration

1. Créer ou ouvrir le projet `tfarhida-d1f5c` dans Firebase Console.
2. Ajouter une application Web si elle n’existe pas déjà.
3. Copier les valeurs publiques dans `.env.local` à partir de `.env.example`.
4. Activer **Authentication** puis le fournisseur **Anonymous**.
5. Activer Firestore Database.
6. Déployer les règles de `firestore.rules` sur le projet réel.
7. Ajouter les domaines autorisés :
   - `jodouma.github.io`
   - `localhost`
   - `127.0.0.1`
8. Vérifier que les variables `VITE_FIREBASE_*` existent dans GitHub Actions pour la build GitHub Pages.

## Variables frontend attendues

Ces variables sont publiques côté navigateur. Elles servent uniquement à initialiser le SDK Firebase dans l’application Vite :

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Fallback GitHub CLI

Si `gh` est authentifié sur `jodouma/Tfarhida`, les variables GitHub Actions peuvent être créées avec :

```bash
gh variable set VITE_FIREBASE_API_KEY
gh variable set VITE_FIREBASE_AUTH_DOMAIN
gh variable set VITE_FIREBASE_PROJECT_ID
gh variable set VITE_FIREBASE_STORAGE_BUCKET
gh variable set VITE_FIREBASE_MESSAGING_SENDER_ID
gh variable set VITE_FIREBASE_APP_ID
```

Si `gh` n’est pas disponible, utiliser :

GitHub → Settings → Secrets and variables → Actions → Variables

## Modèle Firestore

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

Les règles Firestore ont été déployées avec succès sur `tfarhida-d1f5c`.
La configuration GitHub Pages doit injecter les variables `VITE_FIREBASE_*` au moment du build, sans clé privée.

Les autres jeux restent locaux et ne doivent pas être présentés comme synchronisés.
