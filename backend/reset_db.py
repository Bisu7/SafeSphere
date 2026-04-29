from app.database import engine, Base
from app.models.scan import Scan
from app.models.user import User
from sqlalchemy import text

def reset_database():
    print("Resetting database...")
    with engine.connect() as conn:
        # Drop scans table to update schema
        print("Dropping scans table...")
        conn.execute(text("DROP TABLE IF EXISTS scans CASCADE"))
        conn.commit()
    
    # Recreate all tables
    print("Recreating tables...")
    Base.metadata.create_all(bind=engine)
    print("Database reset complete.")

if __name__ == "__main__":
    reset_database()
