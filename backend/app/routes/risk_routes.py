from fastapi import APIRouter
from app.schemas.risk_schema import RiskRequest
from app.services.prediction_service import predict_risk
from app.utils.converters import convert_to_native_python

router = APIRouter()

@router.post("/predict")
def predict(data: RiskRequest):
    
    input_dict = data.dict()
    
    risk_score, risk_level = predict_risk(input_dict)
    
    response = {
        "risk_score": risk_score,
        "risk_level": risk_level
    }
    
    # Ensure all values are JSON-serializable
    return convert_to_native_python(response)
