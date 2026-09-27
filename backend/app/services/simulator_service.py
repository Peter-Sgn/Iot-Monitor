import random
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.capteur import Capteur
from app.models.mesure import Mesure
from app.schemas.mesure import MesureCreate
from app.services.mesure_service import enregistrer_mesure

PLAGES_PAR_TYPE = {
    "temperature": (17, 32),
    "humidite": (30, 80),
    "luminosite": (500, 900),
}

PLAGE_PAR_DEFAUT = (0, 100)

SEUIL_FRAICHEUR_SECONDES = 15


def _get_plage(type_capteur: str) -> tuple[float, float]:
    normalized = type_capteur.strip().lower()
    return PLAGES_PAR_TYPE.get(normalized, PLAGE_PAR_DEFAUT)


def simuler_mesures_pour_capteurs(db: Session, capteurs: list[Capteur]) -> int:
    """
    Genere une nouvelle mesure simulee pour chaque capteur dont la derniere
    mesure date de plus de SEUIL_FRAICHEUR_SECONDES. Declenchee par une vraie
    visite utilisateur, pas par un cron externe.
    """
    compteur = 0
    maintenant = datetime.utcnow()

    for capteur in capteurs:
        derniere = (
            db.query(Mesure)
            .filter(Mesure.capteur_id == capteur.id)
            .order_by(Mesure.horodatage.desc())
            .first()
        )
        if derniere and (maintenant - derniere.horodatage).total_seconds() < SEUIL_FRAICHEUR_SECONDES:
            continue

        valeur_min, valeur_max = _get_plage(capteur.type)
        valeur = round(random.uniform(valeur_min, valeur_max), 2)
        enregistrer_mesure(db, MesureCreate(valeur=valeur, capteur_id=capteur.id))
        compteur += 1

    return compteur