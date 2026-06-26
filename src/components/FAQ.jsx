import React, { useState, useEffect } from 'react';
import { getFAQs } from '../services/api';
import { FiChevronDown, FiChevronUp, FiFilter, FiHelpCircle, FiSearch, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  const categories = [
    { value: 'all', label: 'All Questions', icon: FiHelpCircle, color: '#006B3F', count: 0 },
    { value: 'health', label: 'Health', icon: FiHelpCircle, color: '#BB0000', count: 0 },
    { value: 'education', label: 'Education', icon: FiHelpCircle, color: '#D4A017', count: 0 },
    { value: 'family', label: 'Family', icon: FiHelpCircle, color: '#006B3F', count: 0 },
    { value: 'voting', label: 'Voting', icon: FiHelpCircle, color: '#BB0000', count: 0 },
    { value: 'technology', label: 'Technology', icon: FiHelpCircle, color: '#1A1A1A', count: 0 },
  ];

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    let filtered = faqs;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f => 
        (f.question && f.question.toLowerCase().includes(query)) ||
        (f.answer && f.answer.toLowerCase().includes(query))
      );
    }
    
    setFilteredFaqs(filtered);
    
    // Update total pages
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setTotalItems(filtered.length);
    
    // Reset to page 1 when filtering
    if (currentPage > Math.ceil(filtered.length / itemsPerPage)) {
      setCurrentPage(1);
    }
    
    const updatedCategories = [...categories];
    updatedCategories[0].count = faqs.length;
    for (let i = 1; i < updatedCategories.length; i++) {
      updatedCategories[i].count = faqs.filter(f => f.category === updatedCategories[i].value).length;
    }
    
  }, [selectedCategory, searchQuery, faqs, itemsPerPage]);

  const fetchFAQs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFAQs();
      
      if (!response || !response.data) {
        throw new Error('No response from server');
      }
      
      const data = response.data;
      let faqsArray = [];
      
      if (data.results && Array.isArray(data.results)) {
        faqsArray = data.results;
      } else if (Array.isArray(data)) {
        faqsArray = data;
      } else {
        faqsArray = [];
      }
      
      setFaqs(faqsArray);
      setFilteredFaqs(faqsArray);
      setTotalItems(faqsArray.length);
      setTotalPages(Math.ceil(faqsArray.length / itemsPerPage));
      
      // Update category counts
      const updatedCategories = [...categories];
      updatedCategories[0].count = faqsArray.length;
      for (let i = 1; i < updatedCategories.length; i++) {
        updatedCategories[i].count = faqsArray.filter(f => f.category === updatedCategories[i].value).length;
      }
      
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
      setError('Unable to load FAQs. Please try again.');
      setFaqs([]);
      setFilteredFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'arrest': 'Arrest & Police',
      'land': 'Land & Property',
      'employment': 'Employment',
      'health': 'Health',
      'education': 'Education',
      'family': 'Family',
      'corruption': 'Corruption',
      'voting': 'Voting',
      'technology': 'Technology',
      'other': 'Other'
    };
    return labels[category] || category;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredFaqs.slice(startIndex, endIndex);
  };

  const currentItems = getCurrentPageItems();

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '48px', textAlign: 'center', paddingBottom: '60px' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
        <p style={{ color: '#6c757d' }}>Loading frequently asked questions...</p>
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
          <button onClick={fetchFAQs} className="btn-secondary" style={{ padding: '10px 24px', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="heading-1" style={{ marginBottom: '12px' }}>Frequently Asked Questions</h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>
          Common legal questions answered based on the Kenyan Constitution and laws
        </p>
      </div>

      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '20px 24px', 
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '44px', paddingRight: '44px', width: '100%' }}
            placeholder="Search for questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#adb5bd'
              }}
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', cursor: 'pointer' }}
        >
          <FiFilter size={16} />
          {showFilters ? 'Hide Categories' : 'Show Categories'}
          {selectedCategory !== 'all' && (
            <span style={{ 
              marginLeft: '8px',
              padding: '2px 8px',
              backgroundColor: '#006B3F',
              color: 'white',
              borderRadius: '20px',
              fontSize: '11px'
            }}>
              {getCategoryLabel(selectedCategory)}
            </span>
          )}
        </button>
        
        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}
          >
            Clear Filter
          </button>
        )}
      </div>

      {showFilters && (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '24px', 
          marginBottom: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#495057' }}>
            Filter by Category
          </h3>
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
                    padding: '8px 16px',
                    borderRadius: '30px',
                    border: isActive ? 'none' : '1px solid #e9ecef',
                    backgroundColor: isActive ? cat.color : 'white',
                    color: isActive ? 'white' : '#495057',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: '500',
                    fontSize: '13px',
                  }}
                >
                  <Icon size={14} />
                  {cat.label}
                  {cat.count > 0 && (
                    <span style={{
                      marginLeft: '4px',
                      fontSize: '11px',
                      opacity: isActive ? 0.8 : 0.6
                    }}>
                      ({cat.count})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* FAQ List */}
      {currentItems.length === 0 ? (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '60px', 
          textAlign: 'center',
          border: '1px solid #f0f0f0'
        }}>
          <FiHelpCircle size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#495057' }}>No questions found</h3>
          <p style={{ color: '#6c757d' }}>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentItems.map((faq, index) => {
              const globalIndex = (currentPage - 1) * itemsPerPage + index;
              return (
                <div 
                  key={faq.id || globalIndex} 
                  style={{ 
                    background: 'white', 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: openIndex === globalIndex ? '1px solid #006B3F' : '1px solid #f0f0f0',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(globalIndex)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      textAlign: 'left',
                      backgroundColor: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F8F9FA';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: openIndex === globalIndex ? '#006B3F' : '#E9ECEF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <FiHelpCircle size={16} color={openIndex === globalIndex ? 'white' : '#6c757d'} />
                      </div>
                      <span style={{ 
                        fontSize: '16px', 
                        fontWeight: '500', 
                        color: openIndex === globalIndex ? '#006B3F' : '#212529',
                        lineHeight: '1.4',
                        flex: 1
                      }}>
                        {faq.question}
                      </span>
                    </div>
                    <div style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%', 
                      backgroundColor: openIndex === globalIndex ? '#E8F5E9' : '#F8F9FA',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginLeft: '12px'
                    }}>
                      {openIndex === globalIndex ? 
                        <FiChevronUp size={18} color="#006B3F" /> : 
                        <FiChevronDown size={18} color="#adb5bd" />
                      }
                    </div>
                  </button>
                  
                  {openIndex === globalIndex && (
                    <div style={{ 
                      padding: '0 24px 24px 24px', 
                      borderTop: '1px solid #f0f0f0',
                      backgroundColor: '#FAFAFA'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '12px',
                        marginTop: '20px'
                      }}>
                        <div style={{
                          width: '3px',
                          backgroundColor: '#006B3F',
                          borderRadius: '2px',
                          flexShrink: 0
                        }}></div>
                        <div>
                          <p style={{ 
                            lineHeight: '1.7', 
                            color: '#495057',
                            marginBottom: '12px'
                          }}>
                            {faq.answer}
                          </p>
                          {faq.category && (
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              backgroundColor: '#E9ECEF',
                              borderRadius: '20px',
                              fontSize: '11px',
                              color: '#6c757d'
                            }}>
                              Category: {getCategoryLabel(faq.category)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination - Only show if more than 1 page */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '32px',
              padding: '16px 0',
              borderTop: '1px solid #f0f0f0',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredFaqs.length)} of {filteredFaqs.length} FAQs
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
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
                
                {/* Page 1 */}
                <button
                  onClick={() => handlePageChange(1)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: currentPage === 1 ? 'none' : '1px solid #ddd',
                    backgroundColor: currentPage === 1 ? '#006B3F' : 'white',
                    color: currentPage === 1 ? 'white' : '#495057',
                    cursor: 'pointer',
                    fontWeight: currentPage === 1 ? '600' : '400',
                    minWidth: '40px'
                  }}
                >
                  1
                </button>
                
                {/* Page 2 (only if totalPages >= 2) */}
                {totalPages >= 2 && (
                  <button
                    onClick={() => handlePageChange(2)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: currentPage === 2 ? 'none' : '1px solid #ddd',
                      backgroundColor: currentPage === 2 ? '#006B3F' : 'white',
                      color: currentPage === 2 ? 'white' : '#495057',
                      cursor: 'pointer',
                      fontWeight: currentPage === 2 ? '600' : '400',
                      minWidth: '40px'
                    }}
                  >
                    2
                  </button>
                )}
                
                {/* Show ellipsis if more than 2 pages */}
                {totalPages > 2 && currentPage > 2 && (
                  <span style={{ padding: '0 4px', color: '#adb5bd' }}>...</span>
                )}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
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
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FAQ;