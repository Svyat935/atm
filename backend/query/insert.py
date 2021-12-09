from datetime import datetime
from typing import List

import bcrypt
import re
from json import dumps
from flask import Response
from database.connect import create_session
from database.models.Games import Games
from database.models.Statistics import Statistics
from query.game import FormTechniqueList, FormTechnique


def insert_new_game(user_id, body: List[FormTechnique]) -> None:
    for queue in body:
        new_tech: Games = Games(
            user_id=user_id,
            type=queue.type,
            number=queue.number,
            status=queue.status,
        ).create()
        Statistics(
            tech_id=new_tech.id,
            audience=queue.audience,
            building=queue.building,
            address=queue.address,
            description=queue.address,
            delivery_data=datetime.fromtimestamp(queue.delivery_data)
        ).create()
