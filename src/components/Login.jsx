import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, initiateSTKPush, authenticateWithMPesa, checkSTKStatus } from '../services/api';

function Login() {
  const [useMpesa, setUseMpesa] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [step, setStep] = useState('phone');
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();

  const formatPhoneNumber = (number) => {
    // Remove all non-digits
    let cleaned = number.replace(/\D/g, '');
    
    // If starts with 0, replace with 254
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }
    // If starts with 254, keep as is
    else if (cleaned.startsWith('254')) {
      // Already in correct format
    }
    // If starts with +254, remove the +
    else if (cleaned.startsWith('254')) {
      // Already correct
    }
    // If it's a 10-digit number starting with 07, format it
    else if (cleaned.length === 10 && cleaned.startsWith('07')) {
      cleaned = '254' + cleaned.substring(1);
    }
    
    return cleaned;
  };

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
    let errorMessage = 'M-Pesa authentication failed. Please try again.';
    
    if (typeof err === 'string') {
      errorMessage = err;
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
    setStep('phone');
    setTimeout(() => setError(null), 8000);
  };

  const handleSendSTK = async (e) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    const formattedNumber = formatPhoneNumber(phoneNumber);
    console.log('Formatted phone number:', formattedNumber);
    
    setLoading(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      // Step 1: Get token (creates user if doesn't exist)
      console.log('Step 1: Getting token for:', formattedNumber);
      const tokenResponse = await getToken(formattedNumber);
      console.log('Token response:', tokenResponse.data);
      
      if (!tokenResponse.data.access_token) {
        throw new Error('Failed to get access token');
      }
      
      localStorage.setItem('access_token', tokenResponse.data.access_token);
      setDebugInfo({ step: 'token_received', data: tokenResponse.data });
      
      // Step 2: Initiate STK push
      console.log('Step 2: Initiating STK push for:', formattedNumber);
      const stkResponse = await initiateSTKPush(formattedNumber);
      console.log('STK response:', stkResponse.data);
      
      if (!stkResponse.data.CheckoutRequestID) {
        throw new Error('Failed to get CheckoutRequestID');
      }
      
      setCheckoutRequestId(stkResponse.data.CheckoutRequestID);
      setStep('stk');
      setLoading(false);
      setDebugInfo({ step: 'stk_sent', checkoutId: stkResponse.data.CheckoutRequestID });
      
      // Start polling for status
      pollSTKStatus(stkResponse.data.CheckoutRequestID, formattedNumber);
      
    } catch (err) {
      console.error('Error in handleSendSTK:', err);
      setError(err.response?.data?.error || err.message || 'Failed to initiate M-Pesa. Please try again.');
      setLoading(false);
      setTimeout(() => setError(null), 5000);
    }
  };

  const pollSTKStatus = async (checkoutId, phone) => {
    let attempts = 0;
    const maxAttempts = 40; // 40 attempts * 3 seconds = 120 seconds
    
    const interval = setInterval(async () => {
      attempts++;
      console.log(`Polling attempt ${attempts} for:`, checkoutId);
      
      try {
        const response = await checkSTKStatus(checkoutId);
        const data = response.data;
        console.log('Status response:', data);
        
        if (data.ResultCode === '0') {
          clearInterval(interval);
          console.log('Payment successful! Authenticating...');
          // Step 3: Authenticate with M-Pesa
          const authResponse = await authenticateWithMPesa(checkoutId, phone);
          console.log('Auth response:', authResponse.data);
          handleMpesaSuccess(authResponse.data);
        } else if (data.ResultCode === '1037') {
          clearInterval(interval);
          handleMpesaError('Transaction cancelled by user');
        } else if (data.ResultCode === '1032') {
          clearInterval(interval);
          handleMpesaError('Transaction failed. Please try again.');
        }
      } catch (err) {
        console.error('Polling error:', err);
        // Continue polling if still pending
        if (err.response?.data?.ResultCode === '1' || err.response?.status === 404) {
          // Still pending or not found, continue polling
        } else {
          clearInterval(interval);
          handleMpesaError('Payment verification failed. Please try again.');
        }
      }
      
      // Stop polling after max attempts
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        if (step === 'stk') {
          handleMpesaError('Payment timed out. Please try again.');
        }
      }
    }, 3000);
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
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        navigate('/chatbot');
      }
    } catch (err) {
      console.error('Test login error:', err);
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
        
        {debugInfo && (
          <div style={{
            backgroundColor: '#e3f2fd',
            color: '#0d47a1',
            padding: '8px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '11px',
            textAlign: 'left',
            overflow: 'auto',
            maxHeight: '80px'
          }}>
            <strong>Debug:</strong> {JSON.stringify(debugInfo, null, 2)}
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
                <p style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                  Enter phone number (e.g., 0705632334 or 254705632334)
                </p>
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