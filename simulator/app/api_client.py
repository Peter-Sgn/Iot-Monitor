import requests

from app.config import API_URL, SIMULATEUR_EMAIL, SIMULATEUR_PASSWORD

_token = None


def get_token() -> str:
    """Recupere un token JWT, en se connectant une seule fois puis en le reutilisant."""
    global _token
    if _token:
        return _token

    response = requests.post(
        f"{API_URL}/auth/login",
        data={"username": SIMULATEUR_EMAIL, "password": SIMULATEUR_PASSWORD},
        timeout=5,
    )
    response.raise_for_status()
    _token = response.json()["access_token"]
    return _token


def get_headers() -> dict:
    return {"Authorization": f"Bearer {get_token()}"}


def get_capteurs() -> list[dict]:
    """Recupere la liste des capteurs de l'utilisateur configure."""
    response = requests.get(f"{API_URL}/capteurs", headers=get_headers(), timeout=5)
    response.raise_for_status()
    return response.json()