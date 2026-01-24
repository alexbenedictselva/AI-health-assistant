import React from "react";

function ExplanationPanel({ factors }) {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        padding: "20px",
        borderRadius: "16px",
        borderLeft: "4px solid #4F46E5",
        marginBottom: "16px",
      }}
    >
      <h3 style={{ marginBottom: "12px", color: "#111827" }}>
        Why is my risk high?
      </h3>

      <ul style={{ paddingLeft: "20px", color: "#374151" }}>
        {factors.map((factor, index) => (
          <li key={index} style={{ marginBottom: "8px" }}>
            {factor}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExplanationPanel;
