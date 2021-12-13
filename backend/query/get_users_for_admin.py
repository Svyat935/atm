from typing import List

from database.connect import create_session
from database.models.User import User
from query.game import UserType


def get_users_for_admin(user_id):
    with create_session() as db:
        user = db.query(User).filter_by(id=user_id).first()
        if user:
            if user.rights == 0:
                users = db.query(User).all()
                return [
                    {
                        "id": user.id,
                        "email": user.email,
                        "login": user.login,
                        "rights": user.rights,
                        "user_id": user.user_id,
                    }
                    for user in users
                ]
    return []


def user_updates(users: List[UserType]):
    with create_session() as db:
        for user in users:
            user_model: User = db.query(User).filter_by(id=user.id).first()
            if user_model:
                user_model.rights = user.status
                if user.link_user:
                    user_model.user_id = user.link_user
                db.add(user_model)
                db.commit()
