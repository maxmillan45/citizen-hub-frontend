import React, { useState, useEffect } from 'react';
import { getMPs } from '../services/api';
import { 
  FiUsers, 
  FiFilter, 
  FiSearch, 
  FiMapPin, 
  FiStar, 
  FiTrendingUp,
  FiAward,
  FiUserCheck,
  FiRefreshCw
} from 'react-icons/fi';

function MPList() {
  const [mps, setMps] = useState([]);
  const [filteredMps, setFilteredMps] = useState([]);
  const [selectedParty, setSelectedParty] = useState('all');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMp, setSelectedMp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const parties = [
    { value: 'all', label: 'All Parties', color: '#006B3F' },
    { value: 'ODM', label: 'ODM', color: '#BB0000' },
    { value: 'Jubilee', label: 'Jubilee', color: '#1A1A1A' },
    { value: 'Independent', label: 'Independent', color: '#006B3F' },
  ];

  useEffect(() => {
    fetchMPs();
  }, []);

  useEffect(() => {
    let filtered = [...mps];
    
    if (selectedParty !== 'all') {
      filtered = filtered.filter(mp => mp.party === selectedParty);
    }
    
    if (selectedConstituency) {
      filtered = filtered.filter(mp => 
        mp.constituency.toLowerCase().includes(selectedConstituency.toLowerCase())
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter(mp => 
        mp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mp.constituency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mp.party.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredMps(filtered);
  }, [selectedParty, selectedConstituency, searchQuery, mps]);

  const fetchMPs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMPs();
      setMps(response.data);
      setFilteredMps(response.data);
    } catch (err) {
      setError('Unable to load MPs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getPartyColor = (party) => {
    switch(party) {
      case 'ODM':
        return '#BB0000';
      case 'Jubilee':
        return '#1A1A1A';
      default:
        return '#006B3F';
    }
  };

  const getPerformanceGrade = (mp) => {
    // Mock performance data - in production this would come from API
    const performance = {
      'Hon. Jane Akinyi': { grade: 'A', attendance: 94, billsSponsored: 5, projectsCompleted: 12 },
      'Hon. Peter Omondi': { grade: 'B', attendance: 87, billsSponsored: 3, projectsCompleted: 8 },
      'Hon. James Mwangi': { grade: 'C', attendance: 76, billsSponsored: 2, projectsCompleted: 5 },
      'Hon. Sarah Wanjiku': { grade: 'A', attendance: 92, billsSponsored: 4, projectsCompleted: 10 },
    };
    return performance[mp.name] || { grade: 'B', attendance: 80, billsSponsored: 3, projectsCompleted: 7 };
  };

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return '#006B3F';
      case 'B': return '#006B3F';
      case 'C': return '#BB0000';
      default: return '#1A1A1A';
    }
  };

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="heading-1" style={{ marginBottom: '12px' }}>Parliament Scorecard</h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>
          Track your Members of Parliament and their performance in the National Assembly
        </p>
      </div>

      {/* Filters Section */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '24px', 
        marginBottom: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '36px' }}
              placeholder="Search by name, constituency, or party..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Party Filter */}
          <div>
            <select
              className="input-field"
              value={selectedParty}
              onChange={(e) => setSelectedParty(e.target.value)}
            >
              {parties.map(party => (
                <option key={party.value} value={party.value}>{party.label}</option>
              ))}
            </select>
          </div>

          {/* Constituency Filter */}
          <div>
            <input
              type="text"
              className="input-field"
              placeholder="Filter by constituency..."
              value={selectedConstituency}
              onChange={(e) => setSelectedConstituency(e.target.value)}
            />
          </div>
        </div>

        {(selectedParty !== 'all' || selectedConstituency || searchQuery) && (
          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <button
              onClick={() => {
                setSelectedParty('all');
                setSelectedConstituency('');
                setSearchQuery('');
              }}
              className="btn-outline"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {!loading && !error && (
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            Showing <strong style={{ color: '#006B3F' }}>{filteredMps.length}</strong> Members of Parliament
          </p>
        </div>
      )}

      {/* MPs Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
          <p style={{ color: '#6c757d' }}>Loading Members of Parliament...</p>
        </div>
      ) : error ? (
        <div style={{ background: '#FFEBEE', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '1px solid #FFCDD2' }}>
          <p style={{ color: '#BB0000', marginBottom: '16px' }}>{error}</p>
          <button onClick={fetchMPs} className="btn-secondary">
            <FiRefreshCw size={16} style={{ marginRight: '8px' }} /> Try Again
          </button>
        </div>
      ) : filteredMps.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
          <FiUsers size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#495057' }}>No MPs found</h3>
          <p style={{ color: '#6c757d' }}>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-2" style={{ gap: '28px' }}>
          {filteredMps.map((mp) => {
            const performance = getPerformanceGrade(mp);
            const isSelected = selectedMp?.id === mp.id;
            
            return (
              <div 
                key={mp.id} 
                className="card"
                style={{ 
                  padding: '0',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: isSelected ? '2px solid #006B3F' : '1px solid #f0f0f0',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedMp(isSelected ? null : mp)}
              >
                {/* MP Header */}
                <div style={{ 
                  padding: '24px',
                  background: `linear-gradient(135deg, ${getPartyColor(mp.party)} 0%, ${getPartyColor(mp.party)}CC 100%)`,
                  color: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          backgroundColor: 'rgba(255,255,255,0.2)', 
                          borderRadius: '20px', 
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {mp.party}
                        </span>
                        <span style={{ 
                          padding: '4px 12px', 
                          backgroundColor: 'rgba(255,255,255,0.2)', 
                          borderRadius: '20px', 
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          <FiMapPin size={12} style={{ marginRight: '4px' }} />
                          {mp.constituency}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{mp.name}</h3>
                    </div>
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: 'rgba(255,255,255,0.2)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      <FiUsers size={28} />
                    </div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div style={{ padding: '20px 24px', background: '#F8F9FA', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#006B3F' }}>{performance.attendance}%</div>
                      <div style={{ fontSize: '11px', color: '#6c757d' }}>Attendance</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#006B3F' }}>{performance.billsSponsored}</div>
                      <div style={{ fontSize: '11px', color: '#6c757d' }}>Bills Sponsored</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#006B3F' }}>{performance.projectsCompleted}</div>
                      <div style={{ fontSize: '11px', color: '#6c757d' }}>Projects Completed</div>
                    </div>
                  </div>
                </div>

                {/* Performance Grade */}
                <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiAward size={18} color={getGradeColor(performance.grade)} />
                    <span style={{ fontWeight: '500' }}>Performance Grade:</span>
                    <span style={{ 
                      fontWeight: '700', 
                      fontSize: '20px', 
                      color: getGradeColor(performance.grade)
                    }}>
                      {performance.grade}
                    </span>
                  </div>
                  <span style={{ color: '#006B3F', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {isSelected ? 'Click to collapse' : 'Click for details'} 
                    <FiTrendingUp size={14} />
                  </span>
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <div style={{ 
                    padding: '20px 24px', 
                    borderTop: '1px solid #f0f0f0',
                    backgroundColor: '#FAFAFA'
                  }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#1A1A1A' }}>
                      Parliamentary Performance Details
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e9ecef' }}>
                        <span style={{ color: '#6c757d' }}>Attendance Rate:</span>
                        <strong>{performance.attendance}%</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e9ecef' }}>
                        <span style={{ color: '#6c757d' }}>Bills Sponsored:</span>
                        <strong>{performance.billsSponsored}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e9ecef' }}>
                        <span style={{ color: '#6c757d' }}>Projects Completed:</span>
                        <strong>{performance.projectsCompleted}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e9ecef' }}>
                        <span style={{ color: '#6c757d' }}>Motions Contributed:</span>
                        <strong>12</strong>
                      </div>
                    </div>
                    <div style={{ 
                      padding: '12px', 
                      backgroundColor: '#E8F5E9', 
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <FiUserCheck size={20} color="#006B3F" />
                      <span style={{ fontSize: '13px', color: '#1A1A1A' }}>
                        Constituency office open Monday to Friday, 9am - 4pm
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MPList;
