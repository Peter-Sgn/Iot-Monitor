from typing import Optional

from sqlalchemy import String, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Capteur(Base):
    __tablename__ = "capteurs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nom: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    unite: Mapped[str] = mapped_column(String(20), nullable=False)
    localisation: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    seuil_min: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    seuil_max: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    proprietaire: Mapped["User"] = relationship(back_populates="capteurs")
    mesures: Mapped[list["Mesure"]] = relationship(back_populates="capteur", cascade="all, delete-orphan")
    alertes: Mapped[list["Alerte"]] = relationship(back_populates="capteur", cascade="all, delete-orphan")