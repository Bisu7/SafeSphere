from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base

class FinancialScan(Base):
    __tablename__ = "financial_scans"

    id = Column(Integer, primary_key=True)
    merchant = Column(String)
    amount = Column(Float)
    category = Column(String)
    description = Column(String)
    score = Column(Float)
    verdict = Column(String) # Safe, Suspicious, Fraud
    recommendation = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
