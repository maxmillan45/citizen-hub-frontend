import React, { useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiSearch } from 'react-icons/fi';
import { getProfile } from '../services/api';

function Voting() {
  const [idNumber, setIdNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // This is a mock response - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResult({
        status: 'registered',
        pollingStation: 'KICC Primary School, Nairobi',
        constituency: 'Nairobi Central',
        county: 'Nairobi',
        electionDate: 'August 9, 2027'
      });
    } catch (err) {
      setError('Unable to verify voting status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <h1 className="heading-1">Voting Verification</h1>
      <p className="text-muted" style={{ marginBottom: '32px' }}>Check your voter registration status and polling station</p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="card">
          <h2 className="heading-3">Check Your Status</h2>
          <form onSubmit={handleCheckStatus} style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                ID Number / Passport Number
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your ID number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                required
              />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%' }}>
              {isLoading ? 'Checking...' : <><FiSearch size={16} /> Check Status</>}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="heading-3">Voting Information</h2>
          <div style={{ marginTop: '20px' }}>
            <div style={{ marginBottom: '16px' }}>
              <strong>Next General Election:</strong>
              <p>August 9, 2027</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong>Voting Requirements:</strong>
              <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>Valid National ID card</li>
                <li>Registered voter card (optional)</li>
                <li>Be present at your assigned polling station</li>
              </ul>
            </div>
            <div>
              <strong>How to Vote:</strong>
              <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
                <li>Present your ID to polling officials</li>
                <li>Receive ballot papers</li>
                <li>Mark your choice in private</li>
                <li>Fold and deposit in ballot box</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="card" style={{ marginTop: '32px', backgroundColor: '#E8F5E9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <FiCheckCircle size={24} color="var(--kenya-green)" />
            <h3 style={{ margin: 0 }}>Voter Status Verified</h3>
          </div>
          <div className="grid grid-2">
            <div>
              <strong>Status:</strong> <span style={{ color: 'var(--kenya-green)' }}>Registered</span>
            </div>
            <div>
              <strong>Polling Station:</strong> {result.pollingStation}
            </div>
            <div>
              <strong>Constituency:</strong> {result.constituency}
            </div>
            <div>
              <strong>County:</strong> {result.county}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Voting;
