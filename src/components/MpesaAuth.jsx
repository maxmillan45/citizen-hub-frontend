import React, { useState } from 'react';
import { initiateSTKPush, checkSTKStatus, authenticateWithMPesa } from '../services/api';
import { FiSmartphone, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';

function MpesaAuth({ onSuccess, onError }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [checkoutId, setCheckoutId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const formatPhoneNumber = (value) => {
    let cleaned = value.replace(/\D/g, '');
    
    // If starts with 0, keep it (user will enter 0705632334)
    if (cleaned.length <= 10) {
      return cleaned;
    }
    return cleaned.slice(0, 10);
  };

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number (e.g., 0705632334)');
      return;
    }
    
    setLoading(true);
    setStatus('initiating');
    
    try {
      // Format phone number to international format (254705632334)
      let formattedPhone = phoneNumber;
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
      }
      
      console.log('Initiating STK push for:', formattedPhone);
      
      const response = await initiateSTKPush(formattedPhone);
      console.log('STK Push response:', response.data);
      
      // Check for CheckoutRequestID in the response
      const checkoutRequestId = response.data?.CheckoutRequestID;
      
      if (checkoutRequestId) {
        setCheckoutId(checkoutRequestId);
        setStatus('pending');
        setAttempts(0);
        
        // Wait 3 seconds before starting to poll
        setTimeout(() => {
          startPolling(checkoutRequestId, formattedPhone);
        }, 3000);
      } else {
        setStatus('failed');
        if (onError) onError('Failed to initiate M-Pesa payment. Please try again.');
      }
    } catch (error) {
      console.error('STK Push error:', error);
      setStatus('failed');
      const errorMsg = error.response?.data?.error || error.message || 'Network error';
      if (onError) onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  const startPolling = (checkoutId, phone) => {
    let pollAttempts = 0;
    const maxAttempts = 30; // 30 attempts * 3 seconds = 90 seconds
    
    const interval = setInterval(async () => {
      pollAttempts++;
      setAttempts(pollAttempts);
      console.log(`Polling attempt ${pollAttempts} for ${checkoutId}`);
      
      try {
        const response = await checkSTKStatus(checkoutId);
        console.log('Status response:', response.data);
        
        const data = response.data;
        
        // Check if payment was successful
        if (data.ResultCode === '0') {
          clearInterval(interval);
          setPollingInterval(null);
          setStatus('authenticating');
          
          // Authenticate with M-Pesa
          try {
            const authResponse = await authenticateWithMPesa(checkoutId, phone);
            console.log('Auth response:', authResponse.data);
            
            if (authResponse.data.success) {
              setStatus('success');
              if (onSuccess) {
                onSuccess(authResponse.data);
              }
            } else {
              setStatus('failed');
              if (onError) onError(authResponse.data.message || 'Authentication failed');
            }
          } catch (authError) {
            console.error('Auth error:', authError);
            setStatus('failed');
            if (onError) onError('Authentication failed. Please try again.');
          }
        } 
        // User cancelled
        else if (data.ResultCode === '1037') {
          clearInterval(interval);
          setPollingInterval(null);
          setStatus('cancelled');
          if (onError) onError('Transaction cancelled by user');
        } 
        // Transaction failed
        else if (data.ResultCode === '1032') {
          clearInterval(interval);
          setPollingInterval(null);
          setStatus('failed');
          if (onError) onError('Transaction failed. Please try again.');
        }
        // Continue polling for pending (ResultCode !== 0)
        else if (pollAttempts >= maxAttempts) {
          clearInterval(interval);
          setPollingInterval(null);
          setStatus('timeout');
          if (onError) onError('Transaction timeout. Please try again.');
        }
      } catch (error) {
        console.error('Polling error:', error);
        if (pollAttempts >= maxAttempts) {
          clearInterval(interval);
          setPollingInterval(null);
          setStatus('timeout');
          if (onError) onError('Transaction timeout. Please try again.');
        }
      }
    }, 3000);
    
    setPollingInterval(interval);
  };
  
  const resetForm = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setCheckoutId(null);
    setStatus(null);
    setAttempts(0);
    setPhoneNumber('');
  };
  
  const getStatusMessage = () => {
    switch (status) {
      case 'initiating':
        return { text: 'Initiating M-Pesa payment...', icon: FiLoader, color: '#0066cc' };
      case 'pending':
        return { 
          text: 'M-Pesa popup sent to your phone. Enter your PIN now.', 
          icon: FiSmartphone, 
          color: '#ff9800',
          instruction: 'Check your phone for the M-Pesa popup and enter your PIN'
        };
      case 'authenticating':
        return { text: 'Payment confirmed. Authenticating...', icon: FiLoader, color: '#0066cc' };
      case 'success':
        return { text: 'Authentication successful! Redirecting...', icon: FiCheckCircle, color: '#4caf50' };
      case 'failed':
        return { text: 'Authentication failed. Please try again.', icon: FiAlertCircle, color: '#f44336' };
      case 'cancelled':
        return { text: 'Transaction cancelled by user.', icon: FiAlertCircle, color: '#f44336' };
      case 'timeout':
        return { text: 'Transaction timeout. Please try again.', icon: FiAlertCircle, color: '#f44336' };
      default:
        return null;
    }
  };
  
  const statusInfo = getStatusMessage();
  const StatusIcon = statusInfo?.icon;
  
  return (
    <div>
      {!checkoutId || status === 'failed' || status === 'cancelled' || status === 'timeout' ? (
        <form onSubmit={handleInitiatePayment}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
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
            <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
              Enter your M-Pesa registered phone number (e.g., 0705632334)
            </small>
          </div>
          
          {(status === 'failed' || status === 'cancelled' || status === 'timeout') && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {statusInfo?.text}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || !phoneNumber}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Processing...' : 'Pay KES 1 via M-Pesa'}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          {StatusIcon && <StatusIcon size={48} color={statusInfo?.color} />}
          <h3 style={{ marginTop: '16px', marginBottom: '8px' }}>{statusInfo?.text}</h3>
          {statusInfo?.instruction && (
            <p style={{ color: '#666', fontSize: '14px' }}>{statusInfo.instruction}</p>
          )}
          {status === 'pending' && (
            <>
              <div style={{ 
                marginTop: '16px', 
                padding: '12px', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '8px',
                textAlign: 'left'
              }}>
                <strong>Steps:</strong>
                <ol style={{ marginTop: '8px', paddingLeft: '20px', color: '#666' }}>
                  <li>Check your phone for M-Pesa popup</li>
                  <li>Enter your M-Pesa PIN</li>
                  <li>Wait for confirmation</li>
                </ol>
              </div>
              <p style={{ color: '#999', fontSize: '12px', marginTop: '16px' }}>
                Polling attempt {attempts}/30
              </p>
            </>
          )}
          {status === 'success' && (
            <button
              onClick={resetForm}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Continue
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default MpesaAuth;