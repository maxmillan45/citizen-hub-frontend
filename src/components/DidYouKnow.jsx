import React, { useState, useEffect } from 'react';
import { getHistoryFacts, getRandomFact } from '../services/api';
import { FiRefreshCw } from 'react-icons/fi';

function DidYouKnow() {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFact, setSelectedFact] = useState(null);

  useEffect(() => {
    const loadFacts = async () => {
      try {
        const response = await getHistoryFacts();
        setFacts(response.data);
        if (response.data.length > 0) setSelectedFact(response.data[0]);
      } catch (err) {
        console.error('Failed to load facts:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFacts();
  }, []);

  const loadRandomFact = async () => {
    setLoading(true);
    try {
      const response = await getRandomFact();
      setSelectedFact(response.data);
    } catch (err) {
      console.error('Failed to load random fact:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ paddingTop: '48px' }}>
      <h1>Did You Know?</h1>
      <p>Fascinating facts about Kenya's history and constitution</p>
      {selectedFact && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#006B3F', borderRadius: '20px', marginBottom: '12px', fontSize: '11px', color: 'white' }}>
            {selectedFact.category} {selectedFact.year && `• ${selectedFact.year}`}
          </div>
          <h3>{selectedFact.title}</h3>
          <p>{selectedFact.content}</p>
          <button onClick={loadRandomFact} className="btn-primary"><FiRefreshCw /> Another Fact</button>
        </div>
      )}
    </div>
  );
}

export default DidYouKnow;
