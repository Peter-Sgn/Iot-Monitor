from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.mesure import Mesure
from app.models.capteur import Capteur
from app.schemas.mesure import MesureCreate
from app.services.alertes_service import gerer_alerte

def enregistrer_mesure(db: Session, mesure_data: MesureCreate) -> Mesure:
    """
    Point d'entrée unique pour enregistrer une mesure, peu importe
    son origine (REST aujourd'hui, MQTT potentiellement plus tard).
    """
    new_mesure = Mesure(
        valeur=mesure_data.valeur,
        capteur_id=mesure_data.capteur_id,
        horodatage=datetime.utcnow(),
    )
    db.add(new_mesure)
    db.commit()
    db.refresh(new_mesure)

    
    capteur = db.query(Capteur).filter(Capteur.id == mesure_data.capteur_id).first()
    if capteur:
        gerer_alerte(db, capteur, new_mesure)
    return new_mesure


def get_mesures_historique(db: Session, capteur_id: int, depuis_heures: int = 24) -> list[Mesure]:
    seuil_temps = datetime.utcnow() - timedelta(hours=depuis_heures)
    return (
        db.query(Mesure)
        .filter(Mesure.capteur_id == capteur_id, Mesure.horodatage >= seuil_temps)
        .order_by(Mesure.horodatage.asc())
        .all()
    )