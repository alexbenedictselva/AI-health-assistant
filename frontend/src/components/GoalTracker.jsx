import React from "react";

function GoalTracker({ oldGoal, newGoal, reason }) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "20px",
        borderRadius: "16px",
        marginBottom: "16px",
      }}
    >
      <h3 style={{ marginBottom: "12px", color: "#111827" }}>
        Goal Adjustment
      </h3>

      <div style={{ fontSize: "16px", marginBottom: "8px" }}>
        <span style={{ color: "#9CA3AF", textDecoration: "line-through" }}>
          {oldGoal}
        </span>
        <span style={{ margin: "0 8px", color: "#6B7280" }}>→</span>
        <span style={{ color: "#16A34A", fontWeight: "600" }}>
          {newGoal}
        </span>
      </div>

      <p style={{ fontSize: "14px", color: "#6B7280" }}>{reason}</p>
    </div>
  );
}

export default GoalTracker;
