from fastapi import FastAPI
from app.routes.risk_routes import router as risk_router

app = FastAPI(
    title="AI Health Risk Prediction API",
    description="Predicts complication risk using ML and SHAP explainability",
    version="1.0.0"
)

# Root test endpoint
@app.get("/")
def root():
    return {"message": "AI Health Risk Backend is Running Successfully 🚀"}

# Include routes
app.include_router(risk_router, prefix="/api")
