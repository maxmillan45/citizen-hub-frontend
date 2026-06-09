import React, { useState } from 'react';

function Voting() {
  const [idNumber, setIdNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setResult({
        status: 'registered',
        pollingStation: 'KICC Primary School, Nairobi',
        constituency: 'Nairobi Central'
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <h1 className="heading-1">Voting Verification</h1>
      <p className="text-muted" style={{ marginBottom: '32px' }}>Check your voter registration status</p>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div className="card">
          <h2>Check Your Status</h2>
          <form onSubmit={handleCheck}>
            <div style={{ marginBottom: '20px' }}>
              <label>ID Number / Passport Number</label>
              <input type="text" className="input-field" placeholder="Enter your ID number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Checking...' : 'Check Status'}</button>
          </form>
        </div>

        <div className="card">
          <h2>Voting Information</h2>
          <p><strong>Next General Election:</strong> August 9, 2027</p>
          <p><strong>Requirements:</strong> Valid National ID card</p>
        </div>
      </div>

      {result && (
        <div className="card" style={{ marginTop: '32px', backgroundColor: '#E8F5E9' }}>
          <h3>Voter Status Verified</h3>
          <p><strong>Status:</strong> Registered</p>
          <p><strong>Polling Station:</strong> {result.pollingStation}</p>
          <p><strong>Constituency:</strong> {result.constituency}</p>
        </div>
      )}
    </div>
  );
}

export default Voting;
