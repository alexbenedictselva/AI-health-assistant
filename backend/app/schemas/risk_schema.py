from pydantic import BaseModel

class RiskRequest(BaseModel):
    Diabetes_012: int
    HighBP: int
    HighChol: int
    CholCheck: int
    BMI: float
    Smoker: int
    PhysActivity: int
    Fruits: int
    Veggies: int
    HvyAlcoholConsump: int
    AnyHealthcare: int
    NoDocbcCost: int
    GenHlth: int
    MentHlth: int
    PhysHlth: int
    DiffWalk: int
    Sex: int
    Age: int
    Education: int
    Income: int
