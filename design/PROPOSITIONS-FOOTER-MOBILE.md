# Pied de page mobile : 3 propositions

Aujourd'hui, sur un iPhone (390 px), le pied de page fait **812 px de haut**, soit presque un écran entier :
tout est empilé en une seule colonne (marque, puis Navigation 164 px, Profiles 164 px, Contact 128 px, puis la ligne
du bas de 101 px).

**Ce qui ne bouge pas dans les trois propositions** : le haut, avec le logo et la phrase d'accroche, reste centré,
exactement comme aujourd'hui. Seul le reste change.

Contenu à placer :

| Bloc | Liens |
| --- | --- |
| Navigation | About, Research, Projects & Blog, Resume (PDF) |
| Profiles | ORCID, ResearchGate, GitHub, Threads |
| Contact | Email, LinkedIn, « Get in touch → » |
| Ligne du bas | © 2026 · Cookies, langue FR / EN, « Back to top » |

---

## Proposition A : deux colonnes, puis le contact sur une ligne

Navigation et Profiles côte à côte. Le Contact passe dessous, sur toute la largeur, en une seule ligne.

```
┌──────────────────────────────────────┐
│                                      │
│              [ logo AV ]             │
│        Page Research (accroche)      │
│                                      │
│  NAVIGATION           PROFILES       │
│  About                ORCID          │
│  Research             ResearchGate   │
│  Projects & Blog      GitHub         │
│  Resume (PDF)         Threads        │
│                                      │
│  ──────────────────────────────────  │
│  CONTACT                             │
│  Email   LinkedIn   Get in touch →   │
│                                      │
│ ──────────────────────────────────── │
│  © 2026 · Cookies                    │
│  FR | EN          ↑ Back to top      │
└──────────────────────────────────────┘
```

- Hauteur estimée : environ **540 px** (gain d'environ 270 px).
- Avantage : c'est le plus proche de l'existant et il reste très lisible.
- Limite : « Get in touch → » peut passer à la ligne sur un petit écran (320 px).

---

## Proposition B : grille de 2 × 2

Quatre petits blocs de même taille : la ligne du bas est absorbée dans la grille, le pied de page ne fait plus
que deux « rangées » de contenu.

```
┌──────────────────────────────────────┐
│                                      │
│              [ logo AV ]             │
│        Page Research (accroche)      │
│                                      │
│  NAVIGATION           PROFILES       │
│  About                ORCID          │
│  Research             ResearchGate   │
│  Projects & Blog      GitHub         │
│  Resume (PDF)         Threads        │
│                                      │
│  CONTACT              LANGUAGE       │
│  Email                FR | EN        │
│  LinkedIn                            │
│  Get in touch →       ↑ Back to top  │
│                                      │
│ ──────────────────────────────────── │
│        © 2026 · Cookies              │
└──────────────────────────────────────┘
```

- Hauteur estimée : environ **500 px** (gain d'environ 310 px).
- Avantage : grille régulière, tout est à portée de pouce, la langue et « Back to top » sont regroupés.
- Limite : le bloc « Language » est un peu vide ; la ligne du bas se réduit au © et aux cookies.

---

## Proposition C : lignes compactes avec étiquette à gauche

Le plus court. Chaque groupe tient sur une seule ligne (ou deux), avec son titre en petites majuscules à gauche et
les liens à côté, séparés par des points. Style éditorial, comme un sommaire.

```
┌──────────────────────────────────────┐
│                                      │
│              [ logo AV ]             │
│        Page Research (accroche)      │
│                                      │
│ ──────────────────────────────────── │
│  NAVIGATION   About · Research ·     │
│               Projects & Blog ·      │
│               Resume (PDF)           │
│ ──────────────────────────────────── │
│  PROFILES     ORCID · ResearchGate · │
│               GitHub · Threads       │
│ ──────────────────────────────────── │
│  CONTACT      Email · LinkedIn ·     │
│               Get in touch →         │
│ ──────────────────────────────────── │
│  © 2026 · Cookies  FR | EN  ↑ Haut   │
└──────────────────────────────────────┘
```

- Hauteur estimée : environ **430 px** (gain d'environ 380 px).
- Avantage : le plus compact, filets fins entre les groupes, très « éditorial ».
- Limite : les liens sont plus serrés (zone de tap plus petite, je mettrais 44 px de haut par ligne pour rester
  confortable), et il faut bien aligner les retours à la ligne.

---

## Mon avis

- **B** si tu veux une grille régulière et propre, et ne plus avoir de ligne du bas séparée.
- **A** si tu veux rester proche de ce que tu as déjà.
- **C** si ta priorité est un pied de page vraiment court.

Les trois s'appliquent seulement sous 768 px. La tablette (deux colonnes) et l'ordinateur (quatre colonnes) ne
changent pas.
