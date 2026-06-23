import React, { useState, useEffect } from 'react';
import { getMPs } from '../services/api';
import { 
  FiUser, 
  FiMapPin, 
  FiFlag, 
  FiSearch, 
  FiFilter, 
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

function MPScorecard() {
  const [mps, setMps] = useState([]);
  const [filteredMps, setFilteredMps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('all');
  const [parties, setParties] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(20);

  useEffect(() => {
    fetchMPs(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!mps || mps.length === 0) {
      setFilteredMps([]);
      return;
    }
    
    let filtered = [...mps];
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(mp => 
        mp.name && mp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mp.constituency && mp.constituency.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedParty !== 'all') {
      filtered = filtered.filter(mp => mp.party === selectedParty);
    }
    
    setFilteredMps(filtered);
  }, [searchTerm, selectedParty, mps]);

  const fetchMPs = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMPs(page, pageSize);
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      const data = response.data;
      const mpsArray = data.results || [];
      
      if (!Array.isArray(mpsArray)) {
        throw new Error('Expected array of MPs');
      }
      
      setMps(mpsArray);
      setFilteredMps(mpsArray);
      
      // Set pagination info
      setTotalCount(data.count || mpsArray.length);
      setTotalPages(Math.ceil((data.count || mpsArray.length) / pageSize));
      
      // Extract unique parties from all MPs (fetch all pages if needed)
      if (data.count && data.count > mpsArray.length) {
        fetchAllParties();
      } else {
        const uniqueParties = ['all', ...new Set(mpsArray.map(mp => mp.party).filter(Boolean))];
        setParties(uniqueParties);
      }
      
    } catch (err) {
      console.error('Error fetching MPs:', err);
      setError('Unable to load Members of Parliament. Please try again.');
      setMps([]);
      setFilteredMps([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllParties = async () => {
    try {
      const response = await getMPs(1, 200);
      if (response && response.data) {
        const allMPs = response.data.results || [];
        const uniqueParties = ['all', ...new Set(allMPs.map(mp => mp.party).filter(Boolean))];
        setParties(uniqueParties);
      }
    } catch (err) {
      console.error('Error fetching parties:', err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePartyFilter = (party) => {
    setSelectedParty(party);
    setCurrentPage(1);
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

  if (loading && currentPage === 1) {
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
              onChange={handleSearch}
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
                onClick={() => handlePartyFilter(party)}
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
          {totalCount > 0 && ` (Total: ${totalCount} MPs)`}
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
        <div>
          <div className="grid grid-3" style={{ gap: '24px' }}>
            {filteredMps.map((mp) => (
              <div 
                key={mp.id || Math.random()} 
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
                        {mp.name || 'Unknown'}
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
                    <span style={{ fontSize: '14px' }}>{mp.constituency || 'Unknown'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6c757d' }}>
                    <FiFlag size={14} />
                    <span style={{ fontSize: '13px' }}>{mp.party || 'Independent'}</span>
                  </div>
                </div>
              </div>
            ))}
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

export default MPScorecard;