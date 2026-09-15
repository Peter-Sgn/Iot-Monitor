from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Classe de base dont hériteront tous les modèles SQLAlchemy (User, Capteur, Mesure)."""
    pass