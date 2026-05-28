# Liens de partage et salles

## Lien local

Un lien local ouvre le même jeu sur un autre appareil, par exemple :

```text
https://jodouma.github.io/Tfarhida/#/play/impostor?lang=tn
```

Ce lien ne synchronise pas les joueurs, votes ou scores. Chaque appareil garde ses données dans son propre `localStorage`.

## Lien de salle en ligne

Une salle en ligne utilise le format :

```text
https://jodouma.github.io/Tfarhida/#/room/ABC123
```

La synchronisation temps réel nécessite Firebase Auth et Firestore configurés. Sans Firebase, l'application affiche une page honnête indiquant que les salles en ligne nécessitent une configuration Firebase.

## Règle importante

Tfarhida ne simule pas le multijoueur temps réel. Le local reste local; le realtime passe par Firebase.

## Statut actuel

Dans la livraison finale, le mode local est fonctionnel. Le mode salle en ligne est architecturalement préparé, mais il reste dépendant d’une configuration Firebase réelle avant d’être utilisable en production.
