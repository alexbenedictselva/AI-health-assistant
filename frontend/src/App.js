import React from "react";
import RiskScoreCard from "./components/RiskScoreCard";
import ExplanationPanel from "./components/ExplanationPanel";
import GoalTracker from "./components/GoalTracker";
import CoachingMessage from "./components/CoachingMessage";
import mockAssessment from "./data/mockAssessment";

function App() {
  return (
    <div
      style={{
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
        padding: "24px",
        maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <RiskScoreCard
        riskScore={mockAssessment.riskScore}
        riskLevel={mockAssessment.riskLevel}
      />

      <ExplanationPanel factors={mockAssessment.mainFactors} />

      <GoalTracker
        oldGoal={mockAssessment.oldGoal}
        newGoal={mockAssessment.newGoal}
        reason={mockAssessment.goalReason}
      />

      <CoachingMessage
        message={mockAssessment.coachingMessage}
        tone={mockAssessment.tone}
      />
    </div>
  );
}

export default App;
