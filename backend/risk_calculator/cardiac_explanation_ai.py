def generate_cardiac_summary(result: dict) -> str:
    """Generate a brief summary of the cardiac risk assessment"""
    risk_level = result.get("risk_level", "Unknown")
    risk_score = result.get("risk_score", 0)
    
    # Find the highest contributing factor
    percentages = result.get("percentage_breakdown", {})
    if not percentages:
        return f"Cardiac Risk: {risk_level} (Score: {risk_score})"
    
    max_factor = max(percentages, key=percentages.get)
    max_percentage = percentages[max_factor]
    
    factor_names = {
        "immediate_cardiac_percentage": "heart symptoms",
        "lifestyle_percentage": "lifestyle factors", 
        "baseline_percentage": "baseline health factors"
    }
    
    main_factor = factor_names.get(max_factor, "health factors")
    
    if risk_score > 50:
        urgency = "Requires immediate medical attention"
    elif risk_score > 25:
        urgency = "Needs monitoring and lifestyle changes"
    else:
        urgency = "Well managed"
    
    return f"{risk_level} (Score: {risk_score}). Primary concern: {main_factor} ({max_percentage}%). {urgency}."


def generate_cardiac_explanation(result: dict):
    explanation = []

    score = result.get("risk_score")
    level = result.get("risk_level", "Unknown Risk")

    attribution = result.get("attribution", {})
    immediate = attribution.get("immediate", {})
    lifestyle = attribution.get("lifestyle", {})
    baseline = attribution.get("baseline", {})

    # ---------------- EXECUTIVE SUMMARY ----------------
    if score is not None:
        explanation.append(
            f"Your cardiac health risk is classified as **{level}** "
            f"with a total risk score of **{score}**."
        )
    else:
        explanation.append(
            f"Your cardiac health risk is classified as **{level}**."
        )

    if immediate:
        explanation.append(
            "The main contributors to your risk are related to **current heart symptoms and measurements**."
        )
    elif lifestyle:
        explanation.append(
            "The main contributors to your risk are related to **lifestyle and medical factors**."
        )
    else:
        explanation.append(
            "Your risk is mainly influenced by **baseline health factors**."
        )

    if level in ["High Risk", "Critical Risk"]:
        explanation.append(
            "This level of risk requires medical attention and should not be ignored."
        )

    # ---------------- IMMEDIATE CARDIAC RISK ----------------
    if immediate:
        explanation.append("")

        explanation.append("**Immediate Cardiac Indicators:**")

        if "chest_pain" in immediate:
            explanation.append(
                "You reported chest pain or discomfort, which can indicate stress on the heart."
            )

        if "breathlessness" in immediate:
            explanation.append(
                "Shortness of breath suggests the heart may be struggling to pump efficiently."
            )

        if "heart_rate" in immediate:
            explanation.append(
                "An elevated resting heart rate increases cardiac workload."
            )

        if "blood_pressure" in immediate:
            explanation.append(
                "High blood pressure forces the heart to work harder than normal."
            )

    # ---------------- LIFESTYLE & MEDICAL RISK ----------------
    if lifestyle:
        explanation.append("")

        explanation.append("**Lifestyle and Medical Factors:**")

        if "smoking" in lifestyle:
            explanation.append(
                "Smoking damages blood vessels and significantly increases heart disease risk."
            )

        if "activity" in lifestyle:
            explanation.append(
                "Low physical activity weakens heart efficiency over time."
            )

        if "diet" in lifestyle:
            explanation.append(
                "A high-fat or unbalanced diet contributes to cholesterol buildup in arteries."
            )

        if "diabetes" in lifestyle:
            explanation.append(
                "Diabetes increases the risk of artery damage and heart complications."
            )

    # ---------------- BASELINE VULNERABILITY ----------------
    if baseline:
        explanation.append("")

        explanation.append("**Baseline Health Vulnerability:**")

        if "age" in baseline:
            explanation.append(
                "Increasing age naturally raises the risk of heart disease."
            )

        if "bmi" in baseline:
            explanation.append(
                "Excess body weight puts additional strain on the heart."
            )

        if "family_history" in baseline:
            explanation.append(
                "A family history of heart disease increases genetic risk."
            )

    # ---------------- FINAL GUIDANCE ----------------
    explanation.append("")
    explanation.append(
        "Improving physical activity, maintaining a heart-healthy diet, "
        "avoiding smoking, and monitoring symptoms can help reduce cardiac risk."
    )

    if level in ["High Risk", "Critical Risk"]:
        explanation.append(
            "If symptoms such as chest pain or breathlessness worsen, "
            "seek medical attention immediately."
        )

    return explanation
