from pydantic import BaseModel

class RiskInput(BaseModel):
    glucose_value: float
    measurement_context: str
    trend: str
    symptoms: str
    medication_type: str
    meal_type: str
    diabetes_status: str
    age: int
    bmi_category: str
    family_history: bool
    physical_activity: str
