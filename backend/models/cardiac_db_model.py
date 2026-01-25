from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey
from datetime import datetime
from database import Base


class CardiacRiskRecord(Base):
    __tablename__ = "cardiac_risk_records"

    # Primary key
    record_id = Column(Integer, primary_key=True, index=True)

    # User reference
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # -------- Immediate cardiac symptoms --------
    chest_pain = Column(String(20))             # none / sometimes / severe
    shortness_of_breath = Column(String(20))    # none / exertion / rest
    heart_rate = Column(Integer)                # BPM
    blood_pressure = Column(String(20))         # normal / high / very_high

    # -------- Lifestyle factors --------
    smoking = Column(String(20))                # never / former / current
    physical_activity = Column(String(20))      # active / sometimes / never
    diet = Column(String(20))                   # healthy / mixed / high_fat
    diabetes = Column(Boolean)

    # -------- Baseline factors --------
    age = Column(Integer)
    bmi_category = Column(String(20))           # normal / overweight / obese
    family_history = Column(Boolean)

    # -------- Risk output --------
    risk_score = Column(Integer)
    risk_level = Column(String(20))             # Low / Moderate / High / Critical

    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow)