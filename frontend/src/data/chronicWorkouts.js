export const chronicWorkouts = {
  diabetes: {
    title: "🩺 Diabetes Care Yoga",
    description: "Gentle movements to support blood sugar balance",
    days: [
      {
        day: 1,
        title: "Morning Balance Flow",
        exercises: [
          { id: 1, name: "Deep Breathing", duration: 30, pose: "breathing" },
          { id: 2, name: "Gentle Neck Rolls", duration: 25, pose: "neck-roll" },
          { id: 3, name: "Shoulder Blade Squeeze", duration: 30, pose: "shoulder-squeeze" },
          { id: 4, name: "Seated Spinal Twist", duration: 35, pose: "spinal-twist" },
          { id: 5, name: "Ankle Circles", duration: 25, pose: "ankle-circles" },
          { id: 6, name: "Gentle Forward Fold", duration: 40, pose: "forward-fold" }
        ]
      }
    ]
  },
  cardiac: {
    title: "❤️ Heart Health Yoga",
    description: "Low-impact movements for cardiovascular wellness",
    days: [
      {
        day: 1,
        title: "Heart Opening Flow",
        exercises: [
          { id: 1, name: "Mindful Breathing", duration: 35, pose: "breathing" },
          { id: 2, name: "Gentle Arm Circles", duration: 30, pose: "arm-circles" },
          { id: 3, name: "Chest Opening Stretch", duration: 35, pose: "chest-opening" },
          { id: 4, name: "Seated Cat-Cow", duration: 30, pose: "cat-cow" },
          { id: 5, name: "Gentle Side Bend", duration: 25, pose: "side-bend" },
          { id: 6, name: "Relaxation Pose", duration: 40, pose: "relaxation" }
        ]
      }
    ]
  }
};

export const getGuidanceMessage = (condition, exerciseName) => {
  const messages = {
    diabetes: {
      "Deep Breathing": "Move slowly and breathe deeply - this supports blood sugar balance",
      "Gentle Neck Rolls": "Keep movements slow and controlled",
      "Shoulder Blade Squeeze": "This exercise helps improve circulation",
      "Seated Spinal Twist": "Gentle twisting aids digestion and glucose processing",
      "Ankle Circles": "Improve circulation in your lower extremities",
      "Gentle Forward Fold": "Maintain comfortable breathing throughout"
    },
    cardiac: {
      "Mindful Breathing": "Focus on deep, steady breaths for heart health",
      "Gentle Arm Circles": "Keep movements smooth and controlled",
      "Chest Opening Stretch": "This exercise supports healthy heart function",
      "Seated Cat-Cow": "Gentle spinal movement improves circulation",
      "Gentle Side Bend": "Move at your own comfortable pace",
      "Relaxation Pose": "Allow your heart rate to settle naturally"
    }
  };
  
  return messages[condition]?.[exerciseName] || "Move slowly and breathe deeply";
};