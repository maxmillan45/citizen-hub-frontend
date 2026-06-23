import React, { useState, useEffect } from 'react';
import { getMPs } from '../services/api';
import { 
  FiUsers, 
  FiFilter, 
  FiSearch, 
  FiMapPin, 
  FiTrendingUp,
  FiAward,
  FiUserCheck,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(20);

  const parties = [
    { value: 'all', label: 'All Parties', color: '#006B3F' },
    { value: 'ODM', label: 'ODM', color: '#BB0000' },
    { value: 'Jubilee', label: 'Jubilee', color: '#1A1A1A' },
    { value: 'Independent', label: 'Independent', color: '#006B3F' },
  ];

  useEffect(() => {
    fetchMPs(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!Array.isArray(mps) || mps.length === 0) {
      setFilteredMps([]);
      return;
    }
    
    let filtered = [...mps];
    
    if (selectedParty !== 'all') {
      filtered = filtered.filter(mp => mp.party === selectedParty);
    }
    
    if (selectedConstituency) {
      filtered = filtered.filter(mp => 
        mp.constituency && mp.constituency.toLowerCase().includes(selectedConstituency.toLowerCase())
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter(mp => 
        (mp.name && mp.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mp.constituency && mp.constituency.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (mp.party && mp.party.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredMps(filtered);
  }, [selectedParty, selectedConstituency, searchQuery, mps]);

  const fetchMPs = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMPs(page, pageSize);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      const data = response.data;
      
      let mpsArray = [];
      if (data.results && Array.isArray(data.results)) {
        mpsArray = data.results;
      } else if (Array.isArray(data)) {
        mpsArray = data;
      } else {
        mpsArray = [];
      }
      
      setMps(mpsArray);
      setFilteredMps(mpsArray);
      
      // Set pagination info
      setTotalCount(data.count || mpsArray.length);
      setTotalPages(Math.ceil((data.count || mpsArray.length) / pageSize));
      
    } catch (err) {
      console.error('Error fetching MPs:', err);
      setError('Unable to load MPs. Please try again later.');
      setMps([]);
      setFilteredMps([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setSelectedMp(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePartyChange = (e) => {
    setSelectedParty(e.target.value);
    setCurrentPage(1);
  };

  const handleConstituencyChange = (e) => {
    setSelectedConstituency(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedParty('all');
    setSelectedConstituency('');
    setSearchQuery('');
    setCurrentPage(1);
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
          <button onClick={() => fetchMPs(currentPage)} className="btn-secondary" style={{ padding: '10px 24px', cursor: 'pointer' }}>
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
          Track your Members of Parliament and their performance in the National Assembly
        </p>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '24px', 
        marginBottom: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '36px', width: '100%' }}
              placeholder="Search by name, constituency, or party..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div>
            <select
              className="input-field"
              style={{ width: '100%' }}
              value={selectedParty}
              onChange={handlePartyChange}
            >
              {parties.map(party => (
                <option key={party.value} value={party.value}>{party.label}</option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="text"
              className="input-field"
              style={{ width: '100%' }}
              placeholder="Filter by constituency..."
              value={selectedConstituency}
              onChange={handleConstituencyChange}
            />
          </div>
        </div>

        {(selectedParty !== 'all' || selectedConstituency || searchQuery) && (
          <div style={{ marginTop: '16px', textAlign: 'right' }}>
            <button
              onClick={clearFilters}
              className="btn-outline"
              style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {!loading && !error && (
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            Showing <strong style={{ color: '#006B3F' }}>{filteredMps.length}</strong> Members of Parliament
            {totalCount > 0 && ` (Total: ${totalCount} MPs)`}
          </p>
        </div>
      )}

      {filteredMps.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', border: '1px solid #f0f0f0' }}>
          <FiUsers size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#495057' }}>No MPs found</h3>
          <p style={{ color: '#6c757d' }}>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-2" style={{ gap: '28px' }}>
            {filteredMps.map((mp) => {
              const performance = getPerformanceGrade(mp);
              const isSelected = selectedMp?.id === mp.id;
              
              return (
                <div 
                  key={mp.id || Math.random()} 
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
                  <div style={{ 
                    padding: '24px',
                    background: `linear-gradient(135deg, ${getPartyColor(mp.party)} 0%, ${getPartyColor(mp.party)}CC 100%)`,
                    color: 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span style={{ 
                            padding: '4px 12px', 
                            backgroundColor: 'rgba(255,255,255,0.2)', 
                            borderRadius: '20px', 
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            {mp.party || 'Independent'}
                          </span>
                          <span style={{ 
                            padding: '4px 12px', 
                            backgroundColor: 'rgba(255,255,255,0.2)', 
                            borderRadius: '20px', 
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            <FiMapPin size={12} style={{ marginRight: '4px' }} />
                            {mp.constituency || 'Unknown'}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>{mp.name || 'Unknown'}</h3>
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '12px',
              marginTop: '32px',
              padding: '16px',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #f0f0f0',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: currentPage === 1 ? '#f0f0f0' : 'white',
                  color: currentPage === 1 ? '#adb5bd' : '#495057',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <FiChevronLeft size={16} />
                Previous
              </button>
              
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      style={{
                        padding: '8px 14px',
                        border: '1px solid',
                        borderColor: currentPage === pageNumber ? '#006B3F' : '#ddd',
                        borderRadius: '8px',
                        backgroundColor: currentPage === pageNumber ? '#006B3F' : 'white',
                        color: currentPage === pageNumber ? 'white' : '#495057',
                        cursor: 'pointer',
                        fontWeight: currentPage === pageNumber ? '600' : '400'
                      }}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: currentPage === totalPages ? '#f0f0f0' : 'white',
                  color: currentPage === totalPages ? '#adb5bd' : '#495057',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Next
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
          
          {totalPages > 1 && (
            <div style={{ textAlign: 'center', marginTop: '12px', color: '#6c757d', fontSize: '13px' }}>
              Page {currentPage} of {totalPages} • Total {totalCount} MPs
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MPList;