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
    all_explanations = []
    priority_explanations = []

    # ---------------- Overall Risk ----------------
    risk_level = data.get("risk_level", "Unknown")
    risk_score = data.get("risk_score")

    if risk_score is not None:
        overall_risk = f"Your cardiac health risk is classified as **{risk_level}** with a score of **{risk_score}** because multiple cardiovascular factors are working together to elevate your heart disease risk."
        all_explanations.append(overall_risk)
        priority_explanations.append(overall_risk)

    # ---------------- Immediate Cardiac Risk (HIGHEST PRIORITY) ----------------
    cardiac_percent = safe_get_cardiac(data, ["percentage_breakdown", "immediate_cardiac_percentage"])
    cardiac_attr = safe_get_cardiac(data, ["attribution", "immediate"], {})

    if cardiac_percent is not None:
        cardiac_header = f"**Immediate cardiac symptoms contribute {cardiac_percent}% of your risk** because:"
        all_explanations.append(cardiac_header)
        priority_explanations.append(cardiac_header)

    # Chest Pain (TOP PRIORITY - like glucose for diabetes)
    if "chest_pain" in cardiac_attr:
        chest_pain_score = cardiac_attr["chest_pain"]
        if chest_pain_score >= 20:
            chest_pain_exp = "• You're experiencing severe chest pain, which indicates significant cardiac stress and potential blockage in coronary arteries restricting blood flow to heart muscle."
            all_explanations.append(chest_pain_exp)
            priority_explanations.append(chest_pain_exp)
        elif chest_pain_score >= 10:
            chest_pain_exp = "• You have occasional chest pain, suggesting intermittent cardiac stress possibly due to reduced blood flow during physical or emotional stress."
            all_explanations.append(chest_pain_exp)
            priority_explanations.append(chest_pain_exp)

    # Shortness of Breath (HIGH PRIORITY)
    if "breathlessness" in cardiac_attr:
        breath_score = cardiac_attr["breathlessness"]
        if breath_score >= 15:
            breath_exp = "• Shortness of breath at rest indicates your heart is struggling to pump blood efficiently, causing fluid backup in your lungs and reduced oxygen delivery to tissues."
            all_explanations.append(breath_exp)
            if len(priority_explanations) < 4:  # Keep top 3 + header
                priority_explanations.append(breath_exp)
        elif breath_score >= 8:
            breath_exp = "• Shortness of breath during exertion shows your heart cannot meet increased oxygen demands, suggesting reduced cardiac output or early heart failure."
            all_explanations.append(breath_exp)
            if len(priority_explanations) < 4:  # Keep top 3 + header
                priority_explanations.append(breath_exp)

    # Heart Rate
    if "heart_rate" in cardiac_attr:
        hr_score = cardiac_attr["heart_rate"]
        if hr_score >= 10:
            hr_exp = "• Your elevated heart rate (>120 BPM) forces your heart to work much harder, increasing oxygen demand while potentially reducing filling time between beats."
            all_explanations.append(hr_exp)
        elif hr_score >= 5:
            hr_exp = "• Your moderately high heart rate (100-120 BPM) indicates increased cardiac workload, possibly due to stress, deconditioning, or underlying heart conditions."
            all_explanations.append(hr_exp)

    # Blood Pressure
    if "blood_pressure" in cardiac_attr:
        bp_score = cardiac_attr["blood_pressure"]
        if bp_score >= 10:
            bp_exp = "• Very high blood pressure damages artery walls and forces your heart to pump against excessive resistance, leading to heart muscle thickening and eventual failure."
            all_explanations.append(bp_exp)
        elif bp_score >= 5:
            bp_exp = "• High blood pressure increases cardiac workload and accelerates atherosclerosis, causing progressive damage to both heart muscle and blood vessels."
            all_explanations.append(bp_exp)

    # ---------------- Lifestyle & Medical Risk ----------------
    lifestyle_percent = safe_get_cardiac(data, ["percentage_breakdown", "lifestyle_percentage"])
    lifestyle_attr = safe_get_cardiac(data, ["attribution", "lifestyle"], {})

    if lifestyle_percent is not None:
        lifestyle_header = f"**Lifestyle and medical factors contribute {lifestyle_percent}% of your risk** because:"
        all_explanations.append(lifestyle_header)

    # Smoking
    if "smoking" in lifestyle_attr:
        smoking_score = lifestyle_attr["smoking"]
        if smoking_score >= 10:
            smoking_exp = "• Current smoking directly damages blood vessel walls, promotes blood clots, reduces oxygen in blood, and accelerates atherosclerotic plaque formation."
            all_explanations.append(smoking_exp)
        elif smoking_score >= 5:
            smoking_exp = "• Past smoking has caused lasting damage to your cardiovascular system, though quitting has significantly reduced your ongoing risk."
            all_explanations.append(smoking_exp)

    # Physical Activity
    if "activity" in lifestyle_attr:
        activity_score = lifestyle_attr["activity"]
        if activity_score >= 10:
            activity_exp = "• Lack of physical activity weakens your heart muscle, reduces cardiovascular efficiency, and contributes to other risk factors like high blood pressure and diabetes."
            all_explanations.append(activity_exp)
        elif activity_score >= 5:
            activity_exp = "• Inconsistent physical activity means your heart isn't getting the regular exercise needed to maintain optimal strength and efficiency."
            all_explanations.append(activity_exp)

    # Diet
    if "diet" in lifestyle_attr:
        diet_score = lifestyle_attr["diet"]
        if diet_score >= 5:
            diet_exp = "• A high-fat diet increases cholesterol levels, promoting atherosclerotic plaque buildup in coronary arteries that can lead to heart attacks."
            all_explanations.append(diet_exp)
        elif diet_score >= 3:
            diet_exp = "• Your mixed diet contributes moderately to cardiovascular risk through occasional high-fat meals that can affect cholesterol and inflammation levels."
            all_explanations.append(diet_exp)

    # Diabetes
    if "diabetes" in lifestyle_attr:
        diabetes_exp = "• Diabetes accelerates atherosclerosis by damaging blood vessel walls through high glucose, increasing inflammation, and promoting abnormal cholesterol patterns."
        all_explanations.append(diabetes_exp)

    # ---------------- Baseline Vulnerability ----------------
    baseline_percent = safe_get_cardiac(data, ["percentage_breakdown", "baseline_percentage"])
    baseline_attr = safe_get_cardiac(data, ["attribution", "baseline"], {})

    if baseline_percent is not None:
        baseline_header = f"**Baseline health factors contribute {baseline_percent}% of your risk** because:"
        all_explanations.append(baseline_header)

    # Age
    if "age" in baseline_attr:
        age_score = baseline_attr["age"]
        if age_score >= 10:
            age_exp = "• Advanced age (>55 years) significantly increases risk because arteries naturally stiffen, heart muscle weakens, and atherosclerotic plaque accumulates over decades."
            all_explanations.append(age_exp)
        elif age_score >= 5:
            age_exp = "• Middle age (40-55 years) begins to increase cardiac risk as the cumulative effects of aging start affecting heart and blood vessel function."
            all_explanations.append(age_exp)

    # BMI
    if "bmi" in baseline_attr:
        bmi_score = baseline_attr["bmi"]
        if bmi_score >= 10:
            bmi_exp = "• Obesity significantly increases cardiac risk by raising blood pressure, promoting diabetes, increasing inflammation, and forcing the heart to work harder to supply a larger body mass."
            all_explanations.append(bmi_exp)
        elif bmi_score >= 5:
            bmi_exp = "• Being overweight increases cardiac workload and contributes to other risk factors like high blood pressure, diabetes, and abnormal cholesterol levels."
            all_explanations.append(bmi_exp)

    # Family History
    if "family_history" in baseline_attr:
        family_exp = "• Family history of heart disease indicates genetic predisposition to cardiovascular problems, including inherited tendencies toward high cholesterol, hypertension, and early atherosclerosis."
        all_explanations.append(family_exp)

    # ---------------- Final Guidance ----------------
    if risk_score and risk_score <= 25:
        final_guidance = "**The good news:** Your low cardiac risk shows you're managing heart health well. Continue regular exercise, heart-healthy diet, and routine medical checkups to maintain this positive status."
    elif risk_score and risk_score > 75:
        final_guidance = "**Critical action needed:** Your high cardiac risk requires immediate medical evaluation. Seek cardiology consultation, consider cardiac testing, and implement aggressive lifestyle changes immediately."
    else:
        final_guidance = "**Action recommended:** Regular cardio exercise strengthens heart muscle, a Mediterranean-style diet reduces inflammation and cholesterol, smoking cessation dramatically lowers risk, and stress management helps control blood pressure - all working together to protect your cardiovascular system."
    
    all_explanations.append(final_guidance)
    priority_explanations.append(final_guidance)

    # Return prioritized structure
    remaining_explanations = [exp for exp in all_explanations if exp not in priority_explanations]
    
    return {
        "priority_explanations": priority_explanations,
        "remaining_explanations": remaining_explanations,
        "show_more_available": len(remaining_explanations) > 0
    }