from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class RiskCalculation(Base):
    __tablename__ = "risk_calculations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    calculation_type = Column(String(50), nullable=False)  # "diabetes" or "cardiac"
    
    # Input data (JSON)
    input_data = Column(JSON, nullable=False)
    
    # Results
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String(50), nullable=False)
    
    # Detailed results (JSON)
    breakdown = Column(JSON, nullable=True)
    percentage_breakdown = Column(JSON, nullable=True)
    attribution = Column(JSON, nullable=True)
    derived_metrics = Column(JSON, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="risk_calculations")