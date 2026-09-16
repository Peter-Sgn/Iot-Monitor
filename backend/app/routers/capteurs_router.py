from fastapi import APIRouter, Depends, HTTPException, status, Header 
from sqlalchemy.orm import Session
from app.core.config import settings

from app.core.dependencies import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.capteur import CapteurCreate, CapteurUpdate, CapteurOut
from app.services.capteur_service import (
    get_capteurs_by_user,
    get_capteur_by_id,
    create_capteur,
    update_capteur,
    delete_capteur,
    get_all_capteurs,
)

router = APIRouter(prefix="/capteurs", tags=["capteurs"])

@router.get("/all", response_model=list[CapteurOut])
def list_all_capteurs(x_api_key: str = Header(...)):
    """
    Liste tous les capteurs de tous les utilisateurs.
    Reservee au simulateur, protegee par une cle technique (pas un compte utilisateur).
    """
    if x_api_key != settings.simulator_api_key:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cle invalide")
    db = next(get_db())
    return get_all_capteurs(db)


@router.get("/", response_model=list[CapteurOut])
def list_capteurs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Liste tous les capteurs appartenant à l'utilisateur connecté."""
    return get_capteurs_by_user(db, current_user.id)


@router.post("/", response_model=CapteurOut, status_code=status.HTTP_201_CREATED)
def create_new_capteur(
    capteur_data: CapteurCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Crée un nouveau capteur pour l'utilisateur connecté."""
    return create_capteur(db, capteur_data, current_user.id)


@router.get("/{capteur_id}", response_model=CapteurOut)
def get_capteur(
    capteur_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Récupère le détail d'un capteur précis (uniquement s'il appartient à l'utilisateur connecté)."""
    capteur = get_capteur_by_id(db, capteur_id, current_user.id)
    if not capteur:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Capteur introuvable")
    return capteur


@router.put("/{capteur_id}", response_model=CapteurOut)
def update_existing_capteur(
    capteur_id: int,
    update_data: CapteurUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Modifie un capteur existant (nom, seuils, localisation...)."""
    capteur = get_capteur_by_id(db, capteur_id, current_user.id)
    if not capteur:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Capteur introuvable")
    return update_capteur(db, capteur, update_data)


@router.delete("/{capteur_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_capteur(
    capteur_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Supprime un capteur (et toutes ses mesures associées, via le cascade défini dans le modèle)."""
    capteur = get_capteur_by_id(db, capteur_id, current_user.id)
    if not capteur:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Capteur introuvable")
    delete_capteur(db, capteur)