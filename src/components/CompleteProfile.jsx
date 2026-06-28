// src/components/CompleteProfile.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiGlobe, FiSave, FiCheckCircle } from 'react-icons/fi';

function CompleteProfile() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
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

  const getFreshToken = async () => {
    try {
      const phone = localStorage.getItem('phone_number') || '254705632334';
      const response = await fetch('http://localhost:8000/api/get-token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone })
      });
      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        return data.access_token;
      }
      return null;
    } catch (err) {
      console.error('Failed to refresh token:', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let token = localStorage.getItem('access_token');
      
      if (!token) {
        token = await getFreshToken();
        if (!token) {
          setError('Please login again');
          setLoading(false);
          return;
        }
      }

      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        language: formData.language
      };

      let response = await fetch('http://localhost:8000/api/auth/complete-profile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      // If token expired, refresh and retry
      if (response.status === 401) {
        const newToken = await getFreshToken();
        if (newToken) {
          response = await fetch('http://localhost:8000/api/auth/complete-profile/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${newToken}`
            },
            body: JSON.stringify(payload)
          });
        }
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        localStorage.setItem('is_new_user', 'false');
        
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...userData,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          language: formData.language
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(data.error || data.message || 'Failed to save profile');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error. Make sure backend is running.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #006B3F 0%, #004D2E 100%)' 
      }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
          <FiCheckCircle size={48} color="#006B3F" />
          <h2 style={{ color: '#006B3F' }}>Profile Completed!</h2>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

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
          <div style={{ 
            width: '64px', 
            height: '64px', 
            backgroundColor: '#E8F5E9', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <FiUser size={32} color="#006B3F" />
          </div>
          <h1 style={{ marginBottom: '8px', color: '#1A1A1A' }}>Complete Your Profile</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Tell us a bit about yourself to get started
          </p>
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
              First Name *
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter your last name"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', fontSize: '14px' }}>
              Preferred Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'white'
              }}
            >
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.first_name}
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
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompleteProfile;