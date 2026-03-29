Pour chaque blog post il faut calculer la longueur du texte pour lafficher sur les card et sur la page du blog post. Pour ce faire utiliser cette methode ci dessous:

```python
from dataclasses import dataclass
from typing import Literal, Dict, Any


ReadingMode = Literal["silent_nonfiction", "silent_fiction", "aloud"]


@dataclass(frozen=True)
class ReadingProfile:
    base_wpm: float
    ref_chars_per_word: float
    label: str


PROFILES: Dict[ReadingMode, ReadingProfile] = {
    # Brysbaert et al. 2019/2021
    "silent_nonfiction": ReadingProfile(
        base_wpm=238.0,
        ref_chars_per_word=4.6,
        label="Lecture silencieuse adulte, texte informatif"
    ),
    "silent_fiction": ReadingProfile(
        base_wpm=260.0,
        ref_chars_per_word=4.2,
        label="Lecture silencieuse adulte, fiction"
    ),
    "aloud": ReadingProfile(
        base_wpm=183.0,
        ref_chars_per_word=4.6,
        label="Lecture à voix haute adulte"
    ),
}


def estimate_reading_time(
    word_count: int,
    char_count: int,
    mode: ReadingMode = "silent_nonfiction",
    clamp_wpm: bool = True,
) -> Dict[str, Any]:
    """
    Estime le temps moyen de lecture d'un texte à partir du nombre de mots
    et du nombre de caractères.

    Modèle:
        avg_chars_per_word = char_count / word_count
        adjusted_wpm = base_wpm * (ref_chars_per_word / avg_chars_per_word)
        time_minutes = word_count / adjusted_wpm

    Hypothèse:
        La vitesse de lecture diminue quand la longueur moyenne des mots augmente.

    Paramètres
    ----------
    word_count : int
        Nombre de mots du texte.
    char_count : int
        Nombre de caractères du texte (idéalement hors espaces, à documenter).
    mode : {"silent_nonfiction", "silent_fiction", "aloud"}
        Profil de lecture.
    clamp_wpm : bool
        Borne la vitesse ajustée pour éviter les valeurs aberrantes.

    Retour
    ------
    dict
        {
            "mode": str,
            "avg_chars_per_word": float,
            "adjusted_wpm": float,
            "time_minutes": float,
            "time_seconds": float,
            "display": str
        }
    """
    if word_count <= 0:
        raise ValueError("word_count doit être > 0")
    if char_count <= 0:
        raise ValueError("char_count doit être > 0")
    if mode not in PROFILES:
        raise ValueError(f"mode inconnu: {mode}")

    profile = PROFILES[mode]

    avg_chars_per_word = char_count / word_count
    adjusted_wpm = profile.base_wpm * (profile.ref_chars_per_word / avg_chars_per_word)

    # Garde-fou d'ingénierie, pas une constante de la littérature
    if clamp_wpm:
        adjusted_wpm = max(80.0, min(500.0, adjusted_wpm))

    time_minutes = word_count / adjusted_wpm
    time_seconds = time_minutes * 60.0

    minutes = int(time_seconds // 60)
    seconds = round(time_seconds % 60)

    return {
        "mode": profile.label,
        "avg_chars_per_word": round(avg_chars_per_word, 3),
        "adjusted_wpm": round(adjusted_wpm, 2),
        "time_minutes": round(time_minutes, 3),
        "time_seconds": round(time_seconds, 1),
        "display": f"{minutes} min {seconds:02d} s",
    }
```
