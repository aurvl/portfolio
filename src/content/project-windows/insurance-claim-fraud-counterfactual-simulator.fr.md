---
slug: "insurance-claim-fraud-counterfactual-simulator"
lang: "fr"
title: "Fraude à l'assurance : détecter et justifier les sinistres suspects"
summary: "Une méthode de détection et d'explication de la fraude, construite sur les données sinistres existantes d'un assureur, pour que les équipes sachent quels dossiers examiner et pourquoi."
---

# Overview

## La situation de l'assureur
L'assureur dispose déjà de son flux de données : les dossiers sinistres arrivent (formulaires, PDF, photos) et sont stockés dans une base PostgreSQL qui relie clients, contrats et sinistres. Ce qui lui manque, ce n'est pas la donnée, c'est une méthode : rien ne dit aujourd'hui quels dossiers sont suspects, ni pourquoi.

Les gestionnaires examinent donc les sinistres au cas par cas, sans priorité claire, et ont du mal à justifier un contrôle auprès d'un client ou de leur hiérarchie.

## L'enjeu
Le portefeuille compte `54 248` sinistres, dont environ `7,0 %` sont frauduleux. Un sinistre frauduleux coûte en moyenne `15 600 €`, contre `6 300 €` pour un sinistre normal. L'exposition à la fraude atteint environ `8,5 M€` par an.

La question posée est donc simple : **comment repérer les dossiers suspects et expliquer pourquoi ils le sont**, sans noyer l'équipe d'enquête sous les fausses alertes ?

## Exemple : un dossier qui arrive

Dossier illustratif, construit à partir des profils de sinistres du projet.

| Ce que contient le dossier | Valeur |
|---|---|
| Type de sinistre | Blessures corporelles après un accident de voiture |
| Montant réclamé | 18 400 € (un sinistre normal coûte 6 300 € en moyenne) |
| Dernier sinistre du même client | il y a 3 mois |
| Prestataire | une clinique déjà souvent associée à des dossiers suspects |
| Pièces jointes | formulaire, devis médical en PDF, photo du véhicule |

Pour le gestionnaire, rien ne distingue ce dossier des dizaines d'autres reçus la même semaine.

:::panel{tone="green" title="Ce que la méthode apporte sur ce dossier"}
- **Score de fraude : 0,91**, au-dessus du seuil d'alerte de 0,83. Le dossier passe en tête de la liste d'enquête.
- **Pourquoi il ressort :** un montant trois fois supérieur à la moyenne, un sinistre très rapproché du précédent et un prestataire déjà signalé.
- **Ce qui aurait changé la décision :** avec un montant d'environ 9 800 € et plus d'un an depuis le dernier sinistre, le dossier n'aurait pas été signalé.
- **Décision proposée :** demander le devis original à la clinique et vérifier l'historique du client avant de payer.
:::

# Method

## 1. Comprendre où se trouve la fraude
Un premier diagnostic sur les données existantes de l'assureur montre où se concentre le risque : les sinistres `bodily injury` (blessures corporelles) et `fire` (incendie) ont les taux de fraude les plus élevés, et certains prestataires ressortent durablement au-dessus du reste du réseau. Ce diagnostic oriente le reste de la méthode.

## 2. Un score calibré sur la capacité d'enquête
Plusieurs modèles sont comparés. Le modèle retenu, `XGBoost`, attribue à chaque dossier une probabilité de fraude. Le point clé est le seuil de décision : au lieu du `0,50` par défaut, il est fixé à `0,83`, pour privilégier la précision tout en gardant au moins `20 %` des fraudes détectées. **Chaque alerte coûte du temps d'enquête** : mieux vaut peu d'alertes fiables que beaucoup d'alertes douteuses.

## 3. Une explication pour chaque dossier signalé
Un score seul ne convainc personne. Pour chaque dossier à risque, la méthode produit un contre-factuel : ce qui aurait dû être différent pour que le dossier ne soit pas signalé (un montant réclamé plus bas, un délai plus long depuis le dernier sinistre…). Le gestionnaire dispose ainsi d'un argument concret et discutable.

## 4. Brancher la méthode sur le flux existant
La méthode est livrée sous forme d'API (FastAPI) qui se branche sur le flux de l'assureur : un dossier entre, l'API renvoie la probabilité de fraude, la décision et, si utile, le contre-factuel. Rien n'est à reconstruire côté données.

# Value

## Ce que l'assureur y gagne
Sur un premier lot de `100` dossiers récents, `4 %` dépassent le seuil d'alerte : l'équipe sait où regarder en premier. Les dossiers `bodily injury` y ont le score moyen le plus élevé et les prestataires suspects y sont surreprésentés, ce qui donne une piste d'enquête immédiate.

{purple}Dans plusieurs dossiers à haut risque, la décision bascule avec des changements plausibles, comme un montant réclamé plus bas ou un délai plus long depuis le sinistre précédent{/purple}. Ce n'est pas une preuve de fraude, mais une explication que l'équipe peut vérifier.

- [v] Une liste de dossiers à examiner en priorité, adaptée au nombre d'enquêteurs disponibles.
- [v] Une raison lisible pour chaque alerte, présentable à un gestionnaire ou à un client.
- [v] Une méthode qui s'ajoute aux outils existants de l'assureur, sans refonte de ses données.

## Ce que le projet montre
Le projet montre une démarche de conseil : partir de la situation réelle d'un client, identifier ce qui manque, et proposer une méthode qui répond à sa contrainte principale, le temps d'enquête. La modélisation est au service de la décision, pas l'inverse.
