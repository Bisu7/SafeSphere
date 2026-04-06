from fastapi import FastAPI
from app.routes import auth, user as user_routes
from app.models import user, scan, activity
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "SafeSphere API is running!"}

app.include_router(auth.router)
app.include_router(user_routes.router)
