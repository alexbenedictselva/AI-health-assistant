from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from database import engine, Base, SessionLocal
from api import auth_router, risk_router
from ExplanableAI.diabetes_explanation_ai import generate_explanation, generate_summary

# ---------- APP ----------
app = FastAPI(
    title="AI Health Assistant – Glucose Risk API",
    version="1.0"
)

# ---------- CORS MIDDLEWARE (MUST BE FIRST) ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- CREATE TABLES ----------
try:
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS user_metrics"))
        conn.commit()
except:
    pass

Base.metadata.create_all(bind=engine)

# ---------- INCLUDE ROUTERS ----------
app.include_router(auth_router, tags=["Authentication"])
app.include_router(risk_router, tags=["Risk Calculation"])

# ---------- ROOT & HEALTH CHECK ----------
@app.get("/")
def root():
    return {"status": "Backend is running"}

@app.get("/db-test")
def test_database():
    try:
        db = SessionLocal()
        result = db.execute(text("SELECT 1 as test"))
        db.close()
        return {"status": "Database connected successfully", "test_query": "OK"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")
    
@app.post("/explain-diabetes")
def explain_risk(risk_data: dict):
    explanation = generate_explanation(risk_data)
    summary = generate_summary(risk_data)
    return {
        "risk_level": risk_data.get("risk_level"),
        "summary": summary,
        "explanation": explanation
    }

@app.post("/explain-cardiac")
def explain_cardiac_risk(risk_data: dict):
    from ExplanableAI.cardiac_explanation_ai import generate_cardiac_explanation, generate_cardiac_summary
    
    explanation = generate_cardiac_explanation(risk_data)
    summary = generate_cardiac_summary(risk_data)
    return {
        "risk_level": risk_data.get("risk_level"),
        "summary": summary,
        "explanation": explanation
    }

@app.post("/diabetes-recommendations")
def get_diabetes_recommendations(risk_data: dict):
    from recommendations.diabetes_recommendations import generate_diabetes_recommendations
    from models.recommendations import DiabetesRecommendation
    
    recommendations = generate_diabetes_recommendations(risk_data)
    
    # Store in database
    db = SessionLocal()
    try:
        db_recommendation = DiabetesRecommendation(
            risk_score=risk_data.get("risk_score", 0),
            risk_level=risk_data.get("risk_level", "Unknown"),
            recommendations=recommendations
        )
        db.add(db_recommendation)
        db.commit()
        db.refresh(db_recommendation)
    finally:
        db.close()
    
    return {
        "risk_score": risk_data.get("risk_score"),
        "risk_level": risk_data.get("risk_level"),
        "recommendations": recommendations
    }

@app.post("/cardiac-recommendations")
def get_cardiac_recommendations(risk_data: dict):
    from recommendations.cardiac_recommendations import generate_cardiac_recommendations
    from models.recommendations import CardiacRecommendation
    
    recommendations = generate_cardiac_recommendations(risk_data)
    
    # Store in database
    db = SessionLocal()
    try:
        db_recommendation = CardiacRecommendation(
            risk_score=risk_data.get("risk_score", 0),
            risk_level=risk_data.get("risk_level", "Unknown"),
            recommendations=recommendations
        )
        db.add(db_recommendation)
        db.commit()
        db.refresh(db_recommendation)
    finally:
        db.close()
    
    return {
        "risk_score": risk_data.get("risk_score"),
        "risk_level": risk_data.get("risk_level"),
        "recommendations": recommendations
    }

@app.post("/user-metrics")
def create_user_metrics(metrics_data: dict):
    from models.user_metrics import UserMetrics
    
    db = SessionLocal()
    try:
        # Whitelist accepted fields to avoid passing unexpected keys (e.g., 'diabetes')
        allowed_fields = {
            'user_id', 'disease_type',
            # diabetes fields
            'glucose_value', 'measurement_context', 'trend', 'symptoms', 'medication_type', 'meal_type', 'diabetes_status',
            # cardiac fields
            'chest_pain', 'shortness_of_breath', 'heart_rate', 'blood_pressure', 'smoking', 'diet',
            # common fields
            'age', 'weight_kg', 'height_cm', 'physical_activity', 'family_history'
        }

        filtered = {k: v for k, v in metrics_data.items() if k in allowed_fields}

        # Normalize some common types
        if 'family_history' in filtered:
            # Accept 0/1 or booleans
            if isinstance(filtered['family_history'], int):
                filtered['family_history'] = bool(filtered['family_history'])

        # If disease_type not provided, attempt to infer from available keys
        if 'disease_type' not in filtered:
            if 'glucose_value' in filtered:
                filtered['disease_type'] = 'diabetes'
            elif 'heart_rate' in filtered or 'chest_pain' in filtered:
                filtered['disease_type'] = 'cardiac'
            else:
                filtered['disease_type'] = 'unknown'

        db_metrics = UserMetrics(**filtered)
        db.add(db_metrics)
        db.commit()
        db.refresh(db_metrics)
        return {"message": "Metrics created", "metric_id": db_metrics.metric_id}
    finally:
        db.close()

@app.get("/user-metrics/{user_id}")
def get_user_metrics(user_id: int, disease_type: str = None):
    from models.user_metrics import UserMetrics
    
    db = SessionLocal()
    try:
        query = db.query(UserMetrics).filter(UserMetrics.user_id == user_id)
        if disease_type:
            query = query.filter(UserMetrics.disease_type == disease_type)
        
        metrics = query.all()
        result = []
        for m in metrics:
            metric_dict = {
                "metric_id": m.metric_id,
                "user_id": m.user_id,
                "disease_type": m.disease_type,
                "created_at": m.created_at
            }
            
            # Add disease-specific fields
            if m.disease_type == "diabetes":
                metric_dict.update({
                    "glucose_value": m.glucose_value,
                    "measurement_context": m.measurement_context,
                    "trend": m.trend,
                    "symptoms": m.symptoms,
                    "medication_type": m.medication_type,
                    "meal_type": m.meal_type,
                    "diabetes_status": m.diabetes_status
                })
            elif m.disease_type == "cardiac":
                metric_dict.update({
                    "chest_pain": m.chest_pain,
                    "shortness_of_breath": m.shortness_of_breath,
                    "heart_rate": m.heart_rate,
                    "blood_pressure": m.blood_pressure,
                    "smoking": m.smoking,
                    "diet": m.diet
                })
            
            # Add common fields
            metric_dict.update({
                "age": m.age,
                "weight_kg": m.weight_kg,
                "height_cm": m.height_cm,
                "physical_activity": m.physical_activity,
                "family_history": m.family_history
            })
            
            result.append(metric_dict)
        
        return result
    finally:
        db.close()