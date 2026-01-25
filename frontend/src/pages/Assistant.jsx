import React, { useState } from 'react';

const Assistant = ({ onNavigate, userProfile, assessmentData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: `Hello ${userProfile?.fullName || 'there'}! I'm your VitaCare AI assistant. I can help you understand your health risks, provide lifestyle guidance, and answer questions about your wellness journey. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const generateResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Risk-related responses
    if (message.includes('risk') || message.includes('score')) {
      if (assessmentData) {
        return `Your current risk score is ${assessmentData.riskScore} (${assessmentData.riskLevel} risk). The main factors contributing to this are: ${assessmentData.mainFactors.join(', ')}. ${assessmentData.riskLevel === 'high' ? 'Focus on gradual lifestyle improvements to reduce your risk.' : 'Keep up the good work maintaining your current health habits!'} Remember, this guidance is preventive and not a medical diagnosis.`;
      } else {
        return "I don't have your current risk assessment yet. Would you like to complete a health assessment first? This will help me provide more personalized guidance.";
      }
    }
    
    // Activity-related responses
    if (message.includes('activity') || message.includes('exercise') || message.includes('steps')) {
      const activityLevel = userProfile?.activityLevel || 'unknown';
      if (activityLevel === 'low') {
        return "I see you have a low activity level. Start with small changes like taking a 10-minute walk after meals or using stairs instead of elevators. Gradually increase your activity as you feel more comfortable. This guidance is preventive and not a medical diagnosis.";
      } else if (activityLevel === 'medium') {
        return "Your moderate activity level is great! Try to maintain consistency and consider adding variety to your routine. Mix cardio with strength training for optimal benefits.";
      } else if (activityLevel === 'high') {
        return "Excellent activity level! Make sure to balance intense workouts with adequate rest and recovery. Listen to your body and adjust as needed.";
      } else {
        return "I'd recommend starting with 150 minutes of moderate activity per week, as suggested by health guidelines. This could be as simple as brisk walking for 30 minutes, 5 days a week.";
      }
    }
    
    // Diet-related responses
    if (message.includes('diet') || message.includes('food') || message.includes('eat')) {
      const condition = userProfile?.healthCondition;
      if (condition === 'diabetes') {
        return "For diabetes management, focus on balanced meals with controlled portions. Include plenty of vegetables, lean proteins, and whole grains. Monitor your carbohydrate intake and consider the timing of your meals. This guidance is preventive and not a medical diagnosis.";
      } else if (condition === 'cardiac') {
        return "For heart health, emphasize fruits, vegetables, whole grains, and lean proteins. Limit sodium, saturated fats, and processed foods. The Mediterranean diet pattern is often beneficial for cardiovascular health. This guidance is preventive and not a medical diagnosis.";
      } else {
        return "A balanced diet with plenty of fruits, vegetables, whole grains, and lean proteins supports overall health. Stay hydrated and limit processed foods when possible.";
      }
    }
    
    // Sleep-related responses
    if (message.includes('sleep') || message.includes('tired')) {
      return "Good sleep is crucial for health. Aim for 7-9 hours per night with a consistent schedule. Create a relaxing bedtime routine, limit screen time before bed, and keep your bedroom cool and dark. Poor sleep can affect your risk factors.";
    }
    
    // Goal-related responses
    if (message.includes('goal') || message.includes('target')) {
      if (assessmentData) {
        return `Your current goal is: ${assessmentData.newGoal}. ${assessmentData.goalReason} Remember, small consistent steps are more sustainable than dramatic changes. Celebrate your progress along the way!`;
      } else {
        return "Once you complete your health assessment, I'll help you set personalized, achievable goals based on your current health status and lifestyle.";
      }
    }
    
    // General health responses
    if (message.includes('health') || message.includes('improve')) {
      return "Health improvement is a journey, not a destination. Focus on sustainable changes: regular physical activity, balanced nutrition, adequate sleep, stress management, and avoiding smoking. Small, consistent improvements compound over time. This guidance is preventive and not a medical diagnosis.";
    }
    
    // Default response
    return "I'm here to help with lifestyle guidance, risk factor explanations, and wellness tips. You can ask me about activity, diet, sleep, or your health goals. For specific medical concerns, please consult with your healthcare provider. This guidance is preventive and not a medical diagnosis.";
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };
    
    const assistantResponse = {
      id: messages.length + 2,
      type: 'assistant',
      text: generateResponse(inputText),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage, assistantResponse]);
    setInputText('');
  };

  const NavigationBar = () => (
    <div style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e0e0e0',
      padding: '0 24px',
      marginBottom: '0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#1E88E5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: 'white',
            marginRight: '12px'
          }}>
            ❤️
          </div>
          <span style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1E88E5'
          }}>
            VitaCare AI
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center'
        }}>
          {['Dashboard', 'Health Metrics', 'Assessments', 'Exercises', 'Assistant', 'Settings'].map((tab) => (
            <span
              key={tab}
              onClick={() => {
                if (tab === 'Dashboard') onNavigate('dashboard');
                else if (tab === 'Health Metrics') onNavigate('healthMetrics');
                else if (tab === 'Assessments') onNavigate('assessments');
                else if (tab === 'Exercises') onNavigate('exercises');
                else if (tab === 'Settings') onNavigate('settings');
              }}
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: tab === 'Assistant' ? '#1E88E5' : '#666',
                cursor: 'pointer',
                borderBottom: tab === 'Assistant' ? '2px solid #1E88E5' : 'none',
                paddingBottom: '4px'
              }}
            >
              {tab}
            </span>
          ))}
          <button
            onClick={() => onNavigate('login')}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#F5F7FA',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <NavigationBar />
      
      <div style={{
        flex: 1,
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          AI Health Assistant
        </h1>
        
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            maxHeight: '500px'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '16px'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  backgroundColor: message.type === 'user' ? '#1E88E5' : '#f0f0f0',
                  color: message.type === 'user' ? 'white' : '#333',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #e0e0e0',
            display: 'flex',
            gap: '12px'
          }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me about your health, goals, or lifestyle tips..."
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '20px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: '12px 20px',
                backgroundColor: '#1E88E5',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;