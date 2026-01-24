from fastapi import FastAPI
from risk_calculator.model import RiskInput
from risk_calculator.risk_calculator import calculate_risk_score

app = FastAPI(
    title="AI Health Assistant – Glucose Risk API",
    version="1.0"
)

@app.get("/")
def root():
    return {"status": "Backend is running"}

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
