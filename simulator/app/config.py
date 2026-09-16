import os
from dotenv import load_dotenv

load_dotenv()

API_URL = os.getenv("API_URL", "http://127.0.0.1:8000")
SIMULATOR_API_KEY = os.getenv("SIMULATOR_API_KEY", "")
INTERVALLE_SECONDES = int(os.getenv("INTERVALLE_SECONDES", "15"))