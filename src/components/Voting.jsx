import React, { useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiSend, FiCalendar, FiMapPin, FiUser, FiCheck } from 'react-icons/fi';

function Voting() {
  const [idNumber, setIdNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmitVote = async (e) => {
    e.preventDefault();
    
    // Validate ID number - exactly 9 digits
    if (!/^\d{9}$/.test(idNumber)) {
      setError('ID number must be exactly 9 digits');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setResult(null);
    setSuccess(false);

    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResult({
        status: 'verified',
        constituency: 'Nairobi Central',
        county: 'Nairobi',
        pollingStation: 'KICC Primary School, Nairobi',
        voterName: 'John Doe'
      });
      
      setSuccess(true);
      setIdNumber('');
    } catch (err) {
      setError('Unable to submit your vote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 9) {
      setIdNumber(value);
    }
    setError('');
    setResult(null);
    setSuccess(false);
  };

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="heading-1" style={{ marginBottom: '8px' }}>Voting Verification</h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>
          Submit your vote and verify your voting status
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Submit I Voted Form */}
        <div className="card" style={{ padding: '28px' }}>
          <h2 className="heading-3" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiSend size={22} color="#006B3F" />
            Submit I Voted
          </h2>
          <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '20px' }}>
            Enter your ID number to confirm your participation in the election
          </p>
          
          <form onSubmit={handleSubmitVote}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                ID Number
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter 9-digit ID number"
                  value={idNumber}
                  onChange={handleIdChange}
                  maxLength="9"
                  style={{ 
                    padding: '12px 16px',
                    fontSize: '16px',
                    letterSpacing: '2px',
                    fontFamily: 'monospace'
                  }}
                  required
                />
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  color: idNumber.length === 9 ? '#006B3F' : '#adb5bd',
                  fontWeight: '500'
                }}>
                  {idNumber.length}/9
                </span>
              </div>
              {error && (
                <div style={{ 
                  color: '#BB0000', 
                  fontSize: '13px', 
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <FiAlertCircle size={14} />
                  {error}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading || idNumber.length !== 9}
              style={{ 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '14px',
                opacity: isLoading || idNumber.length !== 9 ? 0.7 : 1,
                cursor: isLoading || idNumber.length !== 9 ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? (
                'Submitting...'
              ) : (
                <>
                  <FiCheck size={18} />
                  Submit I Voted
                </>
              )}
            </button>
          </form>

          {success && result && (
            <div style={{ 
              marginTop: '20px',
              padding: '16px',
              backgroundColor: '#E8F5E9',
              borderRadius: '8px',
              border: '1px solid #C8E6C9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <FiCheckCircle size={20} color="#006B3F" />
                <strong style={{ color: '#006B3F' }}>Vote Submitted Successfully!</strong>
              </div>
              <p style={{ fontSize: '14px', color: '#2E7D32', margin: 0 }}>
                Your vote has been recorded. Thank you for participating in the election.
              </p>
            </div>
          )}
        </div>

        {/* Voting Information */}
        <div className="card" style={{ padding: '28px' }}>
          <h2 className="heading-3" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiCalendar size={22} color="#006B3F" />
            Voting Information
          </h2>
          
          <div style={{ marginTop: '20px' }}>
            <div style={{ 
              padding: '16px',
              backgroundColor: '#F8F9FA',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <FiCalendar size={16} color="#006B3F" />
                <strong>Next General Election</strong>
              </div>
              <p style={{ margin: 0, fontSize: '15px', color: '#1A1A1A' }}>August 9, 2027</p>
            </div>

            <div style={{ 
              padding: '16px',
              backgroundColor: '#F8F9FA',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <FiUser size={16} color="#006B3F" />
                <strong>Voting Requirements</strong>
              </div>
              <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '14px', color: '#495057' }}>
                <li>Valid National ID card</li>
                <li>Registered voter card (optional)</li>
                <li>Be present at your assigned polling station</li>
              </ul>
            </div>

            <div style={{ 
              padding: '16px',
              backgroundColor: '#F8F9FA',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <FiMapPin size={16} color="#006B3F" />
                <strong>How to Vote</strong>
              </div>
              <ol style={{ margin: '4px 0 0 0', paddingLeft: '20px', fontSize: '14px', color: '#495057' }}>
                <li>Present your ID to polling officials</li>
                <li>Receive ballot papers</li>
                <li>Mark your choice in private</li>
                <li>Fold and deposit in ballot box</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Result (if any) */}
      {result && !success && (
        <div className="card" style={{ 
          marginTop: '32px', 
          backgroundColor: '#E3F2FD',
          border: '1px solid #BBDEFB'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <FiCheckCircle size={24} color="#006B3F" />
            <h3 style={{ margin: 0 }}>Voter Status Verified</h3>
          </div>
          <div className="grid grid-2" style={{ gap: '12px' }}>
            <div>
              <strong>Status:</strong> 
              <span style={{ color: '#006B3F', marginLeft: '8px' }}>Verified</span>
            </div>
            <div>
              <strong>Name:</strong> {result.voterName}
            </div>
            <div>
              <strong>Constituency:</strong> {result.constituency}
            </div>
            <div>
              <strong>County:</strong> {result.county}
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <strong>Polling Station:</strong> {result.pollingStation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Voting;