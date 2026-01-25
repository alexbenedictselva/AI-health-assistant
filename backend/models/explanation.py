from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Explanation(Base):
    __tablename__ = "explanations"
    
    id = Column(Integer, primary_key=True, index=True)
    risk_calculation_id = Column(Integer, ForeignKey("risk_calculations.id"), nullable=False)
    
    # Explanation content
    summary = Column(Text, nullable=False)
    detailed_explanation = Column(Text, nullable=False)
    explanation_type = Column(String(50), nullable=False)  # "diabetes" or "cardiac"
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    risk_calculation = relationship("RiskCalculation", back_populates="explanation")