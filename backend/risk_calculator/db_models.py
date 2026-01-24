from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    DateTime
)
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    # ---------- PRIMARY IDENTIFIERS ----------
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)

    # ---------- DEMOGRAPHIC DATA ----------
    age = Column(Integer, nullable=False)
    bmi_category = Column(String(50), nullable=False)
    family_history = Column(Boolean, default=False)
    physical_activity = Column(String(50), nullable=False)

    # ---------- DIABETES CONTEXT ----------
    diabetes_status = Column(String(50), nullable=False)
    medication_type = Column(String(50), nullable=False)

    # ---------- GLUCOSE TRACKING ----------
    last_glucose_value = Column(Float, default=0.0)
    last_glucose_checked_at = Column(DateTime, nullable=True)

    # ---------- SYSTEM METADATA ----------
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
