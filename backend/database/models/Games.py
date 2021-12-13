from sqlalchemy.orm import relationship

from database.connect import Base, create_session
from sqlalchemy import Column, Integer, String, ForeignKey


class Games(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    type = Column(String)
    description = Column(String)
    status = Column(String)
    statistics = relationship("Statistics", back_populates="game")
    link = Column(String)

    userGame = relationship("UserAndGame", back_populates="game")

    def __repr__(self):
        return f"<Games(id:{self.id}, user_id:{self.user_id})>"

    def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
