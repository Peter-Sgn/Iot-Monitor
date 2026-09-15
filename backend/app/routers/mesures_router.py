from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.mesure import MesureCreate, MesureOut
from app.services.capteur_service import get_capteur_by_id
from app.services.mesure_service import enregistrer_mesure, get_mesures_historique

router = APIRouter(tags=["mesures"])


@router.post("/mesures", response_model=MesureOut, status_code=status.HTTP_201_CREATED)
def add_mesure(mesure_data: MesureCreate, db: Session = Depends(get_db)):
    """
    Reçoit une mesure envoyée par le simulateur de capteurs.
    Pas de vérification JWT ici : le simulateur est un service technique,
    pas un utilisateur humain (à sécuriser plus tard via une clé API dédiée).
    """
    return enregistrer_mesure(db, mesure_data)


@router.get("/capteurs/{capteur_id}/mesures", response_model=list[MesureOut])
def get_historique(
    capteur_id: int,
    depuis_heures: int = Query(default=24, description="Nombre d'heures d'historique à récupérer"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Renvoie l'historique des mesures d'un capteur, filtré par période."""
    # Vérifie que le capteur appartient bien à l'utilisateur connecté
    capteur = get_capteur_by_id(db, capteur_id, current_user.id)
    if not capteur:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Capteur introuvable")
    return get_mesures_historique(db, capteur_id, depuis_heures)