import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, initiateSTKPush, authenticateWithMPesa, checkSTKStatus } from '../services/api';

function Login() {
  const [useMpesa, setUseMpesa] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [step, setStep] = useState('phone'); // 'phone', 'stk', 'complete'
  const navigate = useNavigate();

  const handleMpesaSuccess = (data) => {
    console.log('M-Pesa success:', data);
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      if (data.is_new_user) {
        navigate('/complete-profile');
      } else {
        navigate('/chatbot');
      }
    }
  };

  const handleMpesaError = (err) => {
    console.error('M-Pesa error:', err);
    setError(typeof err === 'string' ? err : 'M-Pesa authentication failed. Please try again.');
    setStep('phone');
    setTimeout(() => setError(null), 5000);
  };

  const handleSendSTK = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    setLoading(true);
    setError(null);
    try {
      // Step 1: Get token (creates user if doesn't exist)
      const tokenResponse = await getToken(phoneNumber);
      localStorage.setItem('access_token', tokenResponse.data.access_token);
      
      // Step 2: Initiate STK push
      const stkResponse = await initiateSTKPush(phoneNumber);
      setCheckoutRequestId(stkResponse.data.CheckoutRequestID);
      setStep('stk');
      setLoading(false);
      
      // Start polling for status
      pollSTKStatus(stkResponse.data.CheckoutRequestID);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initiate M-Pesa. Please try again.');
      setLoading(false);
      setTimeout(() => setError(null), 5000);
    }
  };

  const pollSTKStatus = async (checkoutId) => {
    const interval = setInterval(async () => {
      try {
        const response = await checkSTKStatus(checkoutId);
        const data = response.data;
        
        if (data.ResultCode === '0') {
          clearInterval(interval);
          // Step 3: Authenticate with M-Pesa
          const authResponse = await authenticateWithMPesa(checkoutId, phoneNumber);
          handleMpesaSuccess(authResponse.data);
        } else if (data.ResultCode === '1037') {
          clearInterval(interval);
          handleMpesaError('Transaction cancelled by user');
        } else if (data.ResultCode === '1032') {
          clearInterval(interval);
          handleMpesaError('Transaction failed. Please try again.');
        }
      } catch (err) {
        // Continue polling if still pending
        if (err.response?.data?.ResultCode === '1') {
          clearInterval(interval);
          handleMpesaError('Payment verification failed. Please try again.');
        }
      }
    }, 3000); // Check every 3 seconds
    
    // Stop polling after 120 seconds
    setTimeout(() => {
      clearInterval(interval);
      if (step === 'stk') {
        handleMpesaError('Payment timed out. Please try again.');
      }
    }, 120000);
  };

  const handleTestLogin = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await getToken(phoneNumber);
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        navigate('/chatbot');
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
          step === 'phone' ? (
            <form onSubmit={handleSendSTK}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  placeholder="254705632334"
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
                {loading ? 'Sending STK...' : 'Login with M-Pesa'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p>📱 Check your phone</p>
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
                <span>⏳</span>
                <span>Waiting for confirmation...</span>
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
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                placeholder="254705632334"
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