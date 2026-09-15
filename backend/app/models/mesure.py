from datetime import datetime

from sqlalchemy import Float, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Mesure(Base):
    __tablename__ = "mesures"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    valeur: Mapped[float] = mapped_column(Float, nullable=False)
    horodatage: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    capteur_id: Mapped[int] = mapped_column(ForeignKey("capteurs.id"), nullable=False)

    capteur: Mapped["Capteur"] = relationship(back_populates="mesures")