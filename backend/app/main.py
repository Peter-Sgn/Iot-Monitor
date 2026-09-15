from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import health_router, auth_router, capteurs_router, mesures_router, dashboard_router, alertes_router

app = FastAPI(
    title="SensorBoard API",
    description="API de suivi de capteurs IoT — dashboard temps réel",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connexion de chaque router à l'application principale
app.include_router(health_router.router)
app.include_router(auth_router.router)
app.include_router(capteurs_router.router)
app.include_router(mesures_router.router)
app.include_router(dashboard_router.router)
app.include_router(alertes_router.router)