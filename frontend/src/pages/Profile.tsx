import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authAPI, metricsAPI } from '../services/api';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [profileData, setProfileData] = useState({
    age: 0,
    weight: 0,
    height: 0,
    diabetesStatus: 'Unknown',
    physicalActivity: 'Unknown',
    familyHistory: false,
    totalAssessments: 0,
    lastAssessment: null as string | null
  });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone_number: ''
  });

  useEffect(() => {
    setEditData({
      name: user?.name || '',
      email: user?.email || '',
      phone_number: user?.phone_number || ''
    });
  }, [user]);

  useEffect(() => {
    fetchMe();
    fetchProfileData();
  }, []);

  const fetchMe = async () => {
    try {
      const response = await authAPI.getMe();
      updateUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await metricsAPI.getUserMetrics(user?.id);
      const metrics = response.data || [];
      
      if (metrics.length > 0) {
        const latest = metrics[0];
        setProfileData({
          age: latest.age || 0,
          weight: latest.weight_kg || 0,
          height: latest.height_cm || 0,
          diabetesStatus: latest.diabetes_status || 'Unknown',
          physicalActivity: latest.physical_activity || 'Unknown',
          familyHistory: latest.family_history || false,
          totalAssessments: metrics.length,
          lastAssessment: latest.created_at
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateBMI = () => {
    if (profileData.weight && profileData.height) {
      const bmi = profileData.weight / Math.pow(profileData.height / 100, 2);
      return bmi.toFixed(1);
    }
    return 'N/A';
  };

  const onEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidPhone = (value: string) => /^\+?[0-9]{8,15}$/.test(value.replace(/\s+/g, ''));

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nextName = editData.name.trim();
    const nextEmail = editData.email.trim();
    const nextPhone = editData.phone_number.trim().replace(/\s+/g, '');

    if (!nextName) {
      setMessage('Name is required.');
      return;
    }
    if (!isValidEmail(nextEmail)) {
      setMessage('Please enter a valid email address.');
      return;
    }
    if (!isValidPhone(nextPhone)) {
      setMessage('Please enter a valid phone number (8-15 digits).');
      return;
    }

    if (
      nextName === (user?.name || '').trim() &&
      nextEmail === (user?.email || '').trim() &&
      nextPhone === (user?.phone_number || '').trim()
    ) {
      setMessage('No changes to update.');
      setEditing(false);
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const response = await authAPI.updateMe({
        name: nextName,
        email: nextEmail,
        phone_number: nextPhone
      });
      updateUser(response.data);
      setEditing(false);
      setMessage('Profile updated successfully.');
      await fetchMe();
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">My Profile</h1>

      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Personal Information</span>
          {!editing ? (
            <button className="btn btn-secondary" onClick={() => { setMessage(''); setEditing(true); }}>
              Edit
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={() => { setEditing(false); setMessage(''); }}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
        {message && (
          <div style={{
            marginBottom: '1rem',
            color: message.toLowerCase().includes('success') ? '#166534' : '#991B1B',
            background: message.toLowerCase().includes('success') ? '#DCFCE7' : '#FEE2E2',
            border: `1px solid ${message.toLowerCase().includes('success') ? '#86EFAC' : '#FECACA'}`,
            padding: '0.75rem',
            borderRadius: '0.5rem'
          }}>
            {message}
          </div>
        )}
        <form onSubmit={handleSaveProfile}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div className="profile-field">
            <label>Name</label>
            {editing ? (
              <input className="form-input" name="name" value={editData.name} onChange={onEditChange} maxLength={100} />
            ) : (
              <div className="profile-value">{user?.name || 'N/A'}</div>
            )}
          </div>
          <div className="profile-field">
            <label>Email</label>
            {editing ? (
              <input className="form-input" name="email" type="email" value={editData.email} onChange={onEditChange} maxLength={150} />
            ) : (
              <div className="profile-value">{user?.email || 'N/A'}</div>
            )}
          </div>
          <div className="profile-field">
            <label>Phone Number</label>
            {editing ? (
              <input className="form-input" name="phone_number" value={editData.phone_number} onChange={onEditChange} maxLength={20} />
            ) : (
              <div className="profile-value">{user?.phone_number || 'N/A'}</div>
            )}
          </div>
          <div className="profile-field">
            <label>Age</label>
            <div className="profile-value">{profileData.age || 'N/A'} years</div>
          </div>
        </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">Health Metrics</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div className="profile-field">
            <label>Weight</label>
            <div className="profile-value">{profileData.weight || 'N/A'} kg</div>
          </div>
          <div className="profile-field">
            <label>Height</label>
            <div className="profile-value">{profileData.height || 'N/A'} cm</div>
          </div>
          <div className="profile-field">
            <label>BMI</label>
            <div className="profile-value">{calculateBMI()}</div>
          </div>
          <div className="profile-field">
            <label>Diabetes Status</label>
            <div className="profile-value">{profileData.diabetesStatus}</div>
          </div>
          <div className="profile-field">
            <label>Physical Activity</label>
            <div className="profile-value">{profileData.physicalActivity}</div>
          </div>
          <div className="profile-field">
            <label>Family History</label>
            <div className="profile-value">{profileData.familyHistory ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Assessment History</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div className="profile-field">
            <label>Total Assessments</label>
            <div className="profile-value">{profileData.totalAssessments}</div>
          </div>
          <div className="profile-field">
            <label>Last Assessment</label>
            <div className="profile-value">{formatDate(profileData.lastAssessment)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
