# Inventaire des assets

Ce document décrit l'organisation finale des images et ressources visuelles du projet Tfarhida.

## `public/assets/app/`

Assets utilisables directement par l'application.

- `public/assets/app/games/` : visuels propres et sémantiques pour les cartes de jeux.
- `public/assets/app/backgrounds/` : fonds visuels génériques de l'application.
- `public/assets/app/icons/` : icônes ou pictogrammes applicatifs.
- `public/assets/app/avatars/` : avatars applicatifs, dont l'avatar bot de démonstration.

Les écrans de l'application doivent pointer uniquement vers ces visuels propres ou vers des icônes/gradients générés par l'interface.

## `public/assets/branding/`

Ressources de marque utilisées pour la documentation ou les pages institutionnelles.

- `public/assets/branding/logos/leaders-university-logo.png` : logo Leaders University téléchargé depuis le site officiel indiqué dans le cahier de livraison. Usage réservé au rapport/documentation.

## `public/assets/references/`

Images de référence, templates, captures d'inspiration ou éléments non destinés à l'interface finale.

- `handwritten-plan.jpeg` : photographie manuscrite conservée comme référence historique uniquement. Elle ne doit pas être utilisée dans l'application.
- `template-*.jpeg` : images de référence ou exemples visuels, séparés des assets applicatifs.

## `public/assets/examples/`

Dossier historique conservé pour éviter de supprimer des fichiers utilisateur. Les images de ce dossier ne sont plus utilisées par l'application finale.

## `docs/assets/report/`

Ressources utilisées dans le rapport PFE.

- `docs/assets/report/logos/` : logos institutionnels pour le rapport.
- `docs/assets/report/screenshots/` : captures d'écran finales de l'application.
- `docs/assets/report/diagrams/` : diagrammes de conception.
- `docs/assets/report/references/` : références non affichées dans l'application.

## Règle importante

L'image manuscrite de planification est conservée seulement comme référence documentaire. Elle n'est importée ni rendue dans aucun écran utilisateur de Tfarhida.
