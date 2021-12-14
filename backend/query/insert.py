from datetime import datetime
from typing import List

import bcrypt
import re
from json import dumps
from flask import Response
from database.connect import create_session
from database.models.Games import Games
from database.models.Statistics import Statistics
from database.models.UserAndGame import UserAndGame
from query.game import FormGamesList, FormGame, UserToLink


def insert_new_game(body: List[FormGame]) -> None:
    for queue in body:
        Games(
            type=queue.type,
            description=queue.description,
            status=queue.status,
            name=queue.name,
        ).create()


def insert_game_to_user(body: UserToLink) -> None:
    with create_session() as db:
        user_games: List[UserAndGame] = db.query(UserAndGame).filter(UserAndGame.id_user == body.user_id).all()
        if user_games:
            for user_game in user_games:
                db.delete(user_game)
                db.commit()
        for game_ in body.games:
            UserAndGame(
                id_game=game_.id_game,
                id_user=body.user_id
            ).create()
            db.commit()
