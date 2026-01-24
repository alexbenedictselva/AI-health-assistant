from fastapi import FastAPI, HTTPException
from sqlalchemy import text
from database import engine, Base, SessionLocal
from api import auth_router, risk_router
from ExplanableAI.explanation_ai import generate_explanation

# ---------- CREATE TABLES ----------
Base.metadata.create_all(bind=engine)

# ---------- APP ----------
app = FastAPI(
    title="AI Health Assistant – Glucose Risk API",
    version="1.0"
)

# ---------- INCLUDE ROUTERS ----------
app.include_router(auth_router, tags=["Authentication"])
app.include_router(risk_router, tags=["Risk Calculation"])

# ---------- ROOT & HEALTH CHECK ----------
@app.get("/")
def root():
    return {"status": "Backend is running"}

@app.get("/db-test")
def test_database():
    try:
        db = SessionLocal()
        result = db.execute(text("SELECT 1 as test"))
        db.close()
        return {"status": "Database connected successfully", "test_query": "OK"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")
    
@app.post("/explain")
def explain_risk(risk_data: dict):
    explanation = generate_explanation(risk_data)
    return {
        "risk_level": risk_data.get("risk_level"),
        "explanation": explanation
    }
