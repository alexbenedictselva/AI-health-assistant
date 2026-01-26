from pydantic import BaseModel
from typing import Optional

class CardiacRiskInput(BaseModel):
    # -------- USER REFERENCE --------
    user_id: int
    
    # Immediate cardiac symptoms
    chest_pain: str  # "none", "sometimes", "severe"
    shortness_of_breath: str  # "none", "exertion", "rest"
    heart_rate: Optional[int] = None
    blood_pressure: str  # "normal", "high", "very_high"
    
    # Lifestyle factors
    smoking: str  # "never", "former", "current"
    physical_activity: str  # "active", "sometimes", "never"
    diet: str  # "healthy", "mixed", "high_fat"
    diabetes: bool = False
    
    # Baseline factors
    age: int
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    bmi_category: Optional[str] = 'normal'  # "normal", "overweight", "obese"
    family_history: bool = False