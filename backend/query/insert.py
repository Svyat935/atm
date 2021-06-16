from datetime import datetime
from typing import List

import bcrypt
import re
from json import dumps
from flask import Response
from database.connect import create_session
from database.models.Technique import Technique
from database.models.TechniqueInfo import TechniqueInfo
from query.tech import FormTechniqueList, FormTechnique


def insert_new_tech(user_id, body: List[FormTechnique]) -> None:
    for queue in body:
        new_tech: Technique = Technique(
            user_id=user_id,
            type=queue.type,
            number=queue.number,
            status=queue.status,
        ).create()
        TechniqueInfo(
            tech_id=new_tech.id,
            audience=queue.audience,
            building=queue.building,
            address=queue.address,
            description=queue.address,
            delivery_data=datetime.fromtimestamp(queue.delivery_data)
        ).create()
