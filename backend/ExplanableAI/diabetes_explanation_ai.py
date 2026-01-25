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
    all_explanations = []
    priority_explanations = []

    # ---------------- Overall Risk ----------------
    risk_level = data.get("risk_level", "Unknown")
    risk_score = data.get("risk_score")

    if risk_score is not None:
        overall_risk = f"Your overall health risk is classified as **{risk_level}** with a score of **{risk_score}** because multiple health factors are working together to elevate your diabetes risk."
        all_explanations.append(overall_risk)
        priority_explanations.append(overall_risk)

    # ---------------- Immediate Glycemic Risk (HIGHEST PRIORITY) ----------------
    gly_percent = safe_get(data, ["percentage_breakdown", "immediate_glycemic_percentage"])
    gly_attr = safe_get(data, ["attribution", "immediate_glycemic"], {})

    if gly_percent is not None:
        glucose_header = f"**Blood glucose factors contribute {gly_percent}% of your risk** because:"
        all_explanations.append(glucose_header)
        priority_explanations.append(glucose_header)

    glucose_value = gly_attr.get("glucose_value")
    glucose_context = gly_attr.get("glucose_context")

    # Glucose Level (TOP PRIORITY - most important for diabetes)
    if glucose_value is not None and glucose_context is not None:
        glucose_exp = None
        if glucose_context == "fasting" and glucose_value >= 126:
            glucose_exp = f"• Your fasting glucose of {glucose_value} mg/dL is above 126 mg/dL, indicating your body cannot properly regulate blood sugar overnight when no food is consumed."
        elif glucose_context == "post-meal" and glucose_value >= 200:
            glucose_exp = f"• Your post-meal glucose of {glucose_value} mg/dL exceeds 200 mg/dL, showing your body struggles to process carbohydrates effectively."
        elif glucose_context == "fasting" and 100 <= glucose_value < 126:
            glucose_exp = f"• Your fasting glucose of {glucose_value} mg/dL is in the prediabetic range (100-125), meaning your insulin is becoming less effective at controlling blood sugar."
        elif glucose_context == "post-meal" and 140 <= glucose_value < 200:
            glucose_exp = f"• Your post-meal glucose of {glucose_value} mg/dL is elevated (140-199), indicating impaired glucose tolerance after eating."
        # Only append the glucose explanation if one was generated
        if glucose_exp:
            all_explanations.append(glucose_exp)
            priority_explanations.append(glucose_exp)

    # Glucose Trend (HIGH PRIORITY)
    trend = gly_attr.get("trend")
    if trend == "worsening":
        trend_exp = "• Your glucose trend is worsening because your body's ability to produce or use insulin is declining over time, leading to progressively higher blood sugar levels."
        all_explanations.append(trend_exp)
        if len(priority_explanations) < 4:  # Keep top 3 + header
            priority_explanations.append(trend_exp)
    elif trend == "stable":
        trend_exp = "• Your glucose levels are stable, suggesting your current treatment is maintaining blood sugar control, though not optimally."
        all_explanations.append(trend_exp)
    elif trend == "improving":
        trend_exp = "• Your glucose levels are improving because lifestyle changes or medication adjustments are helping your body better manage blood sugar."
        all_explanations.append(trend_exp)

    # ---------------- Treatment & Symptoms ----------------
    treat_percent = safe_get(data, ["percentage_breakdown", "treatment_symptom_percentage"])
    treat_attr = safe_get(data, ["attribution", "treatment_symptoms"], {})

    if treat_percent is not None:
        treatment_header = f"**Treatment and symptoms contribute {treat_percent}% of your risk** because:"
        all_explanations.append(treatment_header)

    symptoms = treat_attr.get("symptoms")
    if symptoms == "severe":
        symptoms_exp = "• You're experiencing severe symptoms (like excessive thirst, frequent urination, fatigue) because high blood sugar is causing dehydration and forcing your kidneys to work overtime."
        all_explanations.append(symptoms_exp)
    elif symptoms == "mild":
        symptoms_exp = "• You have mild symptoms because your blood sugar fluctuations are causing subtle but noticeable effects on your energy levels and body functions."
        all_explanations.append(symptoms_exp)
    elif symptoms == "none":
        symptoms_exp = "• You have no symptoms currently, which is positive, but diabetes can be silent while still causing internal damage to blood vessels and organs."
        all_explanations.append(symptoms_exp)

    medication = treat_attr.get("medication")
    if medication == "insulin":
        med_exp = "• You require insulin because your pancreas cannot produce enough insulin naturally, but insulin therapy increases risk of dangerous low blood sugar episodes."
        all_explanations.append(med_exp)
    elif medication == "oral":
        med_exp = "• You're taking oral medication because your body has developed insulin resistance, requiring pharmaceutical help to maintain blood sugar control."
        all_explanations.append(med_exp)
    elif medication == "none":
        med_exp = "• You're not on diabetes medication, which could mean your condition is well-controlled through lifestyle, or you may need treatment to prevent complications."
        all_explanations.append(med_exp)

    meal = treat_attr.get("meal_type")
    if meal == "high-carb":
        meal_exp = "• High-carbohydrate meals spike your blood sugar because carbs break down into glucose, overwhelming your body's limited ability to process sugar effectively."
        all_explanations.append(meal_exp)
    elif meal == "balanced":
        meal_exp = "• Your balanced meals help moderate blood sugar swings, though carbohydrates still require your body to produce insulin for proper glucose processing."
        all_explanations.append(meal_exp)
    elif meal == "low-carb":
        meal_exp = "• Your low-carb diet helps reduce risk because fewer carbohydrates mean less glucose for your compromised insulin system to handle."
        all_explanations.append(meal_exp)

    # ---------------- Baseline Vulnerability ----------------
    base_percent = safe_get(data, ["percentage_breakdown", "baseline_vulnerability_percentage"])
    base_attr = safe_get(data, ["attribution", "baseline"], {})

    if base_percent is not None:
        baseline_header = f"**Baseline health factors contribute {base_percent}% of your risk** because:"
        all_explanations.append(baseline_header)

    diabetes_status = base_attr.get("diabetes_status")
    if diabetes_status == "type2":
        diabetes_exp = "• You have Type 2 diabetes because your cells have become resistant to insulin, and your pancreas cannot produce enough insulin to overcome this resistance."
        all_explanations.append(diabetes_exp)
    elif diabetes_status == "type1":
        diabetes_exp = "• You have Type 1 diabetes because your immune system has destroyed the insulin-producing cells in your pancreas, requiring lifelong insulin replacement."
        all_explanations.append(diabetes_exp)
    elif diabetes_status == "prediabetic":
        diabetes_exp = "• You're prediabetic because your insulin sensitivity is declining, putting you at high risk of developing full Type 2 diabetes within 5-10 years without intervention."
        all_explanations.append(diabetes_exp)
    elif diabetes_status == "non-diabetic":
        diabetes_exp = "• You're currently non-diabetic, which is excellent, but other risk factors still require monitoring to prevent future diabetes development."
        all_explanations.append(diabetes_exp)

    bmi_category = base_attr.get("bmi_category")
    if bmi_category == "overweight":
        bmi_exp = "• Being overweight increases risk because excess fat tissue, especially around the abdomen, releases hormones that make your cells more resistant to insulin."
        all_explanations.append(bmi_exp)
    elif bmi_category == "obese":
        bmi_exp = "• Obesity significantly increases risk because excess body fat causes chronic inflammation and severely impairs your body's ability to use insulin effectively."
        all_explanations.append(bmi_exp)
    elif bmi_category == "normal":
        bmi_exp = "• Your normal weight is protective against diabetes, as healthy body composition supports optimal insulin sensitivity and glucose metabolism."
        all_explanations.append(bmi_exp)
    elif bmi_category == "underweight":
        bmi_exp = "• Being underweight may indicate other health issues, though it generally doesn't increase diabetes risk like excess weight does."
        all_explanations.append(bmi_exp)

    age = base_attr.get("age")
    if age and age > 45:
        age_exp = f"• Age ({age} years) is a factor because insulin production naturally declines with age, and your cells become less responsive to insulin over time."
        all_explanations.append(age_exp)
    elif age and 30 <= age <= 45:
        age_exp = f"• At {age} years, age is starting to become a minor risk factor as your body's insulin efficiency begins to gradually decline."
        all_explanations.append(age_exp)
    elif age and age < 30:
        age_exp = f"• Your young age ({age} years) is protective, as your body's insulin production and sensitivity are typically at their peak."
        all_explanations.append(age_exp)

    if base_attr.get("family_history") is True:
        family_exp = "• Family history increases risk because you've inherited genetic variants that affect insulin production and glucose metabolism, making you more susceptible to diabetes."
        all_explanations.append(family_exp)
    elif base_attr.get("family_history") is False:
        family_exp = "• No family history of diabetes is protective, as you haven't inherited genetic predispositions that increase diabetes susceptibility."
        all_explanations.append(family_exp)

    activity = base_attr.get("physical_activity")
    if activity == "never":
        activity_exp = "• Lack of physical activity worsens risk because exercise is crucial for helping muscle cells absorb glucose and improving insulin sensitivity."
        all_explanations.append(activity_exp)
    elif activity == "sometimes":
        activity_exp = "• Inconsistent physical activity contributes to risk because regular exercise is needed to maintain optimal insulin function and glucose uptake by muscles."
        all_explanations.append(activity_exp)
    elif activity == "active":
        activity_exp = "• Your active lifestyle helps reduce risk because regular exercise improves insulin sensitivity and helps muscles efficiently absorb glucose from your bloodstream."
        all_explanations.append(activity_exp)

    # ---------------- Final Guidance ----------------
    if risk_score and risk_score <= 25:
        final_guidance = "**The good news:** Your low risk score shows you're managing diabetes risk well. Continue your current healthy habits and regular monitoring to maintain this positive trajectory."
    else:
        final_guidance = "**The good news:** Many of these risk factors can be improved through consistent lifestyle changes. Regular exercise increases insulin sensitivity, balanced low-carb meals prevent glucose spikes, and weight loss reduces insulin resistance - all working together to lower your overall risk."
    
    all_explanations.append(final_guidance)
    priority_explanations.append(final_guidance)

    # Return prioritized structure
    remaining_explanations = [exp for exp in all_explanations if exp not in priority_explanations]
    
    return {
        "priority_explanations": priority_explanations,
        "remaining_explanations": remaining_explanations,
        "show_more_available": len(remaining_explanations) > 0
    }
