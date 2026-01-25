# api/risk_routes.py

from fastapi import APIRouter
from models.diabetes_model import RiskInput
from models.cardiac_model import CardiacRiskInput
from risk_calculator.diabetes_risk_calculator import calculate_risk_score

router = APIRouter()

@router.post("/diabetes-risk")
def calculate_risk(data: RiskInput):
    from database import SessionLocal
    from models.diabetes_db_model import DiabetesRiskRecord
    from ExplanableAI.diabetes_explanation_ai import generate_explanation, generate_summary
    
    # Calculate risk score
    result = calculate_risk_score(
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
    
    # Store in database
    db = SessionLocal()
    try:
        db_record = DiabetesRiskRecord(
            user_id=data.user_id,
            glucose_value=data.glucose_value,
            measurement_context=data.measurement_context,
            trend=data.trend,
            symptoms=data.symptoms,
            medication_type=data.medication_type,
            meal_type=data.meal_type,
            age=data.age,
            weight_kg=data.weight_kg,
            height_cm=data.height_cm,
            bmi=result["derived_metrics"]["bmi"],
            bmi_category=result["derived_metrics"]["bmi_category"],
            diabetes_status=data.diabetes_status,
            family_history=data.family_history,
            physical_activity=data.physical_activity,
            risk_score=result["risk_score"],
            risk_level=result["risk_level"]
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
    finally:
        db.close()
    
    # Generate explanation and summary
    explanation = generate_explanation(result)
    summary = generate_summary(result)
    
    # Add explanation to result
    result["explanation"] = explanation
    result["summary"] = summary
    result["record_id"] = db_record.record_id
    
    return result

@router.post("/cardiac-risk")
def calculate_cardiac_risk_endpoint(data: CardiacRiskInput):
    from risk_calculator.cardiac_risk_calculator import calculate_cardiac_risk
    from database import SessionLocal
    from models.cardiac_db_model import CardiacRiskRecord
    from ExplanableAI.cardiac_explanation_ai import generate_cardiac_explanation, generate_cardiac_summary
    
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
    
    # Store in database
    db = SessionLocal()
    try:
        db_record = CardiacRiskRecord(
            user_id=data.user_id,
            chest_pain=data.chest_pain,
            shortness_of_breath=data.shortness_of_breath,
            heart_rate=data.heart_rate,
            blood_pressure=data.blood_pressure,
            smoking=data.smoking,
            physical_activity=data.physical_activity,
            diet=data.diet,
            diabetes=data.diabetes,
            age=data.age,
            bmi_category=data.bmi_category,
            family_history=data.family_history,
            risk_score=result["risk_score"],
            risk_level=result["risk_level"]
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
    finally:
        db.close()
    
    # Generate explanation and summary
    explanation = generate_cardiac_explanation(result)
    summary = generate_cardiac_summary(result)
    
    # Add explanation to result
    result["explanation"] = explanation
    result["summary"] = summary
    result["record_id"] = db_record.record_id
    
    return result