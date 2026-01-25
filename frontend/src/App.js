import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import HealthProfileSetup from "./pages/HealthProfileSetup";
import Dashboard from "./pages/Dashboard";
import HealthMetrics from "./pages/HealthMetrics";
import AddMetric from "./pages/AddMetric";
import Assessments from "./pages/Assessments";
import Assistant from "./pages/Assistant";
import Settings from "./pages/Settings";
import ExercisesHome from "./pages/Exercises/ExercisesHome";
import ExerciseSession from "./pages/Exercises/ExerciseSession";
import ExerciseReady from "./pages/Exercises/ExerciseReady";
import ExerciseComplete from "./pages/Exercises/ExerciseComplete";
import EditWorkout from "./pages/Exercises/EditWorkout";

function App() {
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
      sleepQuality: 'Good',
      profileCompleted: true
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
      sleepQuality: 'Excellent',
      profileCompleted: true
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

  // Exercise state
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);

  const handleLogin = (loginData, navigate) => {
    // For demo login
    if (loginData.email === 'demo@vitacare.ai') {
      const demoUser = {
        fullName: 'Demo User',
        email: 'demo@vitacare.ai',
        age: '30',
        gender: 'Male',
        healthCondition: 'diabetes',
        activityLevel: 'medium',
        dietQuality: 'Average',
        smoking: 'No',
        sleepQuality: 'Good',
        profileCompleted: true
      };
      setUserProfile(demoUser);
      setTimeout(() => {
        generateAssessment(demoUser);
      }, 100);
      navigate('/dashboard');
      return;
    }

    // For real backend authentication - create basic profile
    const userProfile = {
      fullName: loginData.user?.name || 'User',
      email: loginData.email,
      age: '30',
      gender: 'Male', 
      healthCondition: 'none',
      activityLevel: 'medium',
      dietQuality: 'Average',
      smoking: 'No',
      sleepQuality: 'Good',
      profileCompleted: true
    };
    
    setUserProfile(userProfile);
    setTimeout(() => {
      generateAssessment(userProfile);
    }, 100);
    navigate('/dashboard');
  };

  const handleSignUp = (signupData, navigate) => {
    const newUser = {
      fullName: signupData.fullName,
      email: signupData.email,
      age: '',
      gender: '',
      healthCondition: '',
      activityLevel: '',
      dietQuality: '',
      smoking: '',
      sleepQuality: '',
      profileCompleted: false
    };
    
    setUserProfile(newUser);
    navigate('/profile');
  };

  const handleCompleteProfile = (profileData, navigate) => {
    const updatedProfile = {
      ...userProfile,
      ...profileData,
      profileCompleted: true
    };
    
    // Add to registered users array
    setRegisteredUsers(prev => [...prev, updatedProfile]);
    
    setUserProfile(updatedProfile);
    generateAssessment(updatedProfile);
    navigate('/dashboard');
  };

  const handleUpdateProfile = (updatedProfile) => {
    setUserProfile(prev => ({
      ...prev,
      ...updatedProfile
    }));
    // Regenerate assessment with updated profile
    generateAssessment({ ...userProfile, ...updatedProfile });
  };

  const handleAddMetric = (metric, navigate) => {
    // Add metric to state
    const updatedMetrics = [...healthMetrics, metric];
    setHealthMetrics(updatedMetrics);
    
    // Recalculate risk assessment with new metric
    generateAssessmentWithMetrics(userProfile, updatedMetrics);
    
    // Navigate to assessments page to show updated risk
    navigate('/assessments');
  };

  const generateAssessmentWithMetrics = (profile, metrics) => {
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
    if (metrics && metrics.length > 0) {
      // Blood Glucose analysis
      const recentGlucose = metrics.filter(m => m.type === 'Blood Glucose').slice(-1)[0];
      if (recentGlucose) {
        const glucoseValue = parseFloat(recentGlucose.value);
        if (glucoseValue > 140) {
          riskScore += 15;
          riskFactors.push('Elevated blood glucose levels detected');
        } else if (glucoseValue < 70) {
          riskScore += 10;
          riskFactors.push('Low blood glucose levels detected');
        }
      }
      
      // Blood Pressure analysis
      const recentBP = metrics.filter(m => m.type === 'Blood Pressure').slice(-1)[0];
      if (recentBP) {
        const bpValue = parseFloat(recentBP.value);
        if (bpValue > 130) {
          riskScore += 12;
          riskFactors.push('Elevated blood pressure detected');
        }
      }
      
      // BMI analysis
      const recentBMI = metrics.filter(m => m.type === 'BMI').slice(-1)[0];
      if (recentBMI) {
        const bmiValue = parseFloat(recentBMI.value);
        if (bmiValue > 30) {
          riskScore += 15;
          riskFactors.push('BMI indicates obesity risk');
        } else if (bmiValue < 18.5) {
          riskScore += 8;
          riskFactors.push('BMI indicates underweight risk');
        }
      }
      
      // Activity analysis
      const recentActivity = metrics.filter(m => m.type === 'Activity').slice(-3);
      if (recentActivity.length > 0) {
        const avgActivity = recentActivity.reduce((sum, m) => sum + parseFloat(m.value), 0) / recentActivity.length;
        if (avgActivity < 30) {
          riskScore += 10;
          riskFactors.push('Low recent physical activity levels');
        } else if (avgActivity > 60) {
          riskScore -= 8;
        }
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
    let goalReason = 'Adjusted based on your current health metrics';
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

  const generateAssessment = (profile) => {
    generateAssessmentWithMetrics(profile, healthMetrics);
  };

  const handleRunAssessment = () => {
    generateAssessment(userProfile);
  };

  const handleRunNewAssessment = () => {
    generateAssessment(userProfile);
  };

  const handleStartWorkout = (workoutData) => {
    setCurrentWorkout(workoutData);
  };

  const handleCompleteExercise = (exercise) => {
    setCompletedExercises(prev => [...prev, exercise]);
    // Add activity metric
    const activityMetric = {
      id: Date.now(),
      type: 'Activity',
      value: Math.round(exercise.duration / 60),
      unit: 'minutes',
      date: new Date().toLocaleDateString()
    };
    setHealthMetrics(prev => [...prev, activityMetric]);
    
    // Update current workout to next exercise if in full routine
    if (currentWorkout && currentWorkout.exercises) {
      const currentIndex = currentWorkout.exercises.findIndex(ex => ex.id === exercise.id);
      if (currentIndex < currentWorkout.exercises.length - 1) {
        const nextExercise = currentWorkout.exercises[currentIndex + 1];
        setCurrentWorkout(prev => ({
          ...prev,
          exercise: nextExercise
        }));
      }
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp onSignUp={handleSignUp} />} />
        <Route path="/profile" element={<HealthProfileSetup onCompleteProfile={handleCompleteProfile} />} />
        <Route path="/dashboard" element={
          <Dashboard 
            userProfile={userProfile}
            assessmentData={assessmentData}
            onRunAssessment={handleRunAssessment}
            healthMetrics={healthMetrics}
            assessmentHistory={assessmentHistory}
          />
        } />
        <Route path="/health-metrics" element={
          <HealthMetrics
            healthMetrics={healthMetrics}
            onAddMetric={handleAddMetric}
          />
        } />
        <Route path="/add-metric" element={
          <AddMetric
            onAddMetric={handleAddMetric}
          />
        } />
        <Route path="/exercises" element={
          <ExercisesHome
            onStartWorkout={handleStartWorkout}
            userProfile={userProfile}
          />
        } />
        <Route path="/exercise-ready" element={
          <ExerciseReady
            currentWorkout={currentWorkout}
          />
        } />
        <Route path="/exercise-session" element={
          <ExerciseSession
            currentWorkout={currentWorkout}
            userProfile={userProfile}
            onCompleteExercise={handleCompleteExercise}
          />
        } />
        <Route path="/exercise-complete" element={
          <ExerciseComplete
            completedExercises={completedExercises}
            currentWorkout={currentWorkout}
          />
        } />
        <Route path="/edit-workout" element={
          <EditWorkout
            userProfile={userProfile}
          />
        } />
        <Route path="/assessments" element={
          <Assessments
            assessmentData={assessmentData}
            assessmentHistory={assessmentHistory}
            onRunNewAssessment={handleRunNewAssessment}
          />
        } />
        <Route path="/assistant" element={
          <Assistant 
            userProfile={userProfile}
            assessmentData={assessmentData}
          />
        } />
        <Route path="/settings" element={
          <Settings 
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        } />
      </Routes>
    </Router>
  );
}

export default App;
