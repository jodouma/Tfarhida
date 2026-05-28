# Diagrammes du rapport

Les fichiers `.mmd` sont les sources Mermaid utilisées par le rapport PFE.

Les exports PNG existants `01` à `04` proviennent du passage précédent. Les sources `05` à `10` ont été ajoutées pour renforcer le chapitre Conception.

Des versions SVG propres ont été générées pour `05` à `10` afin de disposer d’assets vectoriels lisibles pour le rapport :

- `05-modele-domaine.svg`
- `06-sequence-creation-salle.svg`
- `07-sequence-rejoindre-salle.svg`
- `08-sequence-vote-revelation.svg`
- `09-modele-firestore.svg`
- `10-pipeline-deploiement.svg`

Commande recommandée pour générer les exports SVG lorsque Mermaid CLI et Chromium sont disponibles :

```bash
npx @mermaid-js/mermaid-cli -i docs/assets/report/diagrams/05-modele-domaine.mmd -o docs/assets/report/diagrams/05-modele-domaine.svg
npx @mermaid-js/mermaid-cli -i docs/assets/report/diagrams/06-sequence-creation-salle.mmd -o docs/assets/report/diagrams/06-sequence-creation-salle.svg
npx @mermaid-js/mermaid-cli -i docs/assets/report/diagrams/07-sequence-rejoindre-salle.mmd -o docs/assets/report/diagrams/07-sequence-rejoindre-salle.svg
npx @mermaid-js/mermaid-cli -i docs/assets/report/diagrams/08-sequence-vote-revelation.mmd -o docs/assets/report/diagrams/08-sequence-vote-revelation.svg
npx @mermaid-js/mermaid-cli -i docs/assets/report/diagrams/09-modele-firestore.mmd -o docs/assets/report/diagrams/09-modele-firestore.svg
npx @mermaid-js/mermaid-cli -i docs/assets/report/diagrams/10-pipeline-deploiement.mmd -o docs/assets/report/diagrams/10-pipeline-deploiement.svg
```

Dans l’environnement courant, l’appel `npx @mermaid-js/mermaid-cli --version` n’a pas terminé dans un délai raisonnable. Les SVG ci-dessus ont donc été produits comme équivalents vectoriels lisibles, tandis que les sources Mermaid restent la référence éditable.
