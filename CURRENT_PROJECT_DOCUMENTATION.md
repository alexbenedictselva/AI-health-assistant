# AI Health Assistant - Complete Project Documentation

## Project Overview
The AI Health Assistant is an advanced health monitoring system that provides comprehensive risk assessment for both glucose-related conditions and cardiac health. The system features explainable AI capabilities, user authentication, and detailed risk analysis with percentage breakdowns and actionable insights.

## Current Project Status
- ✅ Backend API with FastAPI
- ✅ User authentication system with debug endpoints
- ✅ Glucose risk calculation algorithm
- ✅ Cardiac risk assessment system
- ✅ Explainable AI for risk interpretation
- ✅ Database integration with MySQL
- ✅ Modular router architecture
- ⏳ Frontend (placeholder)
- ⏳ Data analysis components (placeholder)

## Technology Stack

### Backend
- **Framework**: FastAPI with modular router architecture
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with SHA-256 password hashing
- **AI/ML**: Custom risk scoring algorithms with explainable AI
- **API Server**: Uvicorn ASGI server
- **Database Driver**: PyMySQL

### Dependencies
```
fastapi==0.128.0
uvicorn==0.40.0
sqlalchemy
pymysql
python-jose
pydantic==2.12.5
```

## Project Architecture

### Directory Structure
```
ai-health-assistant/
├── backend/
│   ├── api/                          # API route modules
│   │   ├── __init__.py
│   │   ├── auth_routes.py           # Authentication endpoints
│   │   └── risk_routes.py           # Risk calculation endpoints
│   ├── auth/                        # Authentication utilities
│   │   ├── __init__.py
│   │   └── auth_utils.py
│   ├── ExplanableAI/                # AI explanation system
│   │   └── explanation_ai.py        # Risk explanation generator
│   ├── models/                      # Database models
│   │   ├── __init__.py
│   │   └── user.py                  # User model
│   ├── risk_calculator/             # Core risk assessment
│   │   ├── __init__.py
│   │   ├── auth.py                  # Auth utilities
│   │   ├── cardiac_explanation_ai.py # Cardiac risk explanations
│   │   ├── cardiac_model.py         # Cardiac risk data models
│   │   ├── cardiac_risk_calculator.py # Cardiac risk algorithm
│   │   ├── db_models.py             # SQLAlchemy models
│   │   ├── model.py                 # Glucose risk data models
│   │   └── risk_calculator.py       # Glucose risk algorithm
│   ├── database.py                  # Database configuration
│   ├── main.py                      # FastAPI application
│   └── requirements.txt             # Dependencies
├── data/                            # Data storage (placeholder)
├── docs/                            # Documentation (placeholder)
├── frontend/                        # Frontend application (placeholder)
└── README.md                        # Project readme
```

## Database Configuration

### Connection Details
- **Host**: localhost:3306
- **Database**: ai_health_db
- **User**: root
- **Password**: 7010812682
- **Driver**: mysql+pymysql

### Database Models

#### User Model
```python
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

## Authentication System

### Security Implementation
- **Algorithm**: SHA-256 with random salt
- **Salt Generation**: 16-byte random hex string
- **Storage Format**: `{salt}:{hash}`
- **JWT Algorithm**: HS256
- **Token Expiration**: 60 minutes

### Authentication Endpoints

#### POST `/register`
Register a new user account.

**Request:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
}
```

**Response:**
```json
{
    "message": "User registered successfully"
}
```

#### POST `/login`
Authenticate user and receive JWT token.

**Request:**
```json
{
    "email": "john@example.com",
    "password": "securepassword123"
}
```

**Response:**
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
}
```

#### POST `/debug-login`
Debug endpoint for troubleshooting authentication issues.

**Response:**
```json
{
    "user_found": true,
    "email": "john@example.com",
    "stored_hash": "a1b2c3d4e5f6g7h8i9j0...",
    "password_valid": true
}
```

#### GET `/users`
List all registered users (for debugging).

## Risk Assessment Systems

### 1. Glucose Risk Assessment

#### Data Model (RiskInput)
```python
class RiskInput(BaseModel):
    # Glucose measurements
    glucose_value: float = Field(..., gt=0)
    measurement_context: str  # "fasting", "post-meal", "random"
    trend: str               # "improving", "stable", "worsening"
    symptoms: str            # "none", "mild", "severe"
    
    # Treatment & lifestyle
    medication_type: str     # "none", "oral", "insulin"
    meal_type: str          # "low-carb", "balanced", "high-carb"
    physical_activity: str  # "active", "sometimes", "never"
    
    # Baseline health
    diabetes_status: str    # "non-diabetic", "prediabetic", "type1", "type2"
    age: int = Field(..., gt=0)
    
    # Anthropometric data
    weight_kg: float = Field(..., gt=0)
    height_cm: float = Field(..., gt=0)
    
    # Genetic risk
    family_history: bool
```

#### Scoring Algorithm

**1. Immediate Glycemic Risk (0-40 points)**
- Fasting glucose: < 100 (0pts), 100-125 (8pts), 126-160 (15pts), > 160 (25pts)
- Post-meal glucose: < 140 (0pts), 140-180 (8pts), 181-250 (15pts), > 250 (25pts)
- Trend: improving (0pts), stable (5pts), worsening (15pts)

**2. Treatment & Symptoms Risk (0-28 points)**
- Symptoms: none (0pts), mild (8pts), severe (15pts)
- Medication: none (0pts), oral (5pts), insulin (10pts)
- Meal type: low-carb (0pts), balanced (2pts), high-carb (5pts)

**3. Baseline Vulnerability Risk (0-32 points)**
- Diabetes status: non-diabetic (0pts), prediabetic (4pts), type2 (7pts), type1 (10pts)
- Age: < 30 (0pts), 30-45 (2pts), > 45 (5pts)
- BMI: normal (0pts), overweight (2pts), obese (5pts)
- Family history: no (0pts), yes (5pts)
- Physical activity: active (0pts), sometimes (2pts), never (5pts)

### 2. Cardiac Risk Assessment

#### Data Model (CardiacRiskInput)
```python
class CardiacRiskInput(BaseModel):
    # Immediate cardiac symptoms
    chest_pain: str              # "none", "sometimes", "severe"
    shortness_of_breath: str     # "none", "exertion", "rest"
    heart_rate: Optional[int]    # Heart rate in BPM
    blood_pressure: str          # "normal", "high", "very_high"
    
    # Lifestyle factors
    smoking: str                 # "never", "former", "current"
    physical_activity: str       # "active", "sometimes", "never"
    diet: str                   # "healthy", "mixed", "high_fat"
    diabetes: bool = False
    
    # Baseline factors
    age: int
    bmi_category: str           # "normal", "overweight", "obese"
    family_history: bool = False
```

#### Cardiac Scoring Algorithm

**1. Immediate Cardiac Risk (0-55 points)**
- Chest pain: severe (20pts), sometimes (10pts), none (0pts)
- Shortness of breath: at rest (15pts), on exertion (8pts), none (0pts)
- Heart rate: > 120 BPM (10pts), 100-120 BPM (5pts), < 100 (0pts)
- Blood pressure: very high (10pts), high (5pts), normal (0pts)

**2. Lifestyle & Medical Risk (0-35 points)**
- Smoking: current (10pts), former (5pts), never (0pts)
- Physical activity: never (10pts), sometimes (5pts), active (0pts)
- Diet: high fat (5pts), mixed (3pts), healthy (0pts)
- Diabetes: yes (10pts), no (0pts)

**3. Baseline Vulnerability Risk (0-25 points)**
- Age: > 55 (10pts), 40-55 (5pts), < 40 (0pts)
- BMI: obese (10pts), overweight (5pts), normal (0pts)
- Family history: yes (5pts), no (0pts)

## API Endpoints

### Base URL
`http://127.0.0.1:8000`

### Health Check Endpoints

#### GET `/`
Server status check.

#### GET `/db-test`
Database connectivity test.

### Risk Calculation Endpoints

#### POST `/calculate-risk`
Calculate glucose risk score.

**Response:**
```json
{
    "risk_score": 42,
    "risk_level": "Moderate Risk",
    "breakdown": {
        "immediate_glycemic_risk": 15,
        "treatment_symptom_risk": 15,
        "baseline_vulnerability_risk": 12
    }
}
```

#### POST `/cardiac-risk`
Calculate cardiac risk score with detailed attribution.

**Response:**
```json
{
    "risk_score": 35,
    "risk_level": "Moderate Risk",
    "attribution": {
        "immediate": {
            "chest_pain": 10,
            "blood_pressure": 5
        },
        "lifestyle": {
            "smoking": 10,
            "activity": 5
        },
        "baseline": {
            "age": 5
        }
    },
    "percentage_breakdown": {
        "immediate_cardiac_percentage": 42.9,
        "lifestyle_percentage": 42.9,
        "baseline_percentage": 14.3
    }
}
```

#### POST `/metrics`
Alias for glucose risk calculation.

## Explainable AI System

### Risk Explanation Endpoints

#### POST `/explain`
Generate detailed explanation for glucose risk assessment.

**Request:**
```json
{
    "risk_level": "Moderate Risk",
    "risk_score": 42,
    "percentage_breakdown": {
        "immediate_glycemic_percentage": 35.7,
        "treatment_symptom_percentage": 35.7,
        "baseline_vulnerability_percentage": 28.6
    },
    "attribution": {
        "immediate_glycemic": {
            "glucose_value": 150,
            "glucose_context": "fasting",
            "trend": "stable"
        },
        "treatment_symptoms": {
            "symptoms": "mild",
            "medication": "oral",
            "meal_type": "balanced"
        },
        "baseline": {
            "diabetes_status": "prediabetic",
            "age": 45,
            "bmi_category": "overweight",
            "family_history": true,
            "physical_activity": "sometimes"
        }
    }
}
```

**Response:**
```json
{
    "risk_level": "Moderate Risk",
    "summary": "Moderate Risk (Score: 42). Primary concern: blood glucose levels (35.7%). Needs monitoring.",
    "explanation": [
        "Your overall health risk is classified as **Moderate Risk**, with a total risk score of **42**.",
        "Blood sugar–related factors contribute approximately **35.7%** of your total risk.",
        "Your blood glucose reading was **150 mg/dL**, measured during **fasting** conditions.",
        "Your glucose levels appear relatively stable.",
        "Treatment and symptom-related factors account for **35.7%** of your risk.",
        "You reported mild symptoms that may need monitoring.",
        "Oral diabetes medication contributes moderately to risk.",
        "Baseline health factors contribute **28.6%** of your overall risk.",
        "You are classified as **prediabetic**, which affects long-term risk levels.",
        "Your body weight falls in the **overweight** category.",
        "Age is also a contributing factor at **45 years**.",
        "A family history of diabetes increases genetic risk.",
        "Lower physical activity levels can reduce insulin sensitivity.",
        "Regular monitoring, balanced meals, and consistent physical activity can help lower your overall risk."
    ]
}
```

#### POST `/explain-cardiac`
Generate detailed explanation for cardiac risk assessment.

### AI Explanation Features

#### Summary Generation
- Identifies primary risk factors
- Provides urgency assessment
- Generates concise risk overview

#### Detailed Explanations
- Breaks down each risk component
- Explains percentage contributions
- Provides context for risk factors
- Offers actionable recommendations

#### Safe Data Access
- Handles missing data gracefully
- Provides fallback values
- Prevents errors from incomplete data

## Installation & Setup

### Prerequisites
- Python 3.14+
- MySQL Server
- Virtual environment

### Setup Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd ai-health-assistant/backend
```

2. **Create Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

4. **Database Setup**
```sql
CREATE DATABASE ai_health_db;
```

5. **Configure Database**
Update `database.py` with your credentials:
```python
DATABASE_URL = "mysql+pymysql://username:password@localhost:3306/ai_health_db"
```

6. **Run Application**
```bash
python -m uvicorn main:app --reload
```

7. **Access Documentation**
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## Testing Examples

### Glucose Risk Assessment
```bash
curl -X POST "http://127.0.0.1:8000/calculate-risk" \
  -H "Content-Type: application/json" \
  -d '{
    "glucose_value": 150,
    "measurement_context": "fasting",
    "trend": "stable",
    "symptoms": "mild",
    "medication_type": "oral",
    "meal_type": "balanced",
    "diabetes_status": "prediabetic",
    "age": 45,
    "weight_kg": 75,
    "height_cm": 170,
    "family_history": true,
    "physical_activity": "sometimes"
  }'
```

### Cardiac Risk Assessment
```bash
curl -X POST "http://127.0.0.1:8000/cardiac-risk" \
  -H "Content-Type: application/json" \
  -d '{
    "chest_pain": "sometimes",
    "shortness_of_breath": "exertion",
    "heart_rate": 85,
    "blood_pressure": "high",
    "smoking": "former",
    "physical_activity": "sometimes",
    "diet": "mixed",
    "diabetes": false,
    "age": 50,
    "bmi_category": "overweight",
    "family_history": true
  }'
```

### Risk Explanation
```bash
curl -X POST "http://127.0.0.1:8000/explain" \
  -H "Content-Type: application/json" \
  -d '{
    "risk_level": "Moderate Risk",
    "risk_score": 42,
    "percentage_breakdown": {
      "immediate_glycemic_percentage": 35.7,
      "treatment_symptom_percentage": 35.7,
      "baseline_vulnerability_percentage": 28.6
    }
  }'
```

## Key Features

### Modular Architecture
- Separated route handlers in `api/` directory
- Dedicated modules for different risk types
- Centralized database and authentication utilities

### Comprehensive Risk Assessment
- Dual risk assessment systems (glucose + cardiac)
- Detailed attribution and percentage breakdowns
- Evidence-based scoring algorithms

### Explainable AI
- Natural language explanations
- Risk factor prioritization
- Actionable recommendations
- Safe data handling

### Robust Authentication
- Secure password hashing with salt
- JWT token management
- Debug endpoints for troubleshooting
- User management capabilities

### Database Integration
- SQLAlchemy ORM with MySQL
- Automatic table creation
- Connection testing endpoints
- Proper session management

## Security Considerations

### Current Implementation
- SHA-256 password hashing with salt
- JWT token authentication
- SQL injection protection via ORM
- Input validation with Pydantic models

### Recommended Improvements
- Environment variables for secrets
- Rate limiting implementation
- HTTPS in production
- Password complexity requirements
- Token refresh mechanism
- Request logging and monitoring

## Future Development

### Planned Features
- Frontend web application
- Historical risk tracking
- Personalized recommendations
- Integration with wearable devices
- Multi-language support
- Advanced ML models

### Technical Improvements
- Comprehensive testing suite
- Docker containerization
- CI/CD pipeline
- API versioning
- Performance monitoring
- Caching implementation

---

**Last Updated**: January 2026  
**Version**: 2.0  
**Status**: Active Development