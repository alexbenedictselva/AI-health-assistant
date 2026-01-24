import React from "react";

const riskStyles = {
  low: {
    bg: "#ECFDF5",
    text: "#065F46",
    accent: "#22C55E",
    label: "LOW RISK",
    icon: "✅",
  },
  medium: {
    bg: "#FFFBEB",
    text: "#92400E",
    accent: "#F59E0B",
    label: "MEDIUM RISK",
    icon: "⚠️",
  },
  high: {
    bg: "#FEF2F2",
    text: "#991B1B",
    accent: "#EF4444",
    label: "HIGH RISK",
    icon: "🚨",
  },
};

function RiskScoreCard({ riskScore, riskLevel }) {
  const style = riskStyles[riskLevel];

  return (
    <div
      style={{
        backgroundColor: style.bg,
        color: style.text,
        padding: "24px",
        borderRadius: "16px",
        marginBottom: "16px",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: "600" }}>
        {style.icon} {style.label}
      </div>

      <div style={{ fontSize: "48px", fontWeight: "700", marginTop: "8px" }}>
        {riskScore}
      </div>

      <div style={{ fontSize: "14px", color: style.text }}>
        Overall Health Risk Score
      </div>
    </div>
  );
}

export default RiskScoreCard;
