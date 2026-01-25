# models/user.py

from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    DateTime
)
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    # ---------- PRIMARY IDENTIFIERS ----------
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    # ---------- SYSTEM METADATA ----------
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # ---------- RELATIONSHIPS ----------
    risk_calculations = relationship("RiskCalculation", back_populates="user")