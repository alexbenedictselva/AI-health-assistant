def generate_diabetes_recommendations(risk_data: dict):
    """
    Rule-based, explanation-driven diabetes recommendations.
    No diagnosis. No emergency or medication instructions.
    Guidance is strictly derived from attribution data.
    """

    recommendations = []

    risk_level = risk_data.get("risk_level", "Unknown")
    attribution = risk_data.get("attribution", {})

    # ---------------- IMMEDIATE GLYCEMIC CONTRIBUTORS ----------------
    glycemic = attribution.get("immediate_glycemic", {})

    glucose_value = glycemic.get("glucose_value")
    glucose_context = glycemic.get("glucose_context")
    trend = glycemic.get("trend")

    if glucose_value is not None:
        if glucose_context == "fasting" and glucose_value >= 126:
            recommendations.append(
                "Elevated fasting glucose is a major contributor to your risk, indicating reduced overnight blood sugar regulation."
            )
        elif glucose_context == "post-meal" and glucose_value >= 180:
            recommendations.append(
                "High post-meal glucose levels contribute significantly to your risk, suggesting difficulty processing dietary carbohydrates."
            )
        elif glucose_value >= 100:
            recommendations.append(
                "Borderline glucose levels contribute to your risk and benefit from consistent dietary and activity management."
            )

    if trend == "worsening":
        recommendations.append(
            "Your glucose trend is worsening, which suggests current lifestyle or treatment strategies may need adjustment."
        )
    elif trend == "stable":
        recommendations.append(
            "Your glucose trend is stable, indicating partial control that can be strengthened with consistent habits."
        )
    elif trend == "improving":
        recommendations.append(
            "Your improving glucose trend suggests that recent lifestyle or treatment efforts are having a positive effect."
        )

    # ---------------- TREATMENT & SYMPTOM CONTRIBUTORS ----------------
    treatment = attribution.get("treatment_symptoms", {})

    if treatment.get("symptoms") == "severe":
        recommendations.append(
            "Severe symptoms are contributing to your risk. Regular monitoring and timely clinical review are important."
        )
    elif treatment.get("symptoms") == "mild":
        recommendations.append(
            "Mild symptoms indicate ongoing glucose fluctuations that can be improved through consistent management."
        )

    if treatment.get("medication") == "none" and risk_level in ["High Risk", "Critical Risk"]:
        recommendations.append(
            "Absence of medication alongside elevated risk suggests the need for closer medical follow-up."
        )

    if treatment.get("meal_type") == "high-carb":
        recommendations.append(
            "High-carbohydrate meals are contributing to glucose spikes. Reducing refined carbohydrates can help stabilize blood sugar."
        )
    elif treatment.get("meal_type") == "balanced":
        recommendations.append(
            "Balanced meals support glucose control, though portion consistency remains important."
        )
    elif treatment.get("meal_type") == "low-carb":
        recommendations.append(
            "Low-carbohydrate dietary patterns are helping reduce glucose variability."
        )

    # ---------------- BASELINE CONTRIBUTORS ----------------
    baseline = attribution.get("baseline", {})

    if baseline.get("bmi_category") in ["overweight", "obese"]:
        recommendations.append(
            "Body weight is influencing insulin sensitivity. Gradual weight management can significantly reduce diabetes risk."
        )

    if baseline.get("physical_activity") == "never":
        recommendations.append(
            "Lack of physical activity contributes to insulin resistance. Introducing regular light-to-moderate activity can help."
        )
    elif baseline.get("physical_activity") == "sometimes":
        recommendations.append(
            "Inconsistent physical activity contributes to risk. Establishing a regular exercise routine improves glucose uptake."
        )
    elif baseline.get("physical_activity") == "active":
        recommendations.append(
            "Your active lifestyle supports glucose control and helps reduce long-term diabetes complications."
        )

    if baseline.get("family_history") is True:
        recommendations.append(
            "Family history increases susceptibility to diabetes, making preventive lifestyle consistency especially important."
        )

    # ---------------- RISK-LEVEL GUIDANCE ----------------
    if risk_level in ["High Risk", "Critical Risk"]:
        recommendations.append(
            "Your overall diabetes risk is elevated. Consistent monitoring and sustained lifestyle improvements are strongly advised."
        )
    elif risk_level == "Moderate Risk":
        recommendations.append(
            "Your diabetes risk is moderate. Preventive habits and regular monitoring can help prevent progression."
        )
    else:
        recommendations.append(
            "Your diabetes risk is currently low. Maintaining healthy routines is important for long-term protection."
        )

    # ---------------- SAFETY DISCLAIMER ----------------
    recommendations.append(
        "These recommendations provide general health guidance and are not a medical diagnosis."
    )

    return recommendations
