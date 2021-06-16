import bcrypt
import re
from json import dumps
from flask import Response
from sqlalchemy.sql.expression import false
from database.connect import create_session
from database.models.Technique import Technique
from database.models.TechniqueInfo import TechniqueInfo
from query.tech import FormTechnique


def delete_tech(user_id, body):
    with create_session() as db:
        for number in body:
            techs_abs = db.query(Technique).filter(Technique.number == number, Technique.user_id == user_id)
            techs = db.query(Technique).filter(Technique.number == number, Technique.user_id == user_id).all()
            for tech in techs:
                db.query(TechniqueInfo).filter(TechniqueInfo.tech_id == tech.id).delete()
            techs_abs.delete()
            db.commit()
