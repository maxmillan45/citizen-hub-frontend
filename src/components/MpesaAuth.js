import React, { useState } from 'react';
import { initiateSTKPush, checkSTKStatus } from '../services/api';
import { FiSmartphone, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';

function MpesaAuth({ onSuccess, onError }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [checkoutId, setCheckoutId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number (e.g., 0705632334)');
      return;
    }
    
    setLoading(true);
    setStatus('initiating');
    
    try {
      const response = await initiateSTKPush(phoneNumber);
      console.log('STK Push response:', response.data);
      
      if (response.data && response.data.checkout_request_id) {
        const checkoutId = response.data.checkout_request_id;
        setCheckoutId(checkoutId);
        setStatus('pending');
        setAttempts(0);
        
        // Wait 5 seconds before starting to poll (gives user time to enter PIN)
        setTimeout(() => {
          startPolling(checkoutId);
        }, 5000);
      } else {
        setStatus('failed');
        if (onError) onError('Failed to initiate M-Pesa payment');
      }
    } catch (error) {
      console.error('STK Push error:', error);
      setStatus('failed');
      if (onError) onError(error.response?.data?.error || 'Network error');
    } finally {
      setLoading(false);
    }
  };
  
  const startPolling = (checkoutId) => {
    let pollAttempts = 0;
    const maxAttempts = 30; // 30 attempts * 3 seconds = 90 seconds
    
    const interval = setInterval(async () => {
      pollAttempts++;
      setAttempts(pollAttempts);
      console.log(`Polling attempt ${pollAttempts} for ${checkoutId}`);
      
      try {
        const response = await checkSTKStatus(checkoutId);
        console.log('Status response:', response.data);
        
        if (response.data.status === 'success') {
          clearInterval(interval);
          setPollingInterval(null);
          setStatus('success');
          
          if (onSuccess) {
            onSuccess(response.data);
          }
        } else if (response.data.status === 'failed') {
          clearInterval(interval);
          setPollingInterval(null);
          setStatus('failed');
          if (onError) onError(response.data.message || 'Transaction failed');
        } else if (pollAttempts >= maxAttempts) {
          clearInterval(interval);
          setPollingInterval(null);
          setStatus('timeout');
          if (onError) onError('Transaction timeout. Please try again.');
        }
        // If status is 'pending', continue polling
      } catch (error) {
        console.error('Polling error:', error);
        if (pollAttempts >= maxAttempts) {
          clearInterval(interval);
          setPollingInterval(null);
          setStatus('timeout');
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
  
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned;
    }
    return cleaned.slice(0, 10);
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
      case 'success':
        return { text: 'Authentication successful! Redirecting...', icon: FiCheckCircle, color: '#4caf50' };
      case 'failed':
        return { text: 'Authentication failed. Please try again.', icon: FiAlertCircle, color: '#f44336' };
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
      {!checkoutId ? (
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
              Enter your M-Pesa registered phone number
            </small>
          </div>
          
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
          <StatusIcon size={48} color={statusInfo?.color} />
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
          {status === 'failed' || status === 'timeout' ? (
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
              Try Again
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default MpesaAuth;
