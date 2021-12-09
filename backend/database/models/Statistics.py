from sqlalchemy.orm import relationship

from database.connect import Base, create_session
from sqlalchemy import Column, Integer, String, ForeignKey, Date


class Statistics(Base):
    __tablename__ = "statistics"

    id = Column(Integer, primary_key=True)
    game_id = Column(Integer, ForeignKey("games.id"))
    game = relationship("Games", back_populates="statistics")
    description = Column(String)

    def __repr__(self):
        return f"<Statistics(id:{self.id})>"

    def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
