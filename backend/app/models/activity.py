from sqlalchemy import Column, Integer, String
from app.database import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True)
    action = Column(String)