from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MesureCreate(BaseModel):
    valeur: float
    capteur_id: int


class MesureOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    valeur: float
    horodatage: datetime
    capteur_id: int