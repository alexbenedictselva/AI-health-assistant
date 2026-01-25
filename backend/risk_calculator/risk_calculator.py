def calculate_cardiac_risk(data: dict):
    achieved_score = 0
    max_possible_score = 0

    attribution = {
        "immediate": {},
        "lifestyle": {},
        "baseline": {}
    }

    def apply_rule(section, key, condition, points):
        nonlocal achieved_score, max_possible_score
        if condition:
            achieved_score += points
            attribution[section][key] = points
        max_possible_score += points

    # -------------------------------
    # Section 1: Immediate Cardiac Risk
    # -------------------------------

    chest_pain = data.get("chest_pain")
    if chest_pain:
        apply_rule("immediate", "chest_pain",
                   chest_pain == "severe", 20)
        apply_rule("immediate", "chest_pain",
                   chest_pain == "sometimes", 10)

    breath = data.get("shortness_of_breath")
    if breath:
        apply_rule("immediate", "breathlessness",
                   breath == "rest", 15)
        apply_rule("immediate", "breathlessness",
                   breath == "exertion", 8)

    heart_rate = data.get("heart_rate")
    if isinstance(heart_rate, (int, float)):
        apply_rule("immediate", "heart_rate",
                   heart_rate > 120, 10)
        apply_rule("immediate", "heart_rate",
                   100 <= heart_rate <= 120, 5)

    bp = data.get("blood_pressure")
    if bp:
        apply_rule("immediate", "blood_pressure",
                   bp == "very_high", 10)
        apply_rule("immediate", "blood_pressure",
                   bp == "high", 5)

    # -------------------------------
    # Section 2: Lifestyle & Medical
    # -------------------------------

    smoking = data.get("smoking")
    if smoking:
        apply_rule("lifestyle", "smoking",
                   smoking == "current", 10)
        apply_rule("lifestyle", "smoking",
                   smoking == "former", 5)

    activity = data.get("physical_activity")
    if activity:
        apply_rule("lifestyle", "physical_activity",
                   activity == "never", 10)
        apply_rule("lifestyle", "physical_activity",
                   activity == "sometimes", 5)

    diet = data.get("diet")
    if diet:
        apply_rule("lifestyle", "diet",
                   diet == "high_fat", 5)
        apply_rule("lifestyle", "diet",
                   diet == "mixed", 3)

    if data.get("diabetes") is True:
        apply_rule("lifestyle", "diabetes", True, 10)

    cholesterol = data.get("cholesterol_level")
    if cholesterol:
        apply_rule("lifestyle", "cholesterol",
                   cholesterol == "high", 10)
        apply_rule("lifestyle", "cholesterol",
                   cholesterol == "borderline", 5)

    alcohol = data.get("alcohol_consumption")
    if alcohol:
        apply_rule("lifestyle", "alcohol",
                   alcohol == "heavy", 7)
        apply_rule("lifestyle", "alcohol",
                   alcohol == "moderate", 3)

    stress = data.get("stress_level")
    if stress:
        apply_rule("lifestyle", "stress",
                   stress == "high", 8)
        apply_rule("lifestyle", "stress",
                   stress == "moderate", 4)

    sleep = data.get("sleep_quality")
    if sleep:
        apply_rule("lifestyle", "sleep",
                   sleep == "poor", 5)

    # -------------------------------
    # Section 3: Baseline Vulnerability
    # -------------------------------

    age = data.get("age")
    if isinstance(age, int):
        apply_rule("baseline", "age",
                   age > 55, 10)
        apply_rule("baseline", "age",
                   40 <= age <= 55, 5)

    bmi = data.get("bmi_category")
    if bmi:
        apply_rule("baseline", "bmi",
                   bmi == "obese", 10)
        apply_rule("baseline", "bmi",
                   bmi == "overweight", 5)

    if data.get("family_history") is True:
        apply_rule("baseline", "family_history", True, 5)

    if data.get("previous_heart_condition") is True:
        apply_rule("baseline", "previous_condition", True, 15)

    # -------------------------------
    # Percentage Risk Calculation
    # -------------------------------

    if max_possible_score == 0:
        risk_percentage = 0
    else:
        risk_percentage = round(
            (achieved_score / max_possible_score) * 100, 2
        )

    # -------------------------------
    # Risk Level Classification
    # -------------------------------

    if risk_percentage <= 25:
        level = "Low Risk"
    elif risk_percentage <= 50:
        level = "Moderate Risk"
    elif risk_percentage <= 75:
        level = "High Risk"
    else:
        level = "Critical Risk"

    return {
        "risk_percentage": risk_percentage,
        "risk_level": level,
        "raw_score": achieved_score,
        "max_possible_score": max_possible_score,
        "attribution": attribution
    }
