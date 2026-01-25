from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import engine, Base, SessionLocal
from api import auth_router, risk_router
from explanations.diabetes_explanation import generate_explanation, generate_summary
from auth.jwt_auth import get_current_user
from models import User

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
    summary = generate_summary(risk_data)
    return {
        "risk_level": risk_data.get("risk_level"),
        "summary": summary,
        "explanation": explanation
    }

@app.post("/explain-cardiac")
def explain_cardiac_risk(risk_data: dict):
    from explanations.cardiac_explanation import generate_cardiac_explanation, generate_cardiac_summary
    
    explanation = generate_cardiac_explanation(risk_data)
    summary = generate_cardiac_summary(risk_data)
    return {
        "risk_level": risk_data.get("risk_level"),
        "summary": summary,
        "explanation": explanation
    }

@app.post("/recommendations")
def get_recommendations(risk_data: dict):
    from recommendation.recommendations import generate_glucose_recommendations
    
    # Extract attribution data for recommendations
    attribution = risk_data.get("attribution", {})
    
    # Flatten the data for the recommendation function
    input_data = {}
    
    # Get immediate glycemic data
    immediate = attribution.get("immediate_glycemic", {})
    input_data.update({
        "glucose_value": immediate.get("glucose_value"),
        "measurement_context": immediate.get("glucose_context"),
        "trend": immediate.get("trend")
    })
    
    # Get treatment symptoms data
    treatment = attribution.get("treatment_symptoms", {})
    input_data.update({
        "symptoms": treatment.get("symptoms"),
        "meal_type": treatment.get("meal_type")
    })
    
    # Get baseline data
    baseline = attribution.get("baseline", {})
    input_data.update({
        "physical_activity": baseline.get("physical_activity"),
        "bmi_category": baseline.get("bmi_category")
    })
    
    recommendations = generate_glucose_recommendations(input_data)
    
    return {
        "risk_level": risk_data.get("risk_level"),
        "recommendations_count": len(recommendations),
        "recommendations": recommendations
    }

@app.post("/cardiac-recommendations")
def get_cardiac_recommendations(risk_data: dict):
    from recommendation.recommendations import generate_cardiac_recommendations
    
    # Extract attribution data for cardiac recommendations
    attribution = risk_data.get("attribution", {})
    
    # Flatten the data for the recommendation function
    input_data = {}
    
    # Get immediate cardiac data
    immediate = attribution.get("immediate", {})
    input_data.update({
        "chest_pain": "severe" if "chest_pain" in immediate else "none",
        "shortness_of_breath": "rest" if "breathlessness" in immediate else "none",
        "blood_pressure": "high" if "blood_pressure" in immediate else "normal"
    })
    
    # Get lifestyle data
    lifestyle = attribution.get("lifestyle", {})
    input_data.update({
        "smoking": "current" if "smoking" in lifestyle else "never",
        "physical_activity": "never" if "activity" in lifestyle else "active",
        "diet": "high_fat" if "diet" in lifestyle else "healthy"
    })
    
    # Get baseline data
    baseline = attribution.get("baseline", {})
    input_data.update({
        "bmi_category": "obese" if "bmi" in baseline else "normal"
    })
    
    recommendations = generate_cardiac_recommendations(input_data)
    
    return {
        "risk_level": risk_data.get("risk_level"),
        "recommendations_count": len(recommendations),
        "recommendations": recommendations
    }

@app.get("/risk-history")
def get_risk_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from auth.jwt_auth import get_current_user
    from models import RiskCalculation
    
    calculations = db.query(RiskCalculation).filter(RiskCalculation.user_id == current_user.id).all()
    
    return {
        "user_id": current_user.id,
        "total_calculations": len(calculations),
        "calculations": [
            {
                "id": calc.id,
                "calculation_type": calc.calculation_type,
                "risk_score": calc.risk_score,
                "risk_level": calc.risk_level,
                "created_at": calc.created_at.isoformat()
            } for calc in calculations
        ]
    }

@app.get("/risk-calculation/{calculation_id}")
def get_risk_calculation(calculation_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from models import RiskCalculation
    
    calculation = db.query(RiskCalculation).filter(
        RiskCalculation.id == calculation_id,
        RiskCalculation.user_id == current_user.id
    ).first()
    
    if not calculation:
        raise HTTPException(status_code=404, detail="Risk calculation not found")
    
    return {
        "id": calculation.id,
        "calculation_type": calculation.calculation_type,
        "risk_score": calculation.risk_score,
        "risk_level": calculation.risk_level,
        "input_data": calculation.input_data,
        "breakdown": calculation.breakdown,
        "percentage_breakdown": calculation.percentage_breakdown,
        "attribution": calculation.attribution,
        "derived_metrics": calculation.derived_metrics,
        "created_at": calculation.created_at.isoformat(),
        "user_id": calculation.user_id
    }
