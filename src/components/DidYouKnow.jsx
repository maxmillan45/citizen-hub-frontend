import React, { useState, useEffect } from 'react';
import { getHistoryFacts } from '../services/api';
import { FiRefreshCw, FiInfo, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function DidYouKnow() {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFact, setSelectedFact] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getHistoryFacts();
        
        if (!response || !response.data) {
          throw new Error('No response from server');
        }
        
        const data = response.data;
        let factsArray = [];
        
        if (data.results && Array.isArray(data.results)) {
          factsArray = data.results;
        } else if (Array.isArray(data)) {
          factsArray = data;
        } else {
          factsArray = [];
        }
        
        // Shuffle the facts array
        const shuffled = [...factsArray];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        setFacts(shuffled);
        if (shuffled.length > 0) {
          setSelectedFact(shuffled[0]);
        } else {
          setError('No history facts available.');
        }
      } catch (err) {
        console.error('Failed to load facts:', err);
        setError('Unable to load history facts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadFacts();
  }, []);

  const shuffleFacts = () => {
    if (facts.length === 0) return;
    setLoading(true);
    const shuffled = [...facts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setFacts(shuffled);
    setSelectedFact(shuffled[0]);
    setLoading(false);
  };

  const goToHistory = () => {
    navigate('/history');
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'precolonial': 'Pre-Colonial Era',
      'colonial': 'Colonial Era',
      'independence': 'Independence Struggle',
      'post_independence': 'Post Independence',
      'leaders': 'Historical Leaders',
      'culture': 'Culture & Heritage',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'precolonial': '#1A1A1A',
      'colonial': '#BB0000',
      'independence': '#006B3F',
      'post_independence': '#1A1A1A',
      'leaders': '#BB0000',
      'culture': '#006B3F',
    };
    return colors[category] || '#006B3F';
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '48px', textAlign: 'center', paddingBottom: '60px' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
        <p style={{ color: '#6c757d' }}>Loading fascinating facts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '60px' }}>
        <div style={{ 
          background: '#FFEBEE', 
          borderRadius: '12px', 
          padding: '40px', 
          textAlign: 'center',
          border: '1px solid #FFCDD2'
        }}>
          <p style={{ color: '#BB0000', marginBottom: '16px' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-secondary"
            style={{ padding: '10px 24px', cursor: 'pointer' }}
          >
            <FiRefreshCw size={16} style={{ marginRight: '8px' }} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!selectedFact) {
    return (
      <div className="container" style={{ paddingTop: '48px', textAlign: 'center', paddingBottom: '60px' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '60px', 
          textAlign: 'center',
          border: '1px solid #f0f0f0'
        }}>
          <FiInfo size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#495057' }}>No facts available</h3>
          <p style={{ color: '#6c757d' }}>Check back later for new facts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '60px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="heading-1" style={{ marginBottom: '8px' }}>Did You Know?</h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>
          Fascinating facts about Kenya's rich history, culture, and heritage
        </p>
      </div>

      <div className="card" style={{ 
        padding: '32px',
        maxWidth: '800px',
        margin: '0 auto',
        border: '1px solid #f0f0f0',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
      }}>
        <div style={{ 
          display: 'inline-block', 
          padding: '4px 16px', 
          backgroundColor: getCategoryColor(selectedFact.category),
          borderRadius: '20px', 
          marginBottom: '16px', 
          fontSize: '12px', 
          fontWeight: '500',
          color: 'white'
        }}>
          <FiInfo size={12} style={{ marginRight: '6px' }} />
          {getCategoryLabel(selectedFact.category)}
          {selectedFact.year && (
            <span style={{ marginLeft: '8px', opacity: 0.8 }}>
              <FiCalendar size={12} style={{ marginRight: '4px' }} />
              {selectedFact.year}
            </span>
          )}
        </div>

        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          marginBottom: '16px', 
          color: '#1A1A1A',
          lineHeight: '1.3'
        }}>
          {selectedFact.title}
        </h2>

        <p style={{ 
          fontSize: '16px', 
          lineHeight: '1.8', 
          color: '#495057',
          marginBottom: '24px'
        }}>
          {selectedFact.content}
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={shuffleFacts} 
            className="btn-primary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#006B3F',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <FiRefreshCw size={16} />
            Shuffle Fact
          </button>
          <button 
            onClick={goToHistory} 
            className="btn-outline"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#006B3F',
              border: '1px solid #006B3F',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Read More History
            <FiArrowRight size={16} />
          </button>
        </div>

        <div style={{ 
          marginTop: '24px', 
          padding: '12px 16px', 
          backgroundColor: '#F8F9FA', 
          borderRadius: '8px',
          fontSize: '13px',
          color: '#6c757d',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Fact {facts.indexOf(selectedFact) + 1} of {facts.length}</span>
          <span style={{ fontSize: '11px', opacity: 0.7 }}>
            Click shuffle for a new fact
          </span>
        </div>
      </div>
    </div>
  );
}

export default DidYouKnow;