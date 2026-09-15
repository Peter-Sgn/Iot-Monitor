import os
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("API_URL", "http://127.0.0.1:8000")
SIMULATEUR_EMAIL = os.getenv("SIMULATEUR_EMAIL")
SIMULATEUR_PASSWORD = os.getenv("SIMULATEUR_PASSWORD")
INTERVALLE_SECONDES = int(os.getenv("INTERVALLE_SECONDES", "15"))