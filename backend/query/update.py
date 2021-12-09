from datetime import datetime

import bcrypt
import re
from json import dumps
from flask import Response
from sqlalchemy.sql.expression import false
from database.connect import create_session
from database.models.Games import Games
from database.models.Statistics import Statistics
from query.game import UpdateFormTechnique


def update_game(user_id, body) -> bool:
    with create_session() as db:
        for queue in body:
            tech = db.query(Games).filter(Games.number == queue.number, Games.user_id == user_id).first()
            if tech is None:
                return False
            if queue.delivery_data > datetime.now().timestamp():
                return False
            tech.type = queue.type
            tech.number = queue.number
            tech.status = queue.status

            tech_info = db.query(Statistics).filter(Statistics.game_id == tech.id).first()
            tech_info.audience = queue.audience
            tech_info.building = queue.building
            tech_info.address = queue.address
            tech_info.description = queue.description
            tech_info.delivery_data = datetime.fromtimestamp(queue.delivery_data)

            db.add(tech)
        db.commit()
        return True
