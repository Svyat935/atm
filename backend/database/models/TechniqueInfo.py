from sqlalchemy.orm import relationship

from database.connect import Base, create_session
from sqlalchemy import Column, Integer, String, ForeignKey, Date


class TechniqueInfo(Base):
    __tablename__ = "technique_info"

    id = Column(Integer, primary_key=True)
    tech_id = Column(Integer, ForeignKey("technique.id"))
    tech = relationship("Technique", back_populates="tech_info")
    audience = Column(String)
    building = Column(String)
    address = Column(String)
    description = Column(String)
    delivery_data = Column(Date)

    def __repr__(self):
        return f"<TechniqueInfo(id:{self.id}, tech_id:{self.tech_id}, audience:{self.audience}," \
               f" building:{self.building}, address:{self.address}, description:{self.description}"\
               f" delivery_data:{self.delivery_data}"

    def create(self):
        with create_session() as db:
            db.add(self)
            db.commit()
            db.refresh(self)
        return self
