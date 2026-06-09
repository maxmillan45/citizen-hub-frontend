import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MpesaAuth from './MpesaAuth';
import { testAuth } from '../services/api';

function Login() {
  const [useMpesa, setUseMpesa] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleMpesaSuccess = (data) => {
    console.log('M-Pesa success:', data);
    if (data.access) {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Trigger storage event so homepage updates
      window.dispatchEvent(new Event('storage'));
      
      // Redirect to homepage instead of chatbot
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  const handleMpesaError = (err) => {
    console.error('M-Pesa error:', err);
    setError(err);
    setTimeout(() => setError(null), 5000);
  };

  const handleTestAuth = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await testAuth(phoneNumber);
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Trigger storage event so homepage updates
        window.dispatchEvent(new Event('storage'));
        
        // Redirect to homepage instead of chatbot
        navigate('/');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      setTimeout(() => setError(null), 5000);
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
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>🇰🇪</div>
          <h1 style={{ marginBottom: '8px', color: '#1A1A1A' }}>Citizen Hub</h1>
          <p style={{ color: '#666' }}>Sign in to access legal assistance</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
          <button
            onClick={() => { setUseMpesa(true); setError(null); }}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: useMpesa ? '#006B3F' : 'transparent',
              color: useMpesa ? 'white' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            M-Pesa (KES 1)
          </button>
          <button
            onClick={() => { setUseMpesa(false); setError(null); }}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: !useMpesa ? '#006B3F' : 'transparent',
              color: !useMpesa ? 'white' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Test Login (Free)
          </button>
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
        
        {useMpesa ? (
          <MpesaAuth onSuccess={handleMpesaSuccess} onError={handleMpesaError} />
        ) : (
          <form onSubmit={handleTestAuth}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="0705632334"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !phoneNumber}
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
              {loading ? 'Logging in...' : 'Test Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
