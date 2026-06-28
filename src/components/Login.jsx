// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, initiateSTKPush, waitForPayment } from '../services/api';
import { FiSmartphone, FiUser, FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [useMpesa, setUseMpesa] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('phone');
  const [waitingTime, setWaitingTime] = useState(0);

  const formatPhoneNumber = (number) => {
    let cleaned = number.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('254') && cleaned.length === 12) {
      // Already correct format
    } else if (cleaned.length === 10 && cleaned.startsWith('07')) {
      cleaned = '254' + cleaned.substring(1);
    }
    return cleaned;
  };

  const handleLoginSuccess = (data) => {
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    if (data.user_id) {
      localStorage.setItem('user_id', data.user_id);
    }
    if (data.phone_number) {
      localStorage.setItem('phone_number', data.phone_number);
    }
    
    const isNewUser = data.is_new_user === true;
    localStorage.setItem('is_new_user', isNewUser ? 'true' : 'false');
    
    if (onLogin) {
      onLogin(data);
    }
    
    if (isNewUser) {
      navigate('/complete-profile');
    } else {
      navigate('/');
    }
  };

  const handleSendSTK = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    const formattedNumber = formatPhoneNumber(phoneNumber);
    setLoading(true);
    setError(null);
    setStep('stk');
    setWaitingTime(0);
    
    const timer = setInterval(() => {
      setWaitingTime(prev => prev + 1);
    }, 1000);
    
    try {
      const tokenResponse = await getToken(formattedNumber);
      if (!tokenResponse.data.access_token) {
        throw new Error('Failed to get access token');
      }
      localStorage.setItem('access_token', tokenResponse.data.access_token);
      
      const stkResponse = await initiateSTKPush(formattedNumber);
      if (!stkResponse.data.CheckoutRequestID) {
        throw new Error('Failed to get CheckoutRequestID');
      }
      
      const waitResponse = await waitForPayment(
        stkResponse.data.CheckoutRequestID,
        formattedNumber
      );
      
      clearInterval(timer);
      
      if (waitResponse.data.success) {
        handleLoginSuccess(waitResponse.data);
      } else {
        setError(waitResponse.data.message || 'Payment failed');
        setStep('phone');
        setLoading(false);
      }
    } catch (err) {
      clearInterval(timer);
      console.error('Login error:', err);
      
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Payment is taking longer than expected. Please check your phone and try again.');
      } else {
        setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
      }
      setStep('phone');
      setLoading(false);
    }
  };

  const handleTestLogin = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    const formattedNumber = formatPhoneNumber(phoneNumber);
    setLoading(true);
    setError(null);
    
    try {
      const response = await getToken(formattedNumber);
      if (response.data.access_token) {
        handleLoginSuccess({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          user_id: response.data.user_id,
          phone_number: response.data.phone_number,
          is_new_user: response.data.is_new_user || false
        });
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
          <h1 style={{ marginBottom: '8px', color: '#1A1A1A' }}>Citizen Hub</h1>
          <p style={{ color: '#666' }}>Sign in to access legal assistance</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
          <button
            onClick={() => { setUseMpesa(true); setError(null); setStep('phone'); }}
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
            <FiSmartphone size={14} style={{ marginRight: '6px' }} />
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
            <FiCheckCircle size={14} style={{ marginRight: '6px' }} />
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
            <FiAlertCircle size={16} style={{ marginRight: '8px' }} />
            {error}
          </div>
        )}
        
        {useMpesa ? (
          step === 'phone' ? (
            <form onSubmit={handleSendSTK}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="0705632334 or 254705632334"
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
                disabled={loading || !phoneNumber || phoneNumber.length < 10}
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
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <FiSmartphone size={18} />
                {loading ? 'Sending STK...' : 'Login with M-Pesa'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>Check your phone</p>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Enter your M-Pesa PIN when prompted
              </p>
              <div style={{ 
                margin: '20px 0', 
                padding: '20px', 
                background: '#f5f5f5', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
              }}>
                <FiClock size={20} color="#006B3F" />
                <span>Waiting for confirmation...</span>
                <span style={{ fontSize: '12px', color: '#999' }}>
                  ({waitingTime}s)
                </span>
              </div>
              <button
                onClick={() => { setStep('phone'); setLoading(false); }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e0e0e0',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#333'
                }}
              >
                Cancel
              </button>
            </div>
          )
        ) : (
          <form onSubmit={handleTestLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="0705632334 or 254705632334"
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
              disabled={loading || !phoneNumber || phoneNumber.length < 10}
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