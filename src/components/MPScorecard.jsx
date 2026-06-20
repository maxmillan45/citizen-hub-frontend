import React, { useState, useEffect } from 'react';
import { getMPs } from '../services/api';
import { FiUser, FiMapPin, FiFlag, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';

function MPScorecard() {
  const [mps, setMps] = useState([]);
  const [filteredMps, setFilteredMps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('all');
  const [parties, setParties] = useState([]);

  useEffect(() => {
    fetchMPs();
  }, []);

  useEffect(() => {
    let filtered = [...mps];
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(mp => 
        mp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mp.constituency.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedParty !== 'all') {
      filtered = filtered.filter(mp => mp.party === selectedParty);
    }
    
    setFilteredMps(filtered);
  }, [searchTerm, selectedParty, mps]);

  const fetchMPs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMPs();
      const data = response.data;
      const mpsArray = data.results || [];
      setMps(mpsArray);
      setFilteredMps(mpsArray);
      
      // Extract unique parties
      const uniqueParties = [...new Set(mpsArray.map(mp => mp.party).filter(Boolean))];
      setParties(['all', ...uniqueParties]);
    } catch (err) {
      console.error('Error fetching MPs:', err);
      setError('Unable to load Members of Parliament. Please try again.');
      setMps([]);
      setFilteredMps([]);
    } finally {
      setLoading(false);
    }
  };

  const getPartyColor = (party) => {
    const colors = {
      'UDA': '#1A1A1A',
      'ODM': '#BB0000',
      'Jubilee': '#006B3F',
      'Wiper': '#D4A017',
      'FORD-Kenya': '#1A1A1A',
      'ANC': '#006B3F',
      'NARC-Kenya': '#BB0000',
      'Independent': '#6c757d',
    };
    return colors[party] || '#6c757d';
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '48px', textAlign: 'center', paddingBottom: '60px' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
        <p style={{ color: '#6c757d' }}>Loading Members of Parliament...</p>
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
          <button onClick={fetchMPs} className="btn-secondary">
            <FiRefreshCw size={16} style={{ marginRight: '8px' }} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="heading-1" style={{ marginBottom: '12px' }}>Parliament Scorecard</h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>
          Track and monitor the performance of your Members of Parliament
        </p>
      </div>

      {/* Search and Filter */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '20px 24px', 
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '200px', position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input
              type="text"
              placeholder="Search by name or constituency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 36px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <FiFilter size={16} color="#6c757d" />
            {parties.map(party => (
              <button
                key={party}
                onClick={() => setSelectedParty(party)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: selectedParty === party ? '#006B3F' : '#f0f0f0',
                  color: selectedParty === party ? 'white' : '#495057',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: selectedParty === party ? '600' : '400'
                }}
              >
                {party === 'all' ? 'All Parties' : party}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: '#6c757d', fontSize: '14px' }}>
          Showing <strong style={{ color: '#006B3F' }}>{filteredMps.length}</strong> MPs
          {selectedParty !== 'all' && ` from ${selectedParty}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* MPs Grid */}
      {filteredMps.length === 0 ? (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '60px', 
          textAlign: 'center',
          border: '1px solid #f0f0f0'
        }}>
          <FiUser size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#495057' }}>No MPs found</h3>
          <p style={{ color: '#6c757d' }}>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-3" style={{ gap: '24px' }}>
          {filteredMps.map((mp) => (
            <div 
              key={mp.id} 
              className="card"
              style={{ 
                padding: '0',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              <div style={{ 
                padding: '20px',
                background: `linear-gradient(135deg, ${getPartyColor(mp.party)} 0%, ${getPartyColor(mp.party)}CC 100%)`,
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FiUser size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                      {mp.name}
                    </h3>
                    <span style={{ 
                      display: 'inline-block',
                      padding: '2px 8px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {mp.party || 'Independent'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#495057' }}>
                  <FiMapPin size={14} color="#6c757d" />
                  <span style={{ fontSize: '14px' }}>{mp.constituency}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6c757d' }}>
                  <FiFlag size={14} />
                  <span style={{ fontSize: '13px' }}>{mp.party || 'Independent'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MPScorecard;