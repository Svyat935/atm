from flask import Flask, Response, make_response
from flask.json import dumps
from sqlalchemy.exc import IntegrityError

from auth.auth import register_user, authorization_user, parse_jwt, create_admin
from query.get_game import get_records, get_games_for_user
from query.get_users_for_admin import get_users_for_admin, user_updates
from query.insert import insert_new_game, insert_game_to_user
from query.delete import delete_game
from query.update import update_game
from auth.query import FormAuthentication, FormRegistration
from query.game import (
    FormTechniqueList,
    DeleteFormTechnique,
    UpdateFormTechniqueList,
    FormUser,
    UpdateUser, UserToLink,
)
from flask_pydantic import validate

from database.connect import Base, engine, create_session
from database.models import User, Games, Statistics, UserAndGame

app = Flask(__name__)

Base.metadata.create_all(bind=engine)


@app.route("/registration", methods=["POST"])
@validate()
def registration(body: FormRegistration):
    register_user(body)
    return Response(status=200)


@app.route("/authentication", methods=["POST"])
@validate()
def authentication(body: FormAuthentication):
    token, rights = authorization_user(body)
    if token:
        return Response(
            status=200, response=dumps({"token": token, "user_rights": rights})
        )
    return Response(status=401)


@app.route("/get_tech", methods=["POST"])
@validate()
def get_techs(body: FormUser):
    payload = parse_jwt(body.token)
    if payload:
        games = get_records(payload.get("user_id"))
        return Response(status=200, response=dumps(games))
    return Response(status=401)


@app.route("/insert_tech", methods=["POST"])
@validate()
def insert_game(body: FormTechniqueList):
    payload = parse_jwt(body.token)
    if payload:
        try:
            insert_new_game(body.data)
        except IntegrityError:
            return Response(
                status=500,
                response=dumps(
                    {"result": "Дубликат ключа. Пожалуйста проверьте поле."}
                ),
            )
        return Response(status=200, response=dumps({"result": "Техника добавлена"}))
    return Response(status=401)


@app.route("/delete_tech", methods=["POST"])
@validate()
def delete(body: DeleteFormTechnique):
    payload = parse_jwt(body.token)
    if payload:
        delete_game(payload.get("user_id"), body.data)
        return Response(
            status=200, response=dumps({"result": "It's ok! Technique has gone"})
        )
    return Response(status=401)


@app.route("/update_tech", methods=["POST"])
@validate()
def update(body: UpdateFormTechniqueList):
    payload = parse_jwt(body.token)
    if payload:
        updating = update_game(payload.get("user_id"), body.data)
    if updating:
        return Response(
            status=200, response=dumps({"result": "It's ok! Fully updated!"})
        )
    return Response(status=401, response=dumps({"result": "Всё плохо"}))


@app.route("/get_users", methods=["POST"])
@validate()
def get_users(body: FormUser):
    payload = parse_jwt(body.token)
    if payload:
        user_id = payload.get("user_id")
        return Response(status=200, response=dumps(get_users_for_admin(user_id)))
    return Response(status=401)


@app.route("/update_user", methods=["POST"])
@validate()
def update_user(body: UpdateUser):
    payload = parse_jwt(body.token)
    if payload:
        user_updates(body.users)
        return Response(status=200)
    return Response(status=401)


@app.route("/user_link_games", methods=["POST"])
@validate()
def user_link_games(body: UserToLink):
    payload = parse_jwt(body.token)
    if payload:
        insert_game_to_user(body)
        return Response(status=200)
    return Response(status=401)


@app.route("/games_for_user", methods=["POST"])
@validate()
def user_games_for_user(body: FormUser):
    payload = parse_jwt(body.token)
    if payload:
        user_id = payload.get("user_id")
        games = get_games_for_user(user_id)
        return Response(status=200, response=dumps(games))
    return Response(status=401)


if __name__ == "__main__":
    create_admin()
    app.run()
