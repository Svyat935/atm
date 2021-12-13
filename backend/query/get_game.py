from typing import List, Optional

from database.connect import create_session
from database.models.Games import Games
from database.models.Statistics import Statistics
from database.models.UserAndGame import UserAndGame


def get_records(user_id):
    output = []
    with create_session() as db:
        games: List[Games] = db.query(Games).all()
        for game_ in games:
            output.append(
                {
                    "id": game_.id,
                    "type": game_.type,
                    "name": game_.name,
                    "status": game_.status,
                    "description": game_.description,
                    "link": game_.link
                }
            )
    return output


def get_games_for_user(user_id) -> Optional[List[dict]]:
    with create_session() as db:
        games: List[UserAndGame] = db.query(UserAndGame).filter(UserAndGame.id_user == user_id).all()
        output = []
        if games:
            for game in games:
                model_game: Games = db.query(Games).filter(Games.id == game.id_game).first()
                output.append({
                    "id": model_game.id,
                    "name": model_game.name,
                    "description": model_game.description,
                    "status": model_game.status
                })
        return output
