from pydantic import BaseModel, Field

class RiskInput(BaseModel):
    # -------- GLUCOSE INPUT --------
    glucose_value: float = Field(..., gt=0)
    measurement_context: str
    trend: str
    symptoms: str

    # -------- TREATMENT & LIFESTYLE --------
    medication_type: str
    meal_type: str
    physical_activity: str

    # -------- BASELINE HEALTH --------
    diabetes_status: str
    age: int = Field(..., gt=0)

    # -------- ANTHROPOMETRIC DATA --------
    weight_kg: float = Field(..., gt=0)
    height_cm: float = Field(..., gt=0)

    # -------- GENETIC RISK --------
    family_history: bool
    
    def get_bmi_category(self) -> str:
        bmi = self.weight_kg / ((self.height_cm / 100) ** 2)
        if bmi < 25:
            return "normal"
        elif bmi < 30:
            return "overweight"
        else:
            return "obese"
