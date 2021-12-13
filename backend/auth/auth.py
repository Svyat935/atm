import bcrypt
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict
from auth.query import FormRegistration, FormAuthentication
from database.connect import create_session
from database.models.User import User

JWT_KEY = "Lw8cIjl5oKXV2EUdCq7uyznfhmQJeNp1"
JWT_EXPIRE = datetime.utcnow() + timedelta(days=10)


def create_admin() -> None:
    with create_session() as db:
        users = db.query(User).all()
        if not users:
            user = User(
                email="root@root.com",
                login="root",
                password=bcrypt.hashpw(
                    password="root".encode(), salt=bcrypt.gensalt()
                ).decode(),
                rights=0,
            )
            user.create()


def register_user(body: FormRegistration) -> None:
    password: str = bcrypt.hashpw(
        password=body.password.encode(), salt=bcrypt.gensalt()
    ).decode()
    user: User = User(
        email=body.email,
        login=body.login,
        password=password,
    )
    user.create()


def authorization_user(body: FormAuthentication) -> Optional[str]:
    with create_session() as db:
        user_found: User = db.query(User).filter(User.login == body.login).first()
        if user_found:
            if bcrypt.checkpw(body.password.encode(), user_found.password.encode()):
                token = jwt.encode(
                    payload={"exp": JWT_EXPIRE, "user_id": user_found.id},
                    key=JWT_KEY,
                    algorithm="HS256",
                )
                return (token, user_found.rights)
    return None


def parse_jwt(token: str) -> Optional[Dict[str, str]]:
    try:
        payload = jwt.decode(token, JWT_KEY, algorithms="HS256")
    except jwt.exceptions.ExpiredSignatureError:
        return None
    except jwt.DecodeError:
        return None
    return payload
