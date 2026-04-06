---
slug: "insurance-claim-fraud-counterfactual-simulator"
lang: "fr"
title: "Fraude assurance : détection et aide à la décision par contre-factuels"
summary: "Workflow complet de fraude assurance combinant intake JSON, PDF et image, analytics PostgreSQL, scoring optimisé et contre-factuels pour aider les équipes sinistres à prioriser les dossiers à risque."
---

# Overview

## Contexte métier
Ce projet est construit autour d'un vrai workflow assurance, et non autour d'un simple notebook de fraude. Un dossier sinistre arrive avec des champs CRM structurés, une pièce jointe PDF et une image. La question métier n'est donc pas seulement de savoir si le dossier paraît suspect, mais de structurer tout le cycle d'ingestion, de stockage, d'analyse, de scoring et d'explication.

L'objectif principal est l'aide à la décision. Le projet vise à aider les équipes fraude et sinistres à prioriser les dossiers à risque, à comprendre ce qui pousse un dossier vers une suspicion de fraude et à documenter pourquoi un fichier mérite ou non une revue plus approfondie. Le modèle n'est donc qu'une brique d'un système métier plus large.

## Pourquoi le projet compte
Le portefeuille historique synthétique contient `54 248` sinistres, avec un taux de fraude proche de `7,0 %`. Les sinistres identifiés comme frauduleux présentent un coût moyen d'environ `15,6k`, contre `6,3k` pour les sinistres non frauduleux. À l'échelle du portefeuille, l'exposition moyenne à la fraude atteint environ `8,5M` par an, ce qui donne une vraie justification business au travail de priorisation et de détection.

L'exploration met aussi en avant des signaux opérationnels concrets. Les sinistres `bodily injury` (blessures corporelles) et `fire` (incendie) concentrent les taux de fraude les plus élevés, tandis que certains prestataires ressortent avec des niveaux de suspicion durablement supérieurs au reste du réseau. L'enjeu du projet n'est donc pas d'automatiser une réponse binaire seule, mais de construire une couche analytique utile à l'investigation fraude.

# Method

## Workflow
Le pipeline démarre à partir d'une ingestion multimodale. Les dossiers sont traités sous forme de `JSON + PDF + image`, puis passent dans une couche d'extraction locale qui consolide les informations en enregistrements structurés. PostgreSQL devient le système de référence, avec une structure relationnelle organisée autour des clients, contrats d’assurance et sinistres reportés.

Ce choix d'architecture est important car il colle à un usage assureur réaliste.

## Choix analytiques et modélisation
L'analyse commence en SQL. Le projet intègre des scripts d'exploration métier et des vues réutilisables pour répondre à des questions telles que le taux de fraude du portefeuille, l'identification des prestataires suspects, l'exposition par type de sinistre, les dynamiques temporelles ou encore la composition du risque en production. La modélisation vient donc prolonger un diagnostic analytique, au lieu d'être un bloc isolé.

Du côté du modèle, plusieurs candidats et plusieurs stratégies de gestion du déséquilibre sont comparés, puis le seuil de décision est ajusté pour l'usage opérationnel au lieu de rester figé à `0.50`. Le modèle retenu est un modèle `XGBoost` avec oversampling et un seuil réglé à `0.83`, choisi avec un objectif orienté précision sous contrainte d'un rappel minimal (`20%`). C'est une logique plus crédible pour des équipes fraude, où **le coût d'investigation et les faux positifs comptent réellement**.

## Couche production et contre-factuels
Le service FastAPI expose l'ingestion des documents (JSON, PDF, image), le scoring des sinistres et la génération de contre-factuels. Une fois le dossier reçu, l'API renvoie une probabilité de fraude, une décision du modèle et, lorsque c'est utile, un contre-factuel heuristique montrant ce qu'il faudrait modifier pour rendre le dossier moins suspect.

C'est cette couche finale qui rend le projet vraiment distinctif. Elle transforme un système de scoring en outil d'aide à la décision que l'on peut discuter avec des profils métier avec l'orientation la moins technique possible.

# Value

## Ce que le projet démontre
Le projet montre comment passer d'entrées assurance brutes à une analyse fraude exploitable. Sur le flux pseudo-production réservé, les `100` premiers dossiers scorés font déjà ressortir un petit noyau de cas prioritaires : `4 %` dépassent le seuil de déploiement actif, `17 %` dépassent `0.50`, et les dossiers `bodily injury` portent le score moyen le plus élevé dans cette première tranche opérationnelle. Les prestataires suspects y sont aussi surreprésentés, ce qui offre un angle d'investigation immédiat.

La couche contre-factuelle apporte un signal business supplémentaire. {purple}Dans plusieurs cas à haut risque, la prédiction bascule avec des changements plausibles comme une baisse du montant réclamé ou un délai plus long depuis le précédent sinistre{/purple}. Cela ne constitue pas une vérité légale, mais aide à expliquer quels facteurs poussent réellement la suspicion et quels dossiers méritent une attention renforcée.

- [v] Le projet relie des données structurées, des documents, des images, du SQL analytique et une API FastAPI dans un même workflow assurance.
- [v] Le seuil de décision optimisé et le classement par niveau de risque rendent le modèle exploitable par des équipes sinistres, pas seulement intéressant en phase d’analyse.
- [v] La couche contre-factuelle donne une explication concrète de ce qu’il faudrait modifier pour réduire la suspicion de fraude.

## Valeur portfolio
Du point de vue du portfolio, ce projet démontre bien plus qu'un entraînement de modèle. Il montre une capacité à construire un workflow assurance de bout en bout combinant données structurées, documents, images, stockage relationnel, SQL analytique, API de production, scoring fraude optimisé et logique d'explication dans un même système cohérent.

Il est particulièrement pertinent pour des rôles à l'intersection de la data science, de la data engineering et du travail produit orienté métier. Le signal le plus fort n'est pas seulement qu'un modèle a été entraîné, mais que tout le workflow a été pensé pour être compréhensible, opérable et utile pour l'analyse de la fraude.
