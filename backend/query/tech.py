from pydantic import BaseModel, validator, ValidationError
from database.models.Technique import Technique
from typing import List, Optional


class FormTechnique(BaseModel):
    type: str
    number: str
    audience: str
    building: str
    address: str
    description: str
    status: str
    delivery_data: int


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


class FormTechniqueList(BaseModel):
    token: str
    data: List[FormTechnique]


class FormUser(BaseModel):
    token: str


class UpdateUser(BaseModel):
    token: str
    ids: List[str]
