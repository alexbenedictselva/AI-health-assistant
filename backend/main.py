from fastapi import FastAPI, HTTPException
from risk_calculator.model import RiskInput
from risk_calculator.risk_calculator import calculate_risk_score
from database import engine, SessionLocal
from sqlalchemy import text

app = FastAPI(
    title="AI Health Assistant – Glucose Risk API",
    version="1.0"
)

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

@app.post("/calculate-risk")
def calculate_risk(data: RiskInput):
    return calculate_risk_score(
        glucose_value=data.glucose_value,
        measurement_context=data.measurement_context,
        trend=data.trend,
        symptoms=data.symptoms,
        medication_type=data.medication_type,
        meal_type=data.meal_type,
        diabetes_status=data.diabetes_status,
        age=data.age,
        bmi_category=data.bmi_category,
        family_history=data.family_history,
        physical_activity=data.physical_activity
    )

@app.post("/metrics")
def metrics(data: RiskInput):
    return calculate_risk_score(
        glucose_value=data.glucose_value,
        measurement_context=data.measurement_context,
        trend=data.trend,
        symptoms=data.symptoms,
        medication_type=data.medication_type,
        meal_type=data.meal_type,
        diabetes_status=data.diabetes_status,
        age=data.age,
        weight_kg=data.weight_kg,
        height_cm=data.height_cm,
        family_history=data.family_history,
        physical_activity=data.physical_activity
    )
