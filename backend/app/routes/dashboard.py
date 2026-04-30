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

@router.get("/api/privacy/stats")
def get_privacy_stats(db: Session = Depends(get_db)):
    # Get all scans of type url or form
    privacy_scans = db.query(Scan).filter(Scan.type.in_(["url", "form"])).all()
    
    # Process trackers
    trackers_map = {}
    for s in privacy_scans:
        domain = s.target
        # Basic domain extraction if it's a full URL
        if "://" in domain:
            domain = domain.split("://")[1].split("/")[0]
        
        if domain not in trackers_map:
            # Determine category based on domain
            category = "Analytics"
            if any(k in domain for k in ["ads", "pixel", "doubleclick", "criteo"]):
                category = "Advertising"
            elif any(k in domain for k in ["hs-", "hubspot", "crm"]):
                category = "CRM"
            elif any(k in domain for k in ["hotjar", "clarity"]):
                category = "Heatmap"
                
            trackers_map[domain] = {
                "id": len(trackers_map) + 1,
                "name": domain.split(".")[0].capitalize(),
                "domain": domain,
                "category": category,
                "blocked": s.verdict == "Danger"
            }
    
    trackers = list(trackers_map.values())
    
    # Process alerts from Danger scans
    danger_scans = db.query(Scan).filter(Scan.verdict == "Danger").order_by(Scan.created_at.desc()).limit(5).all()
    alerts = []
    for s in danger_scans:
        alerts.append({
            "id": s.id,
            "title": f"High risk {s.type} detected",
            "detail": f"Threat found on {s.target}",
            "severity": "High",
            "ts": s.created_at.strftime("%Y-%m-%d %H:%M")
        })

    # Default alerts if none found
    if not alerts:
        alerts = [
            { "id": 0, "title": "No critical threats found", "detail": "SafeSphere has not detected any major data leaks for you.", "severity": "Low", "ts": "Now" }
        ]

    # Default trackers if none found
    if not trackers:
         trackers = [
            { "id": 1, "name": "Google", "domain": "google.com", "category": "Analytics", "blocked": False }
         ]

    return {
        "trackers": trackers,
        "alerts": alerts
    }