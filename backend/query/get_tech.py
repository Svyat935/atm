from typing import List

from database.connect import create_session
from database.models.Technique import Technique
from database.models.TechniqueInfo import TechniqueInfo


def get_records(user_id):
    output = []
    with create_session() as db:
        techs: List[Technique] = db.query(Technique).filter(Technique.user_id == user_id).all()
        for tech_ in techs:
            tech_info: TechniqueInfo = db.query(TechniqueInfo).filter(TechniqueInfo.tech_id == tech_.id).first()
            if tech_info:
                output.append({
                    "type": tech_.type,
                    "number": tech_.number,
                    "status": tech_.status,
                    "audience": tech_info.audience,
                    "building": tech_info.building,
                    "address": tech_info.address,
                    "description": tech_info.description,
                    "delivery_data": tech_info.delivery_data.strftime(
                        "%d.%m.%Y") if tech_info.delivery_data else tech_info.delivery_data
                })
    return output
