from app.database.connection import SessionLocal


def get_db():
    """Dépendance FastAPI : ouvre une session DB pour la requête, la ferme après."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()