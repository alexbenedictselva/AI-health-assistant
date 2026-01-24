def safe_get(d, path, default=None):
    """
    Safely fetch nested dictionary values.
    path = ["a","b","c"]
    """
    for key in path:
        if isinstance(d, dict) and key in d:
            d = d[key]
        else:
            return default
    return d


def generate_explanation(data: dict):
    explanation = []

    # ---------------- Overall Risk ----------------
    risk_level = data.get("risk_level", "Unknown")
    risk_score = data.get("risk_score")

    if risk_score is not None:
        explanation.append(
            f"Your overall health risk is classified as **{risk_level}**, "
            f"with a total risk score of **{risk_score}**."
        )
    else:
        explanation.append(
            f"Your overall health risk is classified as **{risk_level}**."
        )

    # ---------------- Immediate Glycemic Risk ----------------
    gly_percent = safe_get(data, ["percentage_breakdown", "immediate_glycemic_percentage"])
    gly_attr = safe_get(data, ["attribution", "immediate_glycemic"], {})

    if gly_percent is not None:
        explanation.append(
            f"Blood sugar–related factors contribute approximately "
            f"**{gly_percent}%** of your total risk."
        )

    glucose_value = gly_attr.get("glucose_value")
    glucose_context = gly_attr.get("glucose_context")

    if glucose_value is not None and glucose_context is not None:
        explanation.append(
            f"Your blood glucose reading was **{glucose_value} mg/dL**, "
            f"measured during **{glucose_context}** conditions."
        )

    trend = gly_attr.get("trend")
    if trend == "worsening":
        explanation.append(
            "Your glucose levels show a worsening trend over time, "
            "which increases short-term risk."
        )
    elif trend == "stable":
        explanation.append(
            "Your glucose levels appear relatively stable."
        )
    elif trend == "improving":
        explanation.append(
            "Your glucose levels are improving, which reduces immediate risk."
        )

    # ---------------- Treatment & Symptoms ----------------
    treat_percent = safe_get(data, ["percentage_breakdown", "treatment_symptom_percentage"])
    treat_attr = safe_get(data, ["attribution", "treatment_symptoms"], {})

    if treat_percent is not None:
        explanation.append(
            f"Treatment and symptom-related factors account for "
            f"**{treat_percent}%** of your risk."
        )

    symptoms = treat_attr.get("symptoms")
    if symptoms == "severe":
        explanation.append(
            "You reported severe symptoms, which suggests unstable glucose control."
        )
    elif symptoms == "mild":
        explanation.append(
            "You reported mild symptoms that may need monitoring."
        )

    medication = treat_attr.get("medication")
    if medication == "insulin":
        explanation.append(
            "Use of insulin increases the possibility of sudden glucose fluctuations."
        )
    elif medication == "oral":
        explanation.append(
            "Oral diabetes medication contributes moderately to risk."
        )

    meal = treat_attr.get("meal_type")
    if meal == "high-carb":
        explanation.append(
            "High-carbohydrate meals can cause rapid increases in blood sugar."
        )
    elif meal == "low-carb":
        explanation.append(
            "Low-carbohydrate meals help stabilize blood sugar."
        )

    # ---------------- Baseline Vulnerability ----------------
    base_percent = safe_get(data, ["percentage_breakdown", "baseline_vulnerability_percentage"])
    base_attr = safe_get(data, ["attribution", "baseline"], {})

    if base_percent is not None:
        explanation.append(
            f"Baseline health factors contribute "
            f"**{base_percent}%** of your overall risk."
        )

    diabetes_status = base_attr.get("diabetes_status")
    if diabetes_status:
        explanation.append(
            f"You are classified as **{diabetes_status}**, "
            "which affects long-term risk levels."
        )

    bmi_category = base_attr.get("bmi_category")
    if bmi_category:
        explanation.append(
            f"Your body weight falls in the **{bmi_category}** category."
        )

    age = base_attr.get("age")
    if age:
        explanation.append(
            f"Age is also a contributing factor at **{age} years**."
        )

    if base_attr.get("family_history") is True:
        explanation.append(
            "A family history of diabetes increases genetic risk."
        )

    activity = base_attr.get("physical_activity")
    if activity and activity != "active":
        explanation.append(
            "Lower physical activity levels can reduce insulin sensitivity."
        )

    # ---------------- Final Guidance ----------------
    explanation.append(
        "Regular monitoring, balanced meals, and consistent physical activity "
        "can help lower your overall risk."
    )

    return explanation
