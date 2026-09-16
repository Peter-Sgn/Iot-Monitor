from sqlalchemy.orm import Session

from app.models.capteur import Capteur
from app.schemas.capteur import CapteurCreate, CapteurUpdate


def get_capteurs_by_user(db: Session, user_id: int) -> list[Capteur]:
    return db.query(Capteur).filter(Capteur.user_id == user_id).all()


def get_capteur_by_id(db: Session, capteur_id: int, user_id: int) -> Capteur | None:
    return db.query(Capteur).filter(Capteur.id == capteur_id, Capteur.user_id == user_id).first()


def create_capteur(db: Session, capteur_data: CapteurCreate, user_id: int) -> Capteur:
    new_capteur = Capteur(**capteur_data.model_dump(), user_id=user_id)
    db.add(new_capteur)
    db.commit()
    db.refresh(new_capteur)
    return new_capteur


def update_capteur(db: Session, capteur: Capteur, update_data: CapteurUpdate) -> Capteur:
    changes = update_data.model_dump(exclude_unset=True)
    for field, value in changes.items():
        setattr(capteur, field, value)
    db.commit()
    db.refresh(capteur)
    return capteur


def delete_capteur(db: Session, capteur: Capteur) -> None:
    db.delete(capteur)
    db.commit()

def get_all_capteurs(db: Session) -> list[Capteur]:
    """Liste TOUS les capteurs, tous comptes confondus — reserve au simulateur."""
    return db.query(Capteur).all() 