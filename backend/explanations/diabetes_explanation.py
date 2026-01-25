# def safe_get(d, path, default=None):
#     """
#     Safely fetch nested dictionary values.
#     path = ["a","b","c"]
#     """
#     for key in path:
#         if isinstance(d, dict) and key in d:
#             d = d[key]
#         else:
#             return default
#     return d

# def generate_summary(data: dict) -> str:
#     """Generate a brief summary of the risk assessment"""
#     risk_level = data.get("risk_level", "Unknown")
#     risk_score = data.get("risk_score", 0)
    
#     # Find the highest contributing factor
#     percentages = data.get("percentage_breakdown", {})
#     if not percentages:
#         return f"Risk Level: {risk_level} (Score: {risk_score})"
    
#     max_factor = max(percentages, key=percentages.get)
#     max_percentage = percentages[max_factor]
    
#     factor_names = {
#         "immediate_glycemic_percentage": "blood glucose levels",
#         "treatment_symptom_percentage": "treatment and symptoms", 
#         "baseline_vulnerability_percentage": "baseline health factors"
#     }
    
#     main_factor = factor_names.get(max_factor, "health factors")
    
#     if risk_score > 50:
#         urgency = "Requires immediate attention"
#     elif risk_score > 25:
#         urgency = "Needs monitoring"
#     else:
#         urgency = "Well managed"
    
#     return f"{risk_level} (Score: {risk_score}). Primary concern: {main_factor} ({max_percentage}%). {urgency}."

# def generate_explanation(data: dict):
#     explanation = []

#     # ---------------- Overall Risk ----------------
#     risk_level = data.get("risk_level", "Unknown")
#     risk_score = data.get("risk_score")

#     if risk_score is not None:
#         explanation.append(
#             f"Your overall health risk is classified as **{risk_level}**, "
#             f"with a total risk score of **{risk_score}**."
#         )
#     else:
#         explanation.append(
#             f"Your overall health risk is classified as **{risk_level}**."
#         )

#     # ---------------- Immediate Glycemic Risk ----------------
#     gly_percent = safe_get(data, ["percentage_breakdown", "immediate_glycemic_percentage"])
#     gly_attr = safe_get(data, ["attribution", "immediate_glycemic"], {})

#     if gly_percent is not None:
#         explanation.append(
#             f"Blood sugar–related factors contribute approximately "
#             f"**{gly_percent}%** of your total risk."
#         )

#     glucose_value = gly_attr.get("glucose_value")
#     glucose_context = gly_attr.get("glucose_context")

#     if glucose_value is not None and glucose_context is not None:
#         explanation.append(
#             f"Your blood glucose reading was **{glucose_value} mg/dL**, "
#             f"measured during **{glucose_context}** conditions."
#         )

#     trend = gly_attr.get("trend")
#     if trend == "worsening":
#         explanation.append(
#             "Your glucose levels show a worsening trend over time, "
#             "which increases short-term risk."
#         )
#     elif trend == "stable":
#         explanation.append(
#             "Your glucose levels appear relatively stable."
#         )
#     elif trend == "improving":
#         explanation.append(
#             "Your glucose levels are improving, which reduces immediate risk."
#         )

#     # ---------------- Treatment & Symptoms ----------------
#     treat_percent = safe_get(data, ["percentage_breakdown", "treatment_symptom_percentage"])
#     treat_attr = safe_get(data, ["attribution", "treatment_symptoms"], {})

#     if treat_percent is not None:
#         explanation.append(
#             f"Treatment and symptom-related factors account for "
#             f"**{treat_percent}%** of your risk."
#         )

#     symptoms = treat_attr.get("symptoms")
#     if symptoms == "severe":
#         explanation.append(
#             "You reported severe symptoms, which suggests unstable glucose control."
#         )
#     elif symptoms == "mild":
#         explanation.append(
#             "You reported mild symptoms that may need monitoring."
#         )

#     medication = treat_attr.get("medication")
#     if medication == "insulin":
#         explanation.append(
#             "Use of insulin increases the possibility of sudden glucose fluctuations."
#         )
#     elif medication == "oral":
#         explanation.append(
#             "Oral diabetes medication contributes moderately to risk."
#         )

#     meal = treat_attr.get("meal_type")
#     if meal == "high-carb":
#         explanation.append(
#             "High-carbohydrate meals can cause rapid increases in blood sugar."
#         )
#     elif meal == "low-carb":
#         explanation.append(
#             "Low-carbohydrate meals help stabilize blood sugar."
#         )

#     # ---------------- Baseline Vulnerability ----------------
#     base_percent = safe_get(data, ["percentage_breakdown", "baseline_vulnerability_percentage"])
#     base_attr = safe_get(data, ["attribution", "baseline"], {})

#     if base_percent is not None:
#         explanation.append(
#             f"Baseline health factors contribute "
#             f"**{base_percent}%** of your overall risk."
#         )

#     diabetes_status = base_attr.get("diabetes_status")
#     if diabetes_status:
#         explanation.append(
#             f"You are classified as **{diabetes_status}**, "
#             "which affects long-term risk levels."
#         )

#     bmi_category = base_attr.get("bmi_category")
#     if bmi_category:
#         explanation.append(
#             f"Your body weight falls in the **{bmi_category}** category."
#         )

#     age = base_attr.get("age")
#     if age:
#         explanation.append(
#             f"Age is also a contributing factor at **{age} years**."
#         )

#     if base_attr.get("family_history") is True:
#         explanation.append(
#             "A family history of diabetes increases genetic risk."
#         )

#     activity = base_attr.get("physical_activity")
#     if activity and activity != "active":
#         explanation.append(
#             "Lower physical activity levels can reduce insulin sensitivity."
#         )

#     # ---------------- Final Guidance ----------------
#     explanation.append(
#         "Regular monitoring, balanced meals, and consistent physical activity "
#         "can help lower your overall risk."
#     )

#     return explanation

#diabetes explanation_ai.py
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


def generate_summary(data: dict) -> str:
    """Generate a brief summary of the risk assessment"""
    risk_level = data.get("risk_level", "Unknown")
    risk_score = data.get("risk_score", 0)
    
    # Find the highest contributing factor
    percentages = data.get("percentage_breakdown", {})
    if not percentages:
        return f"Risk Level: {risk_level} (Score: {risk_score})"
    
    max_factor = max(percentages, key=percentages.get)
    max_percentage = percentages[max_factor]
    
    factor_names = {
        "immediate_glycemic_percentage": "blood glucose levels",
        "treatment_symptom_percentage": "treatment and symptoms", 
        "baseline_vulnerability_percentage": "baseline health factors"
    }
    
    main_factor = factor_names.get(max_factor, "health factors")
    
    if risk_score > 50:
        urgency = "Requires immediate attention"
    elif risk_score > 25:
        urgency = "Needs monitoring"
    else:
        urgency = "Well managed"
    
    return f"{risk_level} (Score: {risk_score}). Primary concern: {main_factor} ({max_percentage}%). {urgency}."


def generate_explanation(data: dict):
    explanation = []

    # ---------------- Overall Risk ----------------
    risk_level = data.get("risk_level", "Unknown")
    risk_score = data.get("risk_score")

    if risk_score is not None:
        explanation.append(f"Your overall health risk is classified as **{risk_level}** with a score of **{risk_score}** because multiple health factors are working together to elevate your diabetes risk.")

    # ---------------- Immediate Glycemic Risk ----------------
    gly_percent = safe_get(data, ["percentage_breakdown", "immediate_glycemic_percentage"])
    gly_attr = safe_get(data, ["attribution", "immediate_glycemic"], {})

    if gly_percent is not None:
        explanation.append(f"**Blood glucose factors contribute {gly_percent}% of your risk** because:")

    glucose_value = gly_attr.get("glucose_value")
    glucose_context = gly_attr.get("glucose_context")

    if glucose_value is not None and glucose_context is not None:
        if glucose_context == "fasting" and glucose_value >= 126:
            explanation.append(f"• Your fasting glucose of {glucose_value} mg/dL is above 126 mg/dL, indicating your body cannot properly regulate blood sugar overnight when no food is consumed.")
        elif glucose_context == "post-meal" and glucose_value >= 200:
            explanation.append(f"• Your post-meal glucose of {glucose_value} mg/dL exceeds 200 mg/dL, showing your body struggles to process carbohydrates effectively.")
        elif glucose_context == "fasting" and 100 <= glucose_value < 126:
            explanation.append(f"• Your fasting glucose of {glucose_value} mg/dL is in the prediabetic range (100-125), meaning your insulin is becoming less effective at controlling blood sugar.")
        elif glucose_context == "post-meal" and 140 <= glucose_value < 200:
            explanation.append(f"• Your post-meal glucose of {glucose_value} mg/dL is elevated (140-199), indicating impaired glucose tolerance after eating.")

    trend = gly_attr.get("trend")
    if trend == "worsening":
        explanation.append("• Your glucose trend is worsening because your body's ability to produce or use insulin is declining over time, leading to progressively higher blood sugar levels.")
    elif trend == "stable":
        explanation.append("• Your glucose levels are stable, suggesting your current treatment is maintaining blood sugar control, though not optimally.")
    elif trend == "improving":
        explanation.append("• Your glucose levels are improving because lifestyle changes or medication adjustments are helping your body better manage blood sugar.")

    # ---------------- Treatment & Symptoms ----------------
    treat_percent = safe_get(data, ["percentage_breakdown", "treatment_symptom_percentage"])
    treat_attr = safe_get(data, ["attribution", "treatment_symptoms"], {})

    if treat_percent is not None:
        explanation.append(f"**Treatment and symptoms contribute {treat_percent}% of your risk** because:")

    symptoms = treat_attr.get("symptoms")
    if symptoms == "severe":
        explanation.append("• You're experiencing severe symptoms (like excessive thirst, frequent urination, fatigue) because high blood sugar is causing dehydration and forcing your kidneys to work overtime.")
    elif symptoms == "mild":
        explanation.append("• You have mild symptoms because your blood sugar fluctuations are causing subtle but noticeable effects on your energy levels and body functions.")
    elif symptoms == "none":
        explanation.append("• You have no symptoms currently, which is positive, but diabetes can be silent while still causing internal damage to blood vessels and organs.")

    medication = treat_attr.get("medication")
    if medication == "insulin":
        explanation.append("• You require insulin because your pancreas cannot produce enough insulin naturally, but insulin therapy increases risk of dangerous low blood sugar episodes.")
    elif medication == "oral":
        explanation.append("• You're taking oral medication because your body has developed insulin resistance, requiring pharmaceutical help to maintain blood sugar control.")
    elif medication == "none":
        explanation.append("• You're not on diabetes medication, which could mean your condition is well-controlled through lifestyle, or you may need treatment to prevent complications.")

    meal = treat_attr.get("meal_type")
    if meal == "high-carb":
        explanation.append("• High-carbohydrate meals spike your blood sugar because carbs break down into glucose, overwhelming your body's limited ability to process sugar effectively.")
    elif meal == "balanced":
        explanation.append("• Your balanced meals help moderate blood sugar swings, though carbohydrates still require your body to produce insulin for proper glucose processing.")
    elif meal == "low-carb":
        explanation.append("• Your low-carb diet helps reduce risk because fewer carbohydrates mean less glucose for your compromised insulin system to handle.")

    # ---------------- Baseline Vulnerability ----------------
    base_percent = safe_get(data, ["percentage_breakdown", "baseline_vulnerability_percentage"])
    base_attr = safe_get(data, ["attribution", "baseline"], {})

    if base_percent is not None:
        explanation.append(f"**Baseline health factors contribute {base_percent}% of your risk** because:")

    diabetes_status = base_attr.get("diabetes_status")
    if diabetes_status == "type2":
        explanation.append("• You have Type 2 diabetes because your cells have become resistant to insulin, and your pancreas cannot produce enough insulin to overcome this resistance.")
    elif diabetes_status == "type1":
        explanation.append("• You have Type 1 diabetes because your immune system has destroyed the insulin-producing cells in your pancreas, requiring lifelong insulin replacement.")
    elif diabetes_status == "prediabetic":
        explanation.append("• You're prediabetic because your insulin sensitivity is declining, putting you at high risk of developing full Type 2 diabetes within 5-10 years without intervention.")
    elif diabetes_status == "non-diabetic":
        explanation.append("• You're currently non-diabetic, which is excellent, but other risk factors still require monitoring to prevent future diabetes development.")

    bmi_category = base_attr.get("bmi_category")
    if bmi_category == "overweight":
        explanation.append("• Being overweight increases risk because excess fat tissue, especially around the abdomen, releases hormones that make your cells more resistant to insulin.")
    elif bmi_category == "obese":
        explanation.append("• Obesity significantly increases risk because excess body fat causes chronic inflammation and severely impairs your body's ability to use insulin effectively.")
    elif bmi_category == "normal":
        explanation.append("• Your normal weight is protective against diabetes, as healthy body composition supports optimal insulin sensitivity and glucose metabolism.")
    elif bmi_category == "underweight":
        explanation.append("• Being underweight may indicate other health issues, though it generally doesn't increase diabetes risk like excess weight does.")

    age = base_attr.get("age")
    if age and age > 45:
        explanation.append(f"• Age ({age} years) is a factor because insulin production naturally declines with age, and your cells become less responsive to insulin over time.")
    elif age and 30 <= age <= 45:
        explanation.append(f"• At {age} years, age is starting to become a minor risk factor as your body's insulin efficiency begins to gradually decline.")
    elif age and age < 30:
        explanation.append(f"• Your young age ({age} years) is protective, as your body's insulin production and sensitivity are typically at their peak.")

    if base_attr.get("family_history") is True:
        explanation.append("• Family history increases risk because you've inherited genetic variants that affect insulin production and glucose metabolism, making you more susceptible to diabetes.")
    elif base_attr.get("family_history") is False:
        explanation.append("• No family history of diabetes is protective, as you haven't inherited genetic predispositions that increase diabetes susceptibility.")

    activity = base_attr.get("physical_activity")
    if activity == "never":
        explanation.append("• Lack of physical activity worsens risk because exercise is crucial for helping muscle cells absorb glucose and improving insulin sensitivity.")
    elif activity == "sometimes":
        explanation.append("• Inconsistent physical activity contributes to risk because regular exercise is needed to maintain optimal insulin function and glucose uptake by muscles.")
    elif activity == "active":
        explanation.append("• Your active lifestyle helps reduce risk because regular exercise improves insulin sensitivity and helps muscles efficiently absorb glucose from your bloodstream.")

    # ---------------- Final Guidance ----------------
    if risk_score and risk_score <= 25:
        explanation.append("**The good news:** Your low risk score shows you're managing diabetes risk well. Continue your current healthy habits and regular monitoring to maintain this positive trajectory.")
    else:
        explanation.append("**The good news:** Many of these risk factors can be improved through consistent lifestyle changes. Regular exercise increases insulin sensitivity, balanced low-carb meals prevent glucose spikes, and weight loss reduces insulin resistance - all working together to lower your overall risk.")

    return explanation