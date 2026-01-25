# api/risk_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from risk_calculator.model import RiskInput
from risk_calculator.cardiac_model import CardiacRiskInput
from calculators.diabetes_calculator import calculate_risk_score
from calculators.cardiac_calculator import calculate_cardiac_risk
from auth.jwt_auth import get_current_user
from models import User
from database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
def metrics(data: RiskInput, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from models import RiskCalculation, Explanation
    from explanations.diabetes_explanation import generate_explanation, generate_summary
    
    # Calculate risk
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
    
    # Save risk calculation to database
    risk_calc = RiskCalculation(
        user_id=current_user.id,
        calculation_type="diabetes",
        input_data=data.dict(),
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        breakdown=result["breakdown"],
        percentage_breakdown=result["percentage_breakdown"],
        attribution=result["attribution"],
        derived_metrics=result["derived_metrics"]
    )
    
    db.add(risk_calc)
    db.commit()
    db.refresh(risk_calc)
    
    # Generate and save explanation
    summary = generate_summary(result)
    explanation_text = generate_explanation(result)
    
    explanation = Explanation(
        risk_calculation_id=risk_calc.id,
        summary=summary,
        detailed_explanation=explanation_text,
        explanation_type="diabetes"
    )
    
    db.add(explanation)
    db.commit()
    
    # Add calculation ID to response
    result["calculation_id"] = risk_calc.id
    result["timestamp"] = risk_calc.created_at.isoformat()
    
    return result

@router.post("/cardiac-risk")
def calculate_cardiac_risk_endpoint(data: CardiacRiskInput, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from models import RiskCalculation
    
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
    
    # Save to database
    risk_calc = RiskCalculation(
        user_id=current_user.id,
        calculation_type="cardiac",
        input_data=risk_data,
        risk_score=result["risk_score"],
        risk_level=result["risk_level"],
        breakdown=None,
        percentage_breakdown=result["percentage_breakdown"],
        attribution=result["attribution"],
        derived_metrics=None
    )
    
    db.add(risk_calc)
    db.commit()
    db.refresh(risk_calc)
    
    # Add calculation ID to response
    result["calculation_id"] = risk_calc.id
    result["timestamp"] = risk_calc.created_at.isoformat()
    
    return result