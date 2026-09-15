from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

class AlerteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: str
    valeur_mesuree: float
    statut: str
    declenchee_le: datetime
    resolue_le: Optional[datetime]
    capteur_id: int
    capteur_type: str
    capteur_nom: str


class AlerteResume(BaseModel):
    actives: int
    aujourdhui: int
    total_30_jours: int