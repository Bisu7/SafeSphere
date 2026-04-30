from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from sqlalchemy import func

from app.database import SessionLocal
from app.models.finance import FinancialScan
from app.services.llm_engine import analyze_finance_with_llm

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class FinanceAnalysisRequest(BaseModel):
    merchant: str
    amount: float
    category: str
    description: str

@router.post("/api/finance/analyze")
async def analyze_finance(request: FinanceAnalysisRequest, db: Session = Depends(get_db)):
    result = analyze_finance_with_llm(
        request.merchant, 
        request.amount, 
        request.category, 
        request.description
    )
    
    new_scan = FinancialScan(
        merchant=request.merchant,
        amount=request.amount,
        category=request.category,
        description=request.description,
        score=result["score"],
        verdict=result["verdict"],
        recommendation=result["recommendation"]
    )
    db.add(new_scan)
    db.commit()
    db.refresh(new_scan)
    
    return result

@router.get("/api/finance/history")
def get_finance_history(db: Session = Depends(get_db)):
    scans = db.query(FinancialScan).order_by(FinancialScan.created_at.desc()).limit(20).all()
    return scans

@router.get("/api/finance/stats")
def get_finance_stats(db: Session = Depends(get_db)):
    # Category distribution
    cat_stats = db.query(
        FinancialScan.category, 
        func.sum(FinancialScan.amount)
    ).group_by(FinancialScan.category).all()
    
    cat_spend = [{"cat": cat, "amount": amount} for cat, amount in cat_stats]
    
    # Spending trend (last 7 days)
    history = []
    for i in range(10, -1, -1):
        day = (datetime.now() - timedelta(days=i)).date()
        
        safe_amt = db.query(func.sum(FinancialScan.amount)).filter(
            func.date(FinancialScan.created_at) == day,
            FinancialScan.verdict == "Safe"
        ).scalar() or 0.0
        
        susp_amt = db.query(func.sum(FinancialScan.amount)).filter(
            func.date(FinancialScan.created_at) == day,
            FinancialScan.verdict == "Suspicious"
        ).scalar() or 0.0
        
        fraud_amt = db.query(func.sum(FinancialScan.amount)).filter(
            func.date(FinancialScan.created_at) == day,
            FinancialScan.verdict == "Fraud"
        ).scalar() or 0.0
        
        history.append({
            "day": day.strftime("Apr %d"), # Simplified for frontend chart format
            "safe": safe_amt,
            "suspicious": susp_amt,
            "fraud": fraud_amt
        })
        
    return {
        "cat_spend": cat_spend,
        "history": history
    }
