import bcrypt
import re
from json import dumps
from flask import Response
from sqlalchemy.sql.expression import false
from database.connect import create_session
from database.models.Games import Games
from database.models.Statistics import Statistics
from query.game import FormTechnique


def delete_game(user_id, body):
    with create_session() as db:
        for number in body:
            techs_abs = db.query(Games).filter(Games.number == number, Games.user_id == user_id)
            techs = db.query(Games).filter(Games.number == number, Games.user_id == user_id).all()
            for tech in techs:
                db.query(Statistics).filter(Statistics.game_id == tech.id).delete()
            techs_abs.delete()
            db.commit()
