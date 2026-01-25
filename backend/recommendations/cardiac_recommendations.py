def generate_cardiac_recommendations(risk_data: dict):
    recommendations = []

    risk_level = risk_data.get("risk_level", "Unknown")
    attribution = risk_data.get("attribution", {})

    # ---------------- ATTRIBUTION-DRIVEN RECOMMENDATIONS ----------------
    immediate = attribution.get("immediate", {})
    lifestyle = attribution.get("lifestyle", {})
    baseline = attribution.get("baseline", {})

    # Immediate contributors (even if overall risk is low)
    if immediate.get("blood_pressure", 0) > 0:
        recommendations.append(
            "Blood pressure contributes to your cardiac risk. Regular monitoring and lifestyle measures such as reducing salt intake can help."
        )

    if immediate.get("heart_rate", 0) > 0:
        recommendations.append(
            "Heart rate patterns indicate cardiac strain. Stress management and adequate rest are beneficial."
        )

    if immediate.get("chest_pain", 0) > 0:
        recommendations.append(
            "Occasional chest discomfort contributes to risk. Tracking symptoms and avoiding physical overexertion is advised."
        )

    if immediate.get("breathlessness", 0) > 0:
        recommendations.append(
            "Shortness of breath contributes to cardiac workload. Gradual activity pacing and monitoring is recommended."
        )

    # Lifestyle contributors
    if lifestyle.get("smoking", 0) > 0:
        recommendations.append(
            "Smoking contributes significantly to cardiac risk. Reducing or eliminating tobacco use improves heart health."
        )

    if lifestyle.get("activity", 0) > 0:
        recommendations.append(
            "Low or inconsistent physical activity affects heart strength. Regular moderate exercise supports cardiovascular health."
        )

    if lifestyle.get("diet", 0) > 0:
        recommendations.append(
            "Dietary habits influence heart health. A diet rich in fruits, vegetables, and healthy fats is beneficial."
        )

    if lifestyle.get("diabetes", 0) > 0:
        recommendations.append(
            "Diabetes increases cardiovascular strain. Maintaining stable blood glucose helps protect heart health."
        )

    # Baseline contributors
    if baseline.get("bmi", 0) > 0:
        recommendations.append(
            "Body weight affects cardiac workload. Gradual weight management can reduce long-term heart strain."
        )

    if baseline.get("family_history", 0) > 0:
        recommendations.append(
            "Family history increases susceptibility to heart disease. Preventive monitoring is especially important."
        )

    if baseline.get("age", 0) > 0:
        recommendations.append(
            "Age-related cardiovascular changes make regular health checkups beneficial."
        )

    # ---------------- RISK LEVEL SUMMARY (ONLY A SUMMARY) ----------------
    if risk_level == "Low Risk":
        recommendations.append(
            "Overall cardiac risk is currently low. Maintaining consistent healthy habits helps sustain this protection."
        )
    elif risk_level == "Moderate Risk":
        recommendations.append(
            "Overall cardiac risk is moderate. Preventive lifestyle measures and periodic monitoring are advised."
        )
    else:
        recommendations.append(
            "Overall cardiac risk is elevated. Consistent follow-up and sustained lifestyle improvements are important."
        )

    # ---------------- SAFETY DISCLAIMER ----------------
    recommendations.append(
        "These recommendations provide general health guidance and are not a medical diagnosis."
    )

    return recommendations
