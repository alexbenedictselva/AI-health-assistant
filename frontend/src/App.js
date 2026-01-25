import React, { useState } from "react";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import HealthProfileSetup from "./pages/HealthProfileSetup";
import Dashboard from "./pages/Dashboard";
import HealthMetrics from "./pages/HealthMetrics";
import AddMetric from "./pages/AddMetric";
import Assessments from "./pages/Assessments";
import Assistant from "./pages/Assistant";
import Settings from "./pages/Settings";

function App() {
  // Navigation state - start with login for existing users
  const [currentPage, setCurrentPage] = useState('login');
  
  // User profile state
  const [userProfile, setUserProfile] = useState(null);
  
  // Simple user storage (in real app, this would be a database)
  const [registeredUsers, setRegisteredUsers] = useState([
    // Demo users for testing
    {
      fullName: 'John Smith',
      email: 'john@example.com',
      age: '32',
      gender: 'Male',
      healthCondition: 'diabetes',
      activityLevel: 'medium',
      dietQuality: 'Average',
      smoking: 'No',
      sleepQuality: 'Good'
    },
    {
      fullName: 'Sarah Johnson',
      email: 'sarah@example.com',
      age: '28',
      gender: 'Female',
      healthCondition: 'cardiac',
      activityLevel: 'high',
      dietQuality: 'Healthy',
      smoking: 'No',
      sleepQuality: 'Excellent'
    }
  ]);
  
  // Health metrics state
  const [healthMetrics, setHealthMetrics] = useState([
    { id: 1, type: 'Blood Glucose', value: '95', unit: 'mg/dL', date: '12/1/2024' },
    { id: 2, type: 'Blood Pressure', value: '118', unit: 'mmHg', date: '12/2/2024' },
    { id: 3, type: 'Activity', value: '45', unit: 'minutes', date: '12/2/2024' },
    { id: 4, type: 'Blood Glucose', value: '102', unit: 'mg/dL', date: '12/3/2024' },
    { id: 5, type: 'Blood Pressure', value: '122', unit: 'mmHg', date: '12/4/2024' },
    { id: 6, type: 'Activity', value: '60', unit: 'minutes', date: '12/4/2024' },
    { id: 7, type: 'Blood Glucose', value: '88', unit: 'mg/dL', date: '12/5/2024' },
    { id: 8, type: 'BMI', value: '23.5', unit: 'kg/m²', date: '12/5/2024' }
  ]);
  
  // Assessment data state
  const [assessmentData, setAssessmentData] = useState(null);
  
  // Assessment history state
  const [assessmentHistory, setAssessmentHistory] = useState([
    { riskScore: 65, riskLevel: 'medium', date: '11/15/2024' },
    { riskScore: 58, riskLevel: 'medium', date: '11/22/2024' },
    { riskScore: 52, riskLevel: 'medium', date: '11/29/2024' },
    { riskScore: 48, riskLevel: 'low', date: '12/6/2024' }
  ]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (loginData) => {
    // Find existing user by email
    const existingUser = registeredUsers.find(user => user.email === loginData.email);
    
    if (existingUser) {
      setUserProfile(existingUser);
      // Generate initial assessment for existing user
      setTimeout(() => {
        generateAssessment(existingUser);
      }, 100);
    } else {
      // For demo purposes, create a basic profile if user not found
      const demoProfile = {
        fullName: loginData.fullName || 'Demo User',
        email: loginData.email,
        age: '35',
        gender: 'Other',
        healthCondition: 'diabetes',
        activityLevel: 'medium',
        dietQuality: 'Average',
        smoking: 'No',
        sleepQuality: 'Good'
      };
      setUserProfile(demoProfile);
      setTimeout(() => {
        generateAssessment(demoProfile);
      }, 100);
    }
  };

  const handleSignUp = (signupData) => {
    const newUser = {
      fullName: signupData.fullName,
      email: signupData.email,
      age: '',
      gender: '',
      healthCondition: '',
      activityLevel: '',
      dietQuality: '',
      smoking: '',
      sleepQuality: ''
    };
    
    // Add to registered users
    setRegisteredUsers(prev => [...prev, newUser]);
    setUserProfile(newUser);
  };

  const handleCompleteProfile = (profileData) => {
    const updatedProfile = {
      ...userProfile,
      ...profileData
    };
    
    // Update in registered users array
    setRegisteredUsers(prev => 
      prev.map(user => 
        user.email === userProfile.email ? updatedProfile : user
      )
    );
    
    setUserProfile(updatedProfile);
    // Generate initial assessment based on profile
    generateAssessment(updatedProfile);
  };

  const handleUpdateProfile = (updatedProfile) => {
    setUserProfile(prev => ({
      ...prev,
      ...updatedProfile
    }));
    // Regenerate assessment with updated profile
    generateAssessment({ ...userProfile, ...updatedProfile });
  };

  const handleAddMetric = (metric) => {
    setHealthMetrics(prev => [...prev, metric]);
  };

  const generateAssessment = (profile) => {
    if (!profile) return;
    
    let riskScore = 50; // Base score
    let riskFactors = [];
    
    // Adjust risk based on health condition
    if (profile.healthCondition === 'diabetes') {
      riskScore += 15;
      riskFactors.push('Diabetes management required');
    } else if (profile.healthCondition === 'cardiac') {
      riskScore += 20;
      riskFactors.push('Cardiovascular risk factors present');
    }
    
    // Adjust risk based on activity level
    if (profile.activityLevel === 'low') {
      riskScore += 15;
      riskFactors.push('Low physical activity levels');
    } else if (profile.activityLevel === 'high') {
      riskScore -= 10;
    }
    
    // Adjust risk based on diet quality
    if (profile.dietQuality === 'Poor') {
      riskScore += 10;
      riskFactors.push('Poor dietary habits');
    } else if (profile.dietQuality === 'Healthy') {
      riskScore -= 5;
    }
    
    // Adjust risk based on smoking
    if (profile.smoking === 'Yes') {
      riskScore += 20;
      riskFactors.push('Smoking habit increases health risks');
    }
    
    // Adjust risk based on recent health metrics
    if (healthMetrics.length > 0) {
      const recentGlucose = healthMetrics.filter(m => m.type === 'Blood Glucose').slice(-1)[0];
      if (recentGlucose && parseFloat(recentGlucose.value) > 140) {
        riskScore += 10;
        riskFactors.push('Elevated blood glucose levels');
      }
    }
    
    // Ensure score is within bounds
    riskScore = Math.max(10, Math.min(100, riskScore));
    
    // Determine risk level
    let riskLevel = 'low';
    if (riskScore >= 70) riskLevel = 'high';
    else if (riskScore >= 50) riskLevel = 'medium';
    
    // Generate goals and coaching message
    let oldGoal = '10,000 steps/day';
    let newGoal = '7,000 steps/day';
    let goalReason = 'Adjusted based on your current activity level';
    let coachingMessage = 'Focus on small, sustainable changes to improve your health.';
    
    if (profile.activityLevel === 'low') {
      newGoal = '5,000 steps/day';
      coachingMessage = 'Start with small steps. Even a 10-minute walk can make a difference!';
    } else if (profile.activityLevel === 'high') {
      newGoal = '12,000 steps/day';
      coachingMessage = 'Great activity level! Keep up the excellent work and stay consistent.';
    }
    
    if (riskFactors.length === 0) {
      riskFactors = ['Overall health indicators are within normal ranges'];
    }
    
    const newAssessment = {
      riskScore,
      riskLevel,
      mainFactors: riskFactors,
      oldGoal,
      newGoal,
      goalReason,
      coachingMessage,
      tone: 'supportive',
      date: new Date().toLocaleDateString()
    };
    
    setAssessmentData(newAssessment);
    
    // Add to assessment history
    setAssessmentHistory(prev => [...prev, newAssessment]);
  };

  const handleRunAssessment = () => {
    generateAssessment(userProfile);
  };

  const handleRunNewAssessment = () => {
    generateAssessment(userProfile);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'signup':
        return <SignUp onNavigate={handleNavigate} onSignUp={handleSignUp} />;
      case 'profile':
        return <HealthProfileSetup onNavigate={handleNavigate} onCompleteProfile={handleCompleteProfile} />;
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={handleNavigate} 
            userProfile={userProfile}
            assessmentData={assessmentData}
            onRunAssessment={handleRunAssessment}
            healthMetrics={healthMetrics}
            assessmentHistory={assessmentHistory}
          />
        );
      case 'healthMetrics':
        return (
          <HealthMetrics
            onNavigate={handleNavigate}
            healthMetrics={healthMetrics}
            onAddMetric={handleAddMetric}
          />
        );
      case 'addMetric':
        return (
          <AddMetric
            onNavigate={handleNavigate}
            onAddMetric={handleAddMetric}
          />
        );
      case 'assessments':
        return (
          <Assessments
            onNavigate={handleNavigate}
            assessmentHistory={assessmentHistory}
            onRunNewAssessment={handleRunNewAssessment}
          />
        );
      case 'assistant':
        return (
          <Assistant 
            onNavigate={handleNavigate}
            userProfile={userProfile}
            assessmentData={assessmentData}
          />
        );
      case 'settings':
        return (
          <Settings 
            onNavigate={handleNavigate}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      default:
        return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
    }
  };

  return renderPage();
}

export default App;
