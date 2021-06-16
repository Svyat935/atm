from database.connect import create_session
from database.models.User import User


def get_users_for_admin(user_id):
    with create_session() as db:
        user = db.query(User).filter_by(id=user_id).first()
        if user:
            if user.rights == 0:
                users = db.query(User).all()
                return [{"id": user.id, "email": user.email, 'login': user.login, "rights": user.rights} for user in
                        users]
    return []


def user_updates(user_id, ids):
    with create_session() as db:
        user = db.query(User).filter_by(id=user_id).first()
        if user:
            if user.rights == 0:
                for id_ in ids:
                    user = db.query(User).filter_by(id=id_).first()
                    if user:
                        user.rights = 1
                        db.add(user)
                        db.commit()
