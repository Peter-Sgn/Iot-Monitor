import random
import time
from datetime import datetime

import requests

from app.config import API_URL, INTERVALLE_SECONDES
from app.api_client import get_capteurs, get_headers
from app.plages_par_type import get_plage


def generer_valeur(type_capteur: str) -> float:
    """Genere une valeur simulee plausible selon le type du capteur."""
    valeur_min, valeur_max = get_plage(type_capteur)
    return round(random.uniform(valeur_min, valeur_max), 2)


def envoyer_mesure(capteur_id: int, valeur: float) -> bool:
    """Envoie une mesure au backend via POST /mesures. Renvoie True si l'envoi a reussi."""
    payload = {"valeur": valeur, "capteur_id": capteur_id}

    try:
        response = requests.post(
            f"{API_URL}/mesures", json=payload, headers=get_headers(), timeout=5
        )
        response.raise_for_status()
        return True
    except requests.exceptions.RequestException as erreur:
        print(f"[{datetime.now()}] Echec de l'envoi pour le capteur {capteur_id} : {erreur}")
        return False


def cycle():
    """Un cycle : decouvre les capteurs actuels, envoie une mesure pour chacun."""
    try:
        capteurs = get_capteurs()
    except requests.exceptions.RequestException as erreur:
        print(f"[{datetime.now()}] Impossible de recuperer la liste des capteurs : {erreur}")
        return

    if not capteurs:
        print(f"[{datetime.now()}] Aucun capteur trouve pour ce compte.")
        return

    for capteur in capteurs:
        valeur = generer_valeur(capteur["type"])
        succes = envoyer_mesure(capteur["id"], valeur)
        statut = "envoyee" if succes else "NON envoyee"
        print(f"[{datetime.now()}] {capteur['nom']} ({capteur['type']}) — mesure {statut} : {valeur}")


def main():
    print(f"Simulateur multi-capteurs demarre — cycle toutes les {INTERVALLE_SECONDES}s")
    print(f"Cible : {API_URL}")
    print("Ctrl+C pour arreter.\n")

    while True:
        cycle()
        time.sleep(INTERVALLE_SECONDES)


if __name__ == "__main__":
    main()