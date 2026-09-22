import os
import random
import time
from datetime import datetime

import requests

from app.config import API_URL, INTERVALLE_SECONDES
from app.api_client import get_capteurs, get_headers
from app.plages_par_type import get_plage


def generer_valeur(type_capteur: str) -> float:
    valeur_min, valeur_max = get_plage(type_capteur)
    return round(random.uniform(valeur_min, valeur_max), 2)


def envoyer_mesure(capteur_id: int, valeur: float) -> bool:
    payload = {"valeur": valeur, "capteur_id": capteur_id}
    try:
        response = requests.post(
            f"{API_URL}/mesures", json=payload, headers=get_headers(), timeout=15
        )
        response.raise_for_status()
        return True
    except requests.exceptions.RequestException as erreur:
        print(f"[{datetime.now()}] Echec de l'envoi pour le capteur {capteur_id} : {erreur}")
        return False


def cycle():
    try:
        capteurs = get_capteurs()
    except requests.exceptions.RequestException as erreur:
        print(f"[{datetime.now()}] Impossible de recuperer la liste des capteurs : {erreur}")
        return

    if not capteurs:
        print(f"[{datetime.now()}] Aucun capteur trouve.")
        return

    for capteur in capteurs:
        valeur = generer_valeur(capteur["type"])
        succes = envoyer_mesure(capteur["id"], valeur)
        statut = "envoyee" if succes else "NON envoyee"
        print(f"[{datetime.now()}] {capteur['nom']} ({capteur['type']}) — mesure {statut} : {valeur}")


def main():
    run_once = os.getenv("RUN_ONCE", "false").lower() == "true"

    if run_once:
        print(f"[{datetime.now()}] Execution unique (mode GitHub Actions).")
        cycle()
        return

    print(f"Simulateur multi-capteurs demarre — cycle toutes les {INTERVALLE_SECONDES}s")
    print(f"Cible : {API_URL}")
    print("Ctrl+C pour arreter.\n")

    while True:
        cycle()
        time.sleep(INTERVALLE_SECONDES)


if __name__ == "__main__":
    main()