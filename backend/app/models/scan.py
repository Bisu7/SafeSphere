from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True)
    url = Column(String)
    result = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))