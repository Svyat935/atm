from sqlalchemy.orm import relationship

from database.connect import Base, create_session
from sqlalchemy import Column, Integer, String, ForeignKey


class Technique(Base):
    __tablename__ = "technique"

    id = Column(Integer, primary_key=True)
    number = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="technique")
    tech_info = relationship("TechniqueInfo", back_populates="tech")
    type = Column(String)
    status = Column(String)

    def __repr__(self):
        return f"<Technique(id:{self.id}, user_id:{self.user_id})>"

    def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
