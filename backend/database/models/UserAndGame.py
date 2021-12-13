from sqlalchemy.orm import relationship

from database.connect import Base, create_session
from sqlalchemy import Column, Integer, String, ForeignKey


class UserAndGame(Base):
    __tablename__ = "users_and_games"

    id_game = Column(ForeignKey("games.id"), primary_key=True)
    id_user = Column(ForeignKey("users.id"), primary_key=True)
    user = relationship("User", back_populates="userGame")
    game = relationship("Games", back_populates="userGame")

    def __repr__(self):
        return f"<UserAndGame(id_game:{self.id_game}, id_user:{self.id_user})>"

    def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
