from fastapi import HTTPException
from psycopg2 import IntegrityError
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.core.security import hash_password, verify_password, create_token

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/auth/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        hashed = hash_password(user.password)
        new_user = User(name=user.name, email=user.email, password=hashed)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "User created"}
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")

@router.post("/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.password):
        return {"error": "Invalid credentials"}

    token = create_token({"sub": db_user.email})
    return {
        "access_token": token,
        "user":{
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email
        }
    }