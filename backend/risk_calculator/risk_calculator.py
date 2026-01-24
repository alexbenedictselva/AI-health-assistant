def calculate_risk_score(
    glucose_value,
    measurement_context,
    trend,
    symptoms,
    medication_type,
    meal_type,
    diabetes_status,
    age,
    weight_kg,          # NEW
    height_cm,          # NEW
    family_history,
    physical_activity
):
    total_score = 0

    # -----------------------------
    # 1. IMMEDIATE GLYCEMIC RISK
    # -----------------------------
    if measurement_context == "fasting":
        if glucose_value < 100:
            glucose_points = 0
        elif 100 <= glucose_value <= 125:
            glucose_points = 8
        elif 126 <= glucose_value <= 160:
            glucose_points = 15
        else:
            glucose_points = 25
    else:  # post-meal or random
        if glucose_value < 140:
            glucose_points = 0
        elif 140 <= glucose_value <= 180:
            glucose_points = 8
        elif 181 <= glucose_value <= 250:
            glucose_points = 15
        else:
            glucose_points = 25

    trend_points = {
        "improving": 0,
        "stable": 5,
        "worsening": 15
    }[trend]

    immediate_glycemic_risk = glucose_points + trend_points
    total_score += immediate_glycemic_risk

    # -----------------------------
    # 2. TREATMENT & SYMPTOMS
    # -----------------------------
    symptom_points = {
        "none": 0,
        "mild": 8,
        "severe": 15
    }[symptoms]

    medication_points = {
        "none": 0,
        "oral": 5,
        "insulin": 10
    }[medication_type]

    meal_points = {
        "low-carb": 0,
        "balanced": 2,
        "high-carb": 5
    }[meal_type]

    treatment_symptom_risk = symptom_points + medication_points + meal_points
    total_score += treatment_symptom_risk

    # -----------------------------
    # 3. BASELINE VULNERABILITY
    # -----------------------------
    diabetes_points = {
        "non-diabetic": 0,
        "prediabetic": 4,
        "type2": 7,
        "type1": 10
    }[diabetes_status]

    if age < 30:
        age_points = 0
    elif age <= 45:
        age_points = 2
    else:
        age_points = 5

    # -----------------------------
    # BMI CALCULATION (NEW)
    # -----------------------------
    height_m = height_cm / 100
    bmi = weight_kg / (height_m ** 2)

    if bmi < 18.5:
        bmi_points = 0
        bmi_category = "underweight"
    elif bmi < 25:
        bmi_points = 0
        bmi_category = "normal"
    elif bmi < 30:
        bmi_points = 2
        bmi_category = "overweight"
    else:
        bmi_points = 5
        bmi_category = "obese"

    family_points = 5 if family_history else 0

    activity_points = {
        "active": 0,
        "sometimes": 2,
        "never": 5
    }[physical_activity]

    baseline_risk = (
        diabetes_points +
        age_points +
        bmi_points +
        family_points +
        activity_points
    )

    total_score += baseline_risk
    total_score = min(total_score, 100)

    if total_score <= 25:
        risk_level = "Low Risk"
    elif total_score <= 50:
        risk_level = "Moderate Risk"
    elif total_score <= 75:
        risk_level = "High Risk"
    else:
        risk_level = "Critical Risk"

    return {
        "risk_score": total_score,
        "risk_level": risk_level,
        "derived_metrics": {
            "bmi": round(bmi, 2),
            "bmi_category": bmi_category
        },
        "breakdown": {
            "immediate_glycemic_risk": immediate_glycemic_risk,
            "treatment_symptom_risk": treatment_symptom_risk,
            "baseline_vulnerability_risk": baseline_risk
        }
    }
