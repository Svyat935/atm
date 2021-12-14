from pydantic import BaseModel, validator, ValidationError
from database.models.Games import Games
from typing import List, Optional


class FormGame(BaseModel):
    name: str
    type: str
    description: str
    status: str


class DeleteFormTechnique(BaseModel):
    token: str
    data: List[str]


class UpdateFormTechnique(BaseModel):
    type: str
    number: str
    audience: str
    building: str
    address: str
    description: str
    status: str
    delivery_data: int


class UpdateFormTechniqueList(BaseModel):
    token: str
    data: List[UpdateFormTechnique]


class FormGamesList(BaseModel):
    token: str
    data: List[FormGame]


class FormUser(BaseModel):
    token: str


class UserType(BaseModel):
    status: int
    id: str
    link_user: Optional[int]


class UpdateUser(BaseModel):
    token: str
    users: List[UserType]


class GameForLink(BaseModel):
    id_game: int


class UserToLink(BaseModel):
    token: str
    user_id: int
    games: List[GameForLink]
