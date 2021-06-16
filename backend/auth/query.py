import re

from pydantic import BaseModel, validator, ValidationError

from database.connect import create_session
from database.models.User import User


class FormRegistration(BaseModel):
    email: str
    login: str
    password: str

    @validator('email')
    def check_email(cls, variable):
        regex = r"^(\w|\.|\_|\-)+[@](\w|\_|\-|\.)+[.]\w{2,3}$"
        if not re.search(regex, variable):
            raise ValueError("Email doesnt' match!")
        with create_session() as db:
            user = db.query(User).filter(User.email == variable).first()
            if user:
                raise ValueError("Такая электронная почта существует! Измените почту!")
        return variable

    @validator('login')
    def check_login(cls, variable):
        with create_session() as db:
            user = db.query(User).filter(User.login == variable).first()
            if user:
                raise ValueError("Такой логин существует. Измените логин!")
        return variable

    @validator("password")
    def check_password(cls, variable):
        if len(variable) > 5:
            return variable
        raise ValueError("Пароль должен быть не меньше 6 символов!")


class FormAuthentication(BaseModel):
    login: str
    password: str
