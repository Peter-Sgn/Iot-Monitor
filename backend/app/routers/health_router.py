from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check():
    """Route simple pour vérifier que l'API est en ligne (utilisée par Render/Railway)."""
    return {"status": "ok"}