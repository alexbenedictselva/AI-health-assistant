# def generate_cardiac_summary(result: dict) -> str:
#     """Generate a brief summary of the cardiac risk assessment"""
#     risk_level = result.get("risk_level", "Unknown")
#     risk_score = result.get("risk_score", 0)
    
#     # Find the highest contributing factor
#     percentages = result.get("percentage_breakdown", {})
#     if not percentages:
#         return f"Cardiac Risk: {risk_level} (Score: {risk_score})"
    
#     max_factor = max(percentages, key=percentages.get)
#     max_percentage = percentages[max_factor]
    
#     factor_names = {
#         "immediate_cardiac_percentage": "heart symptoms",
#         "lifestyle_percentage": "lifestyle factors", 
#         "baseline_percentage": "baseline health factors"
#     }
    
#     main_factor = factor_names.get(max_factor, "health factors")
    
#     if risk_score > 50:
#         urgency = "Requires immediate medical attention"
#     elif risk_score > 25:
#         urgency = "Needs monitoring and lifestyle changes"
#     else:
#         urgency = "Well managed"
    
#     return f"{risk_level} (Score: {risk_score}). Primary concern: {main_factor} ({max_percentage}%). {urgency}."

# def generate_cardiac_explanation(result: dict):
#     explanation = []

#     score = result.get("risk_score")
#     level = result.get("risk_level", "Unknown Risk")

#     attribution = result.get("attribution", {})
#     immediate = attribution.get("immediate", {})
#     lifestyle = attribution.get("lifestyle", {})
#     baseline = attribution.get("baseline", {})

#     # ---------------- EXECUTIVE SUMMARY ----------------
#     if score is not None:
#         explanation.append(
#             f"Your cardiac health risk is classified as **{level}** "
#             f"with a total risk score of **{score}**."
#         )
#     else:
#         explanation.append(
#             f"Your cardiac health risk is classified as **{level}**."
#         )

#     if immediate:
#         explanation.append(
#             "The main contributors to your risk are related to **current heart symptoms and measurements**."
#         )
#     elif lifestyle:
#         explanation.append(
#             "The main contributors to your risk are related to **lifestyle and medical factors**."
#         )
#     else:
#         explanation.append(
#             "Your risk is mainly influenced by **baseline health factors**."
#         )

#     if level in ["High Risk", "Critical Risk"]:
#         explanation.append(
#             "This level of risk requires medical attention and should not be ignored."
#         )

#     # ---------------- IMMEDIATE CARDIAC RISK ----------------
#     if immediate:
#         explanation.append("")
#         explanation.append("**Immediate Cardiac Indicators:**")

#         if "chest_pain" in immediate:
#             explanation.append(
#                 "You reported chest pain or discomfort, which can indicate stress on the heart."
#             )

#         if "breathlessness" in immediate:
#             explanation.append(
#                 "Shortness of breath suggests the heart may be struggling to pump efficiently."
#             )

#         if "heart_rate" in immediate:
#             explanation.append(
#                 "An elevated resting heart rate increases cardiac workload."
#             )

#         if "blood_pressure" in immediate:
#             explanation.append(
#                 "High blood pressure forces the heart to work harder than normal."
#             )

#     # ---------------- LIFESTYLE & MEDICAL RISK ----------------
#     if lifestyle:
#         explanation.append("")
#         explanation.append("**Lifestyle and Medical Factors:**")

#         if "smoking" in lifestyle:
#             explanation.append(
#                 "Smoking damages blood vessels and significantly increases heart disease risk."
#             )

#         if "activity" in lifestyle:
#             explanation.append(
#                 "Low physical activity weakens heart efficiency over time."
#             )

#         if "diet" in lifestyle:
#             explanation.append(
#                 "A high-fat or unbalanced diet contributes to cholesterol buildup in arteries."
#             )

#         if "diabetes" in lifestyle:
#             explanation.append(
#                 "Diabetes increases the risk of artery damage and heart complications."
#             )

#     # ---------------- BASELINE VULNERABILITY ----------------
#     if baseline:
#         explanation.append("")
#         explanation.append("**Baseline Health Vulnerability:**")

#         if "age" in baseline:
#             explanation.append(
#                 "Increasing age naturally raises the risk of heart disease."
#             )

#         if "bmi" in baseline:
#             explanation.append(
#                 "Excess body weight puts additional strain on the heart."
#             )

#         if "family_history" in baseline:
#             explanation.append(
#                 "A family history of heart disease increases genetic risk."
#             )

#     # ---------------- FINAL GUIDANCE ----------------
#     explanation.append("")
#     explanation.append(
#         "Improving physical activity, maintaining a heart-healthy diet, "
#         "avoiding smoking, and monitoring symptoms can help reduce cardiac risk."
#     )

#     if level in ["High Risk", "Critical Risk"]:
#         explanation.append(
#             "If symptoms such as chest pain or breathlessness worsen, "
#             "seek medical attention immediately."
#         )

#     return explanation

#cardiac_explanation_ai.py

def safe_get_cardiac(d, path, default=None):
    """
    Safely fetch nested dictionary values for cardiac data.
    path = ["a","b","c"]
    """
    for key in path:
        if isinstance(d, dict) and key in d:
            d = d[key]
        else:
            return default
    return d


def generate_cardiac_summary(data: dict) -> str:
    """Generate a brief summary of the cardiac risk assessment"""
    risk_level = data.get("risk_level", "Unknown")
    risk_score = data.get("risk_score", 0)
    
    # Find the highest contributing factor
    percentages = data.get("percentage_breakdown", {})
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


def generate_cardiac_explanation(data: dict):
    explanation = []

    # ---------------- Overall Risk ----------------
    risk_level = data.get("risk_level", "Unknown")
    risk_score = data.get("risk_score")

    if risk_score is not None:
        explanation.append(f"Your cardiac health risk is classified as **{risk_level}** with a score of **{risk_score}** because multiple cardiovascular factors are working together to elevate your heart disease risk.")

    # ---------------- Immediate Cardiac Risk ----------------
    cardiac_percent = safe_get_cardiac(data, ["percentage_breakdown", "immediate_cardiac_percentage"])
    cardiac_attr = safe_get_cardiac(data, ["attribution", "immediate"], {})

    if cardiac_percent is not None:
        explanation.append(f"**Immediate cardiac symptoms contribute {cardiac_percent}% of your risk** because:")

    # Chest Pain
    if "chest_pain" in cardiac_attr:
        chest_pain_score = cardiac_attr["chest_pain"]
        if chest_pain_score >= 20:
            explanation.append("• You're experiencing severe chest pain, which indicates significant cardiac stress and potential blockage in coronary arteries restricting blood flow to heart muscle.")
        elif chest_pain_score >= 10:
            explanation.append("• You have occasional chest pain, suggesting intermittent cardiac stress possibly due to reduced blood flow during physical or emotional stress.")

    # Shortness of Breath
    if "breathlessness" in cardiac_attr:
        breath_score = cardiac_attr["breathlessness"]
        if breath_score >= 15:
            explanation.append("• Shortness of breath at rest indicates your heart is struggling to pump blood efficiently, causing fluid backup in your lungs and reduced oxygen delivery to tissues.")
        elif breath_score >= 8:
            explanation.append("• Shortness of breath during exertion shows your heart cannot meet increased oxygen demands, suggesting reduced cardiac output or early heart failure.")

    # Heart Rate
    if "heart_rate" in cardiac_attr:
        hr_score = cardiac_attr["heart_rate"]
        if hr_score >= 10:
            explanation.append("• Your elevated heart rate (>120 BPM) forces your heart to work much harder, increasing oxygen demand while potentially reducing filling time between beats.")
        elif hr_score >= 5:
            explanation.append("• Your moderately high heart rate (100-120 BPM) indicates increased cardiac workload, possibly due to stress, deconditioning, or underlying heart conditions.")

    # Blood Pressure
    if "blood_pressure" in cardiac_attr:
        bp_score = cardiac_attr["blood_pressure"]
        if bp_score >= 10:
            explanation.append("• Very high blood pressure damages artery walls and forces your heart to pump against excessive resistance, leading to heart muscle thickening and eventual failure.")
        elif bp_score >= 5:
            explanation.append("• High blood pressure increases cardiac workload and accelerates atherosclerosis, causing progressive damage to both heart muscle and blood vessels.")

    # ---------------- Lifestyle & Medical Risk ----------------
    lifestyle_percent = safe_get_cardiac(data, ["percentage_breakdown", "lifestyle_percentage"])
    lifestyle_attr = safe_get_cardiac(data, ["attribution", "lifestyle"], {})

    if lifestyle_percent is not None:
        explanation.append(f"**Lifestyle and medical factors contribute {lifestyle_percent}% of your risk** because:")

    # Smoking
    if "smoking" in lifestyle_attr:
        smoking_score = lifestyle_attr["smoking"]
        if smoking_score >= 10:
            explanation.append("• Current smoking directly damages blood vessel walls, promotes blood clots, reduces oxygen in blood, and accelerates atherosclerotic plaque formation.")
        elif smoking_score >= 5:
            explanation.append("• Past smoking has caused lasting damage to your cardiovascular system, though quitting has significantly reduced your ongoing risk.")

    # Physical Activity
    if "activity" in lifestyle_attr:
        activity_score = lifestyle_attr["activity"]
        if activity_score >= 10:
            explanation.append("• Lack of physical activity weakens your heart muscle, reduces cardiovascular efficiency, and contributes to other risk factors like high blood pressure and diabetes.")
        elif activity_score >= 5:
            explanation.append("• Inconsistent physical activity means your heart isn't getting the regular exercise needed to maintain optimal strength and efficiency.")

    # Diet
    if "diet" in lifestyle_attr:
        diet_score = lifestyle_attr["diet"]
        if diet_score >= 5:
            explanation.append("• A high-fat diet increases cholesterol levels, promoting atherosclerotic plaque buildup in coronary arteries that can lead to heart attacks.")
        elif diet_score >= 3:
            explanation.append("• Your mixed diet contributes moderately to cardiovascular risk through occasional high-fat meals that can affect cholesterol and inflammation levels.")

    # Diabetes
    if "diabetes" in lifestyle_attr:
        explanation.append("• Diabetes accelerates atherosclerosis by damaging blood vessel walls through high glucose, increasing inflammation, and promoting abnormal cholesterol patterns.")

    # ---------------- Baseline Vulnerability ----------------
    baseline_percent = safe_get_cardiac(data, ["percentage_breakdown", "baseline_percentage"])
    baseline_attr = safe_get_cardiac(data, ["attribution", "baseline"], {})

    if baseline_percent is not None:
        explanation.append(f"**Baseline health factors contribute {baseline_percent}% of your risk** because:")

    # Age
    if "age" in baseline_attr:
        age_score = baseline_attr["age"]
        if age_score >= 10:
            explanation.append("• Advanced age (>55 years) significantly increases risk because arteries naturally stiffen, heart muscle weakens, and atherosclerotic plaque accumulates over decades.")
        elif age_score >= 5:
            explanation.append("• Middle age (40-55 years) begins to increase cardiac risk as the cumulative effects of aging start affecting heart and blood vessel function.")

    # BMI
    if "bmi" in baseline_attr:
        bmi_score = baseline_attr["bmi"]
        if bmi_score >= 10:
            explanation.append("• Obesity significantly increases cardiac risk by raising blood pressure, promoting diabetes, increasing inflammation, and forcing the heart to work harder to supply a larger body mass.")
        elif bmi_score >= 5:
            explanation.append("• Being overweight increases cardiac workload and contributes to other risk factors like high blood pressure, diabetes, and abnormal cholesterol levels.")

    # Family History
    if "family_history" in baseline_attr:
        explanation.append("• Family history of heart disease indicates genetic predisposition to cardiovascular problems, including inherited tendencies toward high cholesterol, hypertension, and early atherosclerosis.")

    # ---------------- Final Guidance ----------------
    if risk_score and risk_score <= 25:
        explanation.append("**The good news:** Your low cardiac risk shows you're managing heart health well. Continue regular exercise, heart-healthy diet, and routine medical checkups to maintain this positive status.")
    elif risk_score and risk_score > 75:
        explanation.append("**Critical action needed:** Your high cardiac risk requires immediate medical evaluation. Seek cardiology consultation, consider cardiac testing, and implement aggressive lifestyle changes immediately.")
    else:
        explanation.append("**Action recommended:** Regular cardio exercise strengthens heart muscle, a Mediterranean-style diet reduces inflammation and cholesterol, smoking cessation dramatically lowers risk, and stress management helps control blood pressure - all working together to protect your cardiovascular system.")

    return explanation