def calculate_cardiac_risk(data: dict):
    score = 0
    attribution = {
        "immediate": {},
        "lifestyle": {},
        "baseline": {}
    }

    # -------- Section 1: Immediate Cardiac Risk --------

    chest_pain = data.get("chest_pain")
    if chest_pain == "severe":
        score += 20
        attribution["immediate"]["chest_pain"] = 20
    elif chest_pain == "sometimes":
        score += 10
        attribution["immediate"]["chest_pain"] = 10
    

    breath = data.get("shortness_of_breath")
    if breath == "rest":
        score += 15
        attribution["immediate"]["breathlessness"] = 15
    elif breath == "exertion":
        score += 8
        attribution["immediate"]["breathlessness"] = 8

    heart_rate = data.get("heart_rate")
    if heart_rate:
        if heart_rate > 120:
            score += 10
            attribution["immediate"]["heart_rate"] = 10
        elif heart_rate > 100:
            score += 5
            attribution["immediate"]["heart_rate"] = 5

    bp = data.get("blood_pressure")
    if bp == "very_high":
        score += 10
        attribution["immediate"]["blood_pressure"] = 10
    elif bp == "high":
        score += 5
        attribution["immediate"]["blood_pressure"] = 5
    else:
        score+=0
        attribution["immediate"]["blood_pressure"] = 0

    # -------- Section 2: Lifestyle & Medical --------

    smoking = data.get("smoking")
    if smoking == "current":
        score += 10
        attribution["lifestyle"]["smoking"] = 10
    elif smoking == "former":
        score += 5
        attribution["lifestyle"]["smoking"] = 5
    else:
        score+=0
        attribution["lifestyle"]["smoking"] = 0

    activity = data.get("physical_activity")
    if activity == "never":
        score += 10
        attribution["lifestyle"]["activity"] = 10
    elif activity == "sometimes":
        score += 5
        attribution["lifestyle"]["activity"] = 5
    else:
        score+=0
        attribution["lifestyle"]["activity"] = 0

    diet = data.get("diet")
    if diet == "high_fat":
        score += 5
        attribution["lifestyle"]["diet"] = 5
    elif diet == "mixed":
        score += 3
        attribution["lifestyle"]["diet"] = 3

    if data.get("diabetes"):
        score += 10
        attribution["lifestyle"]["diabetes"] = 10

    # -------- Section 3: Baseline Vulnerability --------

    age = data.get("age")
    if age:
        if age > 55:
            score += 10
            attribution["baseline"]["age"] = 10
        elif age >= 40:
            score += 5
            attribution["baseline"]["age"] = 5

    bmi = data.get("bmi_category")
    if bmi == "obese":
        score += 10
        attribution["baseline"]["bmi"] = 10
    elif bmi == "overweight":
        score += 5
        attribution["baseline"]["bmi"] = 5

    if data.get("family_history"):
        score += 5
        attribution["baseline"]["family_history"] = 5

    # -------- Risk Level --------

    if score <= 25:
        level = "Low Risk"
    elif score <= 50:
        level = "Moderate Risk"
    elif score <= 75:
        level = "High Risk"
    else:
        level = "Critical Risk"

    score = min(score, 100)  # Cap at 100
    
    return {
        "risk_score": score,
        "risk_level": level,
        "attribution": attribution
    }
