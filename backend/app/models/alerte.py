from datetime import datetime
from typing import Optional

from sqlalchemy import String, Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Alerte(Base):
    __tablename__ = "alertes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    type: Mapped[str] = mapped_column(String(20), nullable=False)  # "haute" ou "basse"
    valeur_mesuree: Mapped[float] = mapped_column(Float, nullable=False)
    statut: Mapped[str] = mapped_column(String(20), nullable=False, default="active")

    declenchee_le: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    resolue_le: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    capteur_id: Mapped[int] = mapped_column(ForeignKey("capteurs.id"), nullable=False)
    capteur: Mapped["Capteur"] = relationship(back_populates="alertes")