from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.dependencies import get_db
from app.models.user import User

# Indique à FastAPI où se trouve la route de login,
# utilisé uniquement pour générer la doc Swagger (bouton "Authorize")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Dépendance FastAPI à ajouter sur toute route protégée.
    Décode le token JWT envoyé par le client, vérifie sa validité,
    et renvoie l'utilisateur correspondant. Bloque la requête sinon.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalide ou expiré",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Décode le token avec la même clé secrète qui a servi à le signer
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        # Token corrompu, mal signé, ou expiré
        raise credentials_exception

    # Vérifie que l'utilisateur du token existe toujours en base
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    return user