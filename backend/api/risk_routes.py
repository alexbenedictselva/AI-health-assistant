# api/risk_routes.py

from fastapi import APIRouter
from risk_calculator.model import RiskInput
from risk_calculator.cardiac_model import CardiacRiskInput
from calculators.diabetes_calculator import calculate_risk_score
from calculators.cardiac_calculator import calculate_cardiac_risk

router = APIRouter()

@router.post("/calculate-risk")
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
        weight_kg=data.weight_kg,
        height_cm=data.height_cm,
        family_history=data.family_history,
        physical_activity=data.physical_activity
    )

@router.post("/metrics")
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

@router.post("/cardiac-risk")
def calculate_cardiac_risk_endpoint(data: CardiacRiskInput):
    from risk_calculator.cardiac_risk_calculator import calculate_cardiac_risk
    
    # Convert Pydantic model to dict
    risk_data = data.dict()
    
    # Calculate risk
    result = calculate_cardiac_risk(risk_data)
    
    # Add percentage breakdown
    total_score = result["risk_score"]
    attribution = result["attribution"]
    
    immediate_total = sum(attribution["immediate"].values())
    lifestyle_total = sum(attribution["lifestyle"].values())
    baseline_total = sum(attribution["baseline"].values())
    
    if total_score > 0:
        result["percentage_breakdown"] = {
            "immediate_cardiac_percentage": round((immediate_total / total_score) * 100, 1),
            "lifestyle_percentage": round((lifestyle_total / total_score) * 100, 1),
            "baseline_percentage": round((baseline_total / total_score) * 100, 1)
        }
    else:
        result["percentage_breakdown"] = {
            "immediate_cardiac_percentage": 0,
            "lifestyle_percentage": 0,
            "baseline_percentage": 0
        }
    
    return result