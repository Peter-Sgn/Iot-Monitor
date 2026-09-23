import unicodedata

PLAGES_PAR_TYPE = {
    "temperature": (17, 32),
    "humidite": (30, 80),
    "luminosite": (500, 900),
}

PLAGE_PAR_DEFAUT = (0, 100)

def _retirer_accents(texte: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", texte)
        if unicodedata.category(c) != "Mn"
    )


def get_plage(type_capteur: str) -> tuple[float, float]:
    """Renvoie (min, max) pour generer une valeur realiste selon le type du capteur."""
    normalized = _retirer_accents(type_capteur).strip().lower()
    return PLAGES_PAR_TYPE.get(normalized, PLAGE_PAR_DEFAUT)