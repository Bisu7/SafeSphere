from fastapi import APIRouter

router = APIRouter()

@router.get("/api/dashboard/stats")
def get_dashboard_stats():
    return {
        "riskScores": "45%",
        "threatsDetected": 21,
        "safeActions": 142,
    }