from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.alerte import AlerteOut, AlerteResume
from app.services.alertes_service import get_alertes, get_alertes_resume

router = APIRouter(prefix="/alertes", tags=["alertes"])


@router.get("/", response_model=list[AlerteOut])
def list_alertes(
    statut: str | None = Query(default=None, description="Filtrer par statut : 'active' ou 'resolue'"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Liste les alertes de l'utilisateur connecte, les plus recentes en premier."""
    return get_alertes(db, current_user.id, statut)


@router.get("/resume", response_model=AlerteResume)
def alertes_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Renvoie les 3 compteurs pour les cartes stats de la page Alertes."""
    return get_alertes_resume(db, current_user.id)