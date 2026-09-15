from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.capteur_service import get_capteurs_by_user
from app.services.mesure_service import get_mesures_historique
from app.services.alertes_service import verifier_alerte

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/resume")
def get_dashboard_resume(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Vue agrégée pour la page d'accueil du dashboard :
    pour chaque capteur, renvoie sa dernière valeur connue et son statut d'alerte.
    """
    capteurs = get_capteurs_by_user(db, current_user.id)
    resume = []

    for capteur in capteurs:
        # Récupère uniquement la dernière heure pour avoir la mesure la plus récente
        mesures_recentes = get_mesures_historique(db, capteur.id, depuis_heures=1)
        derniere_mesure = mesures_recentes[-1] if mesures_recentes else None

        resume.append({
            "capteur_id": capteur.id,
            "nom": capteur.nom,
            "type": capteur.type,
            "unite": capteur.unite,
            "seuil_min": capteur.seuil_min,
            "seuil_max": capteur.seuil_max,
            "derniere_valeur": derniere_mesure.valeur if derniere_mesure else None,
            "derniere_mesure_le": derniere_mesure.horodatage if derniere_mesure else None,
            "statut": verifier_alerte(capteur, derniere_mesure) if derniere_mesure else "aucune_donnee",
        })

    return resume