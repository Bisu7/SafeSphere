from fastapi import APIRouter

router = APIRouter()

@router.get("/user/profile")
def profile():
    return {"message": "Protected route"}