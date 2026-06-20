import React, { useState, useEffect } from 'react';
import { getMPs } from '../services/api';

function MPScorecard() {
  const [mps, setMPs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMPs = async () => {
      try {
        const response = await getMPs();
        setMPs(response.data);
      } catch (err) {
        console.error('Failed to load MPs:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMPs();
  }, []);

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: '48px' }}>
      <h1>Parliament Scorecard</h1>
      <p>Track your MP's performance</p>
      <div className="grid grid-3">
        {mps.map(mp => (
          <div key={mp.id} className="card">
            <h3>{mp.name}</h3>
            <p>Constituency: {mp.constituency}</p>
            <p>Party: {mp.party}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MPScorecard;
