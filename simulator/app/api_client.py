import requests

from app.config import API_URL, SIMULATOR_API_KEY


def get_headers() -> dict:
    return {"X-Api-Key": SIMULATOR_API_KEY}


def get_capteurs() -> list[dict]:
    """Recupere la liste de TOUS les capteurs, tous comptes confondus."""
    response = requests.get(f"{API_URL}/capteurs/all", headers=get_headers(), timeout=20)
    response.raise_for_status()
    return response.json()