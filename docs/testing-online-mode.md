# Tests du mode en ligne

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
