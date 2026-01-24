import React from "react";

const toneStyles = {
  supportive: {
    bg: "#EFF6FF",
    text: "#1E40AF",
    emoji: "🤝",
  },
  celebratory: {
    bg: "#ECFDF5",
    text: "#065F46",
    emoji: "🎉",
  },
  caution: {
    bg: "#FFF7ED",
    text: "#9A3412",
    emoji: "⚠️",
  },
};

function CoachingMessage({ message, tone }) {
  const style = toneStyles[tone];

  return (
    <div
      style={{
        backgroundColor: style.bg,
        color: style.text,
        padding: "20px",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <span style={{ fontSize: "24px" }}>{style.emoji}</span>
      <p style={{ margin: 0, fontSize: "16px" }}>{message}</p>
    </div>
  );
}

export default CoachingMessage;
