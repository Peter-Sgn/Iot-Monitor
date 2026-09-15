from typing import Optional

from pydantic import BaseModel, ConfigDict


class CapteurCreate(BaseModel):
    nom: str
    type: str
    unite: str
    localisation: Optional[str] = None
    seuil_min: Optional[float] = None
    seuil_max: Optional[float] = None


class CapteurUpdate(BaseModel):
    nom: Optional[str] = None
    type: Optional[str] = None
    unite: Optional[str] = None
    localisation: Optional[str] = None
    seuil_min: Optional[float] = None
    seuil_max: Optional[float] = None


class CapteurOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nom: str
    type: str
    unite: str
    localisation: Optional[str]
    seuil_min: Optional[float]
    seuil_max: Optional[float]
    user_id: int