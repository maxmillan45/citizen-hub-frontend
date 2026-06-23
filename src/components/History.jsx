import React, { useState, useEffect } from 'react';
import { getHistoryFacts } from '../services/api';
import { FiBookOpen, FiFilter, FiCalendar, FiRefreshCw, FiInfo } from 'react-icons/fi';

function History() {
  const [facts, setFacts] = useState([]);
  const [filteredFacts, setFilteredFacts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFact, setSelectedFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Only working categories from the database
  const categories = [
    { value: 'all', label: 'All', icon: FiBookOpen, color: '#006B3F' },
    { value: 'independence', label: 'Independence Struggle', icon: FiCalendar, color: '#006B3F' },
    { value: 'post_independence', label: 'Post Independence', icon: FiCalendar, color: '#1A1A1A' },
    { value: 'leaders', label: 'Historical Leaders', icon: FiInfo, color: '#BB0000' },
  ];

  useEffect(() => {
    fetchFacts();
  }, []);

  useEffect(() => {
    if (!Array.isArray(facts)) {
      setFilteredFacts([]);
      return;
    }
    
    if (selectedCategory === 'all') {
      setFilteredFacts(facts);
    } else {
      setFilteredFacts(facts.filter(f => f.category === selectedCategory));
    }
    setSelectedFact(null);
  }, [selectedCategory, facts]);

  const fetchFacts = async () => {
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
      
      setFacts(factsArray);
      setFilteredFacts(factsArray);
    } catch (err) {
      console.error('Error fetching facts:', err);
      setError('Unable to load history facts. Please try again.');
      setFacts([]);
      setFilteredFacts([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : '#1A1A1A';
  };

  const getCategoryLabel = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '48px', textAlign: 'center', paddingBottom: '60px' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
        <p style={{ color: '#6c757d' }}>Loading Kenyan history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '60px' }}>
        <div style={{ background: '#FFEBEE', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '1px solid #FFCDD2' }}>
          <p style={{ color: '#BB0000', marginBottom: '16px' }}>{error}</p>
          <button onClick={fetchFacts} className="btn-secondary" style={{ padding: '10px 24px', cursor: 'pointer' }}>
            <FiRefreshCw size={16} style={{ marginRight: '8px' }} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="heading-1" style={{ marginBottom: '12px' }}>Kenyan History</h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>
          Discover fascinating facts about Kenya's rich heritage, culture, and historical milestones
        </p>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '20px 24px', 
        marginBottom: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <FiFilter size={18} color="#6c757d" />
          <span style={{ fontWeight: '500', color: '#495057' }}>Filter by Category:</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px',
                  borderRadius: '30px',
                  border: isActive ? 'none' : '1px solid #e9ecef',
                  backgroundColor: isActive ? cat.color : 'white',
                  color: isActive ? 'white' : '#495057',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: '500',
                  fontSize: '14px',
                }}
              >
                <Icon size={16} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {filteredFacts.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
          <FiBookOpen size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#6c757d' }}>No history facts found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-2" style={{ gap: '28px' }}>
          {filteredFacts.map((fact) => (
            <div 
              key={fact.id} 
              className="card" 
              style={{ 
                padding: '0',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                border: selectedFact?.id === fact.id ? '2px solid #006B3F' : '1px solid #f0f0f0'
              }}
              onClick={() => setSelectedFact(selectedFact?.id === fact.id ? null : fact)}
            >
              <div style={{ 
                padding: '16px 20px',
                background: `linear-gradient(135deg, ${getCategoryColor(fact.category)} 0%, ${getCategoryColor(fact.category)}CC 100%)`,
                color: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    <FiInfo size={12} />
                    {getCategoryLabel(fact.category)}
                  </span>
                  {fact.year && (
                    <span style={{ fontSize: '13px', opacity: 0.9 }}>
                      <FiCalendar size={12} style={{ marginRight: '4px' }} />
                      {fact.year}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', marginTop: '12px', marginBottom: '0', lineHeight: '1.3' }}>
                  {fact.title}
                </h3>
              </div>

              <div style={{ padding: '20px' }}>
                <p style={{ lineHeight: '1.6', color: '#495057', marginBottom: selectedFact?.id === fact.id ? '16px' : '0' }}>
                  {selectedFact?.id === fact.id 
                    ? fact.content 
                    : `${fact.content ? fact.content.substring(0, 200) : ''}...`
                  }
                </p>
                {fact.content && fact.content.length > 200 && selectedFact?.id !== fact.id && (
                  <span style={{ color: '#006B3F', fontSize: '13px', fontWeight: '500' }}>
                    Click to read more →
                  </span>
                )}
              </div>

              {selectedFact?.id === fact.id && fact.image_url && (
                <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid #f0f0f0' }}>
                  <img 
                    src={fact.image_url} 
                    alt={fact.title}
                    style={{
                      width: '100%',
                      maxHeight: '250px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginTop: '16px'
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;