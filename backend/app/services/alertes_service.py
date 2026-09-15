from datetime import datetime, timedelta 

from sqlalchemy.orm import Session

from app.models.alerte import Alerte
from app.models.capteur import Capteur
from app.models.mesure import Mesure


def verifier_alerte(capteur: Capteur, mesure: Mesure) -> str:
    
    # Retourne le statut du capteur suite à une nouvelle mesure :
    # ok', 'alerte_basse' ou 'alerte_haute'.
    
    if capteur.seuil_min is not None and mesure.valeur < capteur.seuil_min:
        return "alerte_basse"
    if capteur.seuil_max is not None and mesure.valeur > capteur.seuil_max:
        return "alerte_haute"
    return "ok"

def gerer_alerte(db: Session, capteur: Capteur, mesure: Mesure) -> None:
    """
    Point d'entrée appelé après chaque nouvelle mesure.
    Cree une alerte si un seuil est depasse (et qu'aucune n'est deja active),
    ou resout automatiquement l'alerte active si la mesure repasse dans les seuils.
    """
    statut = verifier_alerte(capteur, mesure)

    alerte_active = (
        db.query(Alerte)
        .filter(Alerte.capteur_id == capteur.id, Alerte.statut == "active")
        .first()
    )

    if statut == "ok":
        # Si une alerte etait active, on la resout - sans jamais la supprimer
        if alerte_active:
            alerte_active.statut = "resolue"
            alerte_active.resolue_le = datetime.utcnow()
            db.commit()
        return

    # statut = "alerte_haute" ou "alerte_basse"
    if alerte_active is None:
        # Aucune alerte active pour ce capteur -> on en cree une nouvelle
        type_alerte = "haute" if statut == "alerte_haute" else "basse"
        nouvelle_alerte = Alerte(
            type=type_alerte,
            valeur_mesuree=mesure.valeur,
            capteur_id=capteur.id,
        )
        db.add(nouvelle_alerte)
        db.commit()
    # Si une alerte est deja active, on ne fait rien - pas de doublon

def get_alertes(db: Session, user_id: int, statut: str | None = None) -> list[Alerte]:
    """Liste les alertes de tous les capteurs de l'utilisateur, plus recentes en premier."""
    query = (
        db.query(Alerte)
        .join(Capteur, Alerte.capteur_id == Capteur.id)
        .filter(Capteur.user_id == user_id)
    )
    if statut is not None:
        query = query.filter(Alerte.statut == statut)
    alertes = query.order_by(Alerte.declenchee_le.desc()).all()

    return [
        {
            "id": a.id,
            "type": a.type,
            "valeur_mesuree": a.valeur_mesuree,
            "statut": a.statut,
            "declenchee_le": a.declenchee_le,
            "resolue_le": a.resolue_le,
            "capteur_id": a.capteur_id,
            "capteur_type": a.capteur.type,
            "capteur_nom": a.capteur.nom,
        }
        for a in alertes 
    ]

def get_alertes_resume(db: Session, user_id: int) -> dict:
    """Calcule les 3 compteurs de la page Alertes."""
    toutes = get_alertes(db, user_id)

    debut_aujourdhui = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    il_y_a_30_jours = datetime.utcnow() - timedelta(days=30)

    actives = sum(1 for a in toutes if a["statut"] == "active")
    aujourdhui = sum(1 for a in toutes if a["declenchee_le"] >= debut_aujourdhui)
    total_30_jours = sum(1 for a in toutes if a["declenchee_le"] >= il_y_a_30_jours)

    return {
        "actives": actives,
        "aujourdhui": aujourdhui,
        "total_30_jours": total_30_jours,
    }