def generate_glucose_recommendations(data: dict):
    recommendations = []

    glucose = data.get("glucose_value")
    context = data.get("measurement_context")
    trend = data.get("trend")
    symptoms = data.get("symptoms")
    meal_type = data.get("meal_type")
    activity = data.get("physical_activity")
    bmi = data.get("bmi_category")

    # -----------------------------
    # 1. FASTING GLUCOSE THRESHOLD
    # -----------------------------
    if context == "fasting" and glucose is not None and glucose > 126:
        recommendations.append({
            "issue": "High fasting glucose",
            "diet": "Avoid late-night meals and reduce carbohydrates at dinner. Prefer vegetables and lean protein.",
            "exercise": "Add a 10–15 minute light walk after dinner.",
            "tip": "Consistent dinner timing helps stabilize overnight glucose."
        })

    # -----------------------------
    # 2. POST-MEAL GLUCOSE THRESHOLD
    # -----------------------------
    if context == "post-meal" and glucose is not None and glucose > 180:
        recommendations.append({
            "issue": "High post-meal glucose spike",
            "diet": "Reduce refined carbs and sugary foods. Choose low-glycemic foods and increase fiber intake.",
            "exercise": "Take a 10–20 minute walk after meals.",
            "tip": "Post-meal movement helps reduce glucose spikes."
        })

    # -----------------------------
    # 3. WORSENING TREND
    # -----------------------------
    if trend == "worsening":
        recommendations.append({
            "issue": "Glucose levels worsening over time",
            "diet": "Maintain consistent meal timing and avoid frequent snacking.",
            "exercise": "Engage in at least 30 minutes of moderate activity daily.",
            "tip": "Consistency is more effective than intensity."
        })

    # -----------------------------
    # 4. HIGH-CARB DIET
    # -----------------------------
    if meal_type == "high-carb":
        recommendations.append({
            "issue": "High carbohydrate intake",
            "diet": "Replace refined carbs with whole grains, vegetables, and protein-rich foods.",
            "exercise": "Pair meals with light activity such as walking.",
            "tip": "Lower-carb meals reduce glucose fluctuations."
        })

    # -----------------------------
    # 5. PHYSICAL INACTIVITY
    # -----------------------------
    if activity == "never":
        recommendations.append({
            "issue": "Low physical activity",
            "diet": "Avoid excess calories and focus on portion control.",
            "exercise": "Start with 15–20 minutes of walking daily and increase gradually.",
            "tip": "Even light movement improves insulin sensitivity."
        })

    # -----------------------------
    # 6. HIGH BMI
    # -----------------------------
    if bmi in ["overweight", "obese"]:
        recommendations.append({
            "issue": "Elevated body weight",
            "diet": "Focus on balanced meals with controlled portions and minimal processed foods.",
            "exercise": "Choose low-impact exercises like walking or cycling.",
            "tip": "Gradual weight loss improves glucose control."
        })

    # -----------------------------
    # 7. SYMPTOMS PRESENT (SAFETY)
    # -----------------------------
    if symptoms in ["mild", "severe"]:
        recommendations.append({
            "issue": "Symptoms related to glucose imbalance",
            "diet": "Avoid sugary foods and stay hydrated.",
            "exercise": "Avoid strenuous exercise until glucose stabilizes.",
            "tip": "Monitor glucose closely and seek medical advice if symptoms persist."
        })

    return recommendations

def generate_cardiac_recommendations(data: dict):
    recommendations = []
    
    chest_pain = data.get("chest_pain")
    breath = data.get("shortness_of_breath")
    smoking = data.get("smoking")
    activity = data.get("physical_activity")
    diet = data.get("diet")
    bmi = data.get("bmi_category")
    bp = data.get("blood_pressure")
    
    # Chest pain recommendations
    if chest_pain in ["sometimes", "severe"]:
        recommendations.append({
            "issue": "Chest pain or discomfort",
            "diet": "Reduce sodium intake and avoid heavy meals.",
            "exercise": "Avoid strenuous activity until cleared by doctor.",
            "tip": "Seek immediate medical attention if chest pain worsens."
        })
    
    # Smoking recommendations
    if smoking == "current":
        recommendations.append({
            "issue": "Current smoking",
            "diet": "Increase antioxidant-rich foods (fruits, vegetables).",
            "exercise": "Start with light walking to improve circulation.",
            "tip": "Quitting smoking is the most important step for heart health."
        })
    
    # Physical activity recommendations
    if activity == "never":
        recommendations.append({
            "issue": "Lack of physical activity",
            "diet": "Focus on heart-healthy foods like fish, nuts, and vegetables.",
            "exercise": "Start with 10-15 minutes of walking daily.",
            "tip": "Regular activity strengthens the heart muscle."
        })
    
    # Diet recommendations
    if diet == "high_fat":
        recommendations.append({
            "issue": "High-fat diet",
            "diet": "Choose lean proteins, whole grains, and limit saturated fats.",
            "exercise": "Increase activity to help process dietary fats.",
            "tip": "Mediterranean diet patterns are heart-protective."
        })
    
    # Blood pressure recommendations
    if bp in ["high", "very_high"]:
        recommendations.append({
            "issue": "Elevated blood pressure",
            "diet": "Reduce sodium, increase potassium-rich foods.",
            "exercise": "Regular moderate exercise helps lower blood pressure.",
            "tip": "Monitor blood pressure regularly and take medications as prescribed."
        })
    
    return recommendations