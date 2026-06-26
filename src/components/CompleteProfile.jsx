import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeProfile } from '../services/api';
import { FiUser, FiMail, FiGlobe, FiSave, FiCheckCircle } from 'react-icons/fi';

function CompleteProfile() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await completeProfile(formData);
      console.log('Profile completed:', response.data);
      setSuccess(true);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error completing profile:', err);
      setError(err.response?.data?.error || 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #006B3F 0%, #004D2E 100%)' 
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '16px', 
        width: '100%', 
        maxWidth: '450px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>👤</div>
          <h1 style={{ marginBottom: '8px', color: '#1A1A1A' }}>Complete Your Profile</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Tell us a bit about yourself to get started
          </p>
        </div>

        {success ? (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#E8F5E9',
            borderRadius: '12px',
            border: '1px solid #C8E6C9'
          }}>
            <FiCheckCircle size={48} color="#006B3F" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: '#006B3F', marginBottom: '8px' }}>Profile Completed!</h3>
            <p style={{ color: '#2E7D32' }}>Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 36px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 36px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
                Preferred Language
              </label>
              <div style={{ position: 'relative' }}>
                <FiGlobe style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 36px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px',
                    appearance: 'none',
                    background: 'white'
                  }}
                >
                  <option value="en">English</option>
                  <option value="sw">Kiswahili</option>
                </select>
              </div>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.full_name}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#006B3F',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1
              }}
            >
              <FiSave size={18} />
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default CompleteProfile;