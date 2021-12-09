from typing import List

from database.connect import create_session
from database.models.Games import Games
from database.models.Statistics import Statistics


def get_records(user_id):
    output = []
    with create_session() as db:
        games: List[Games] = db.query(Games).all()
        for game_ in games:
            output.append({
                "type": game_.type,
                "name": game_.name,
                "status": game_.status,
                "description": game_.description,
            })
    return output
