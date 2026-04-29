from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import SessionLocal
from app.models.scan import Scan
from datetime import datetime, timedelta

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/api/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_scans = db.query(Scan).count()
    threats = db.query(Scan).filter(Scan.verdict != "Safe").count()
    safe = db.query(Scan).filter(Scan.verdict == "Safe").count()
    
    # Calculate average risk score
    avg_score = db.query(func.avg(Scan.score)).scalar() or 0.0
    
    # Recent scans for the list
    recent_scans = db.query(Scan).order_by(Scan.created_at.desc()).limit(5).all()
    
    # Format for frontend
    formatted_recent = []
    for s in recent_scans:
        formatted_recent.append({
            "id": s.id,
            "type": s.type,
            "target": s.target,
            "verdict": s.verdict,
            "score": s.score,
            "time": s.created_at.isoformat()
        })

    # Risk score over time (last 7 days)
    history = []
    for i in range(6, -1, -1):
        day = (datetime.now() - timedelta(days=i)).date()
        day_avg = db.query(func.avg(Scan.score)).filter(func.date(Scan.created_at) == day).scalar() or 0.0
        history.append({
            "name": day.strftime("%a"),
            "risk": int(day_avg * 100)
        })

    return {
        "riskScore": f"{int(avg_score * 100)}%",
        "threatsDetected": threats,
        "safeActions": safe,
        "totalScans": total_scans,
        "recentActivity": formatted_recent,
        "history": history
    }