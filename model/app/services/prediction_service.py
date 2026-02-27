import joblib
import os
import numpy as np

MODEL_PATH = os.path.join("app", "models", "trained_model.pkl")
model = joblib.load(MODEL_PATH)

FEATURE_ORDER = [
    'Diabetes_012',
    'HighBP',
    'HighChol',
    'CholCheck',
    'BMI',
    'Smoker',
    'PhysActivity',
    'Fruits',
    'Veggies',
    'HvyAlcoholConsump',
    'AnyHealthcare',
    'NoDocbcCost',
    'GenHlth',
    'MentHlth',
    'PhysHlth',
    'DiffWalk',
    'Sex',
    'Age',
    'Education',
    'Income'
]

def predict_risk(input_data: dict):

    features = np.array([[input_data[col] for col in FEATURE_ORDER]])

    prob = model.predict_proba(features)[0][1]

    risk_score = float(round(prob * 100, 2))

    if risk_score <= 25:
        level = "Low"
    elif risk_score <= 50:
        level = "Moderate"
    elif risk_score <= 75:
        level = "High"
    else:
        level = "Critical"

    return risk_score, level
