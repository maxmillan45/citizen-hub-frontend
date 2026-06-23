import React, { useState, useEffect } from 'react';
import { getFAQs } from '../services/api';
import { FiChevronDown, FiChevronUp, FiFilter, FiHelpCircle, FiSearch, FiX, FiRefreshCw } from 'react-icons/fi';

function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'All Questions', icon: FiHelpCircle, color: '#006B3F', count: 0 },
    { value: 'health', label: 'Health', icon: FiHelpCircle, color: '#BB0000', count: 0 },
    { value: 'education', label: 'Education', icon: FiHelpCircle, color: '#1A1A1A', count: 0 },
    { value: 'family', label: 'Family', icon: FiHelpCircle, color: '#006B3F', count: 0 },
    { value: 'voting', label: 'Voting', icon: FiHelpCircle, color: '#BB0000', count: 0 },
    { value: 'technology', label: 'Technology', icon: FiHelpCircle, color: '#1A1A1A', count: 0 },
  ];

  useEffect(() => {
    fetchFAQs();
  }, []);

  useEffect(() => {
    if (!Array.isArray(faqs)) {
      setFilteredFaqs([]);
      return;
    }
    
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
    
    const updatedCategories = [...categories];
    updatedCategories[0].count = faqs.length;
    for (let i = 1; i < updatedCategories.length; i++) {
      updatedCategories[i].count = faqs.filter(f => f.category === updatedCategories[i].value).length;
    }
    
  }, [selectedCategory, searchQuery, faqs]);

  const fetchFAQs = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching FAQs...');
      const response = await getFAQs();
      console.log('FAQ Response:', response);
      
      // Check if response exists
      if (!response) {
        throw new Error('No response from server');
      }
      
      // Check if response.data exists
      if (!response.data) {
        throw new Error('No data in response');
      }
      
      const data = response.data;
      console.log('FAQ Data:', data);
      
      // Extract results array
      let faqsArray = [];
      if (data.results && Array.isArray(data.results)) {
        faqsArray = data.results;
      } else if (Array.isArray(data)) {
        faqsArray = data;
      } else {
        faqsArray = [];
      }
      
      console.log('FAQs Array:', faqsArray);
      console.log('Number of FAQs:', faqsArray.length);
      
      setFaqs(faqsArray);
      setFilteredFaqs(faqsArray);
      
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
            <FiRefreshCw size={16} style={{ marginRight: '8px' }} /> Try Again
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

      {filteredFaqs.length === 0 ? (
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredFaqs.map((faq, index) => (
            <div 
              key={faq.id || index} 
              style={{ 
                background: 'white', 
                borderRadius: '12px', 
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: openIndex === index ? '1px solid #006B3F' : '1px solid #f0f0f0',
                transition: 'all 0.3s ease'
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
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
                    backgroundColor: openIndex === index ? '#006B3F' : '#E9ECEF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FiHelpCircle size={16} color={openIndex === index ? 'white' : '#6c757d'} />
                  </div>
                  <span style={{ 
                    fontSize: '16px', 
                    fontWeight: '500', 
                    color: openIndex === index ? '#006B3F' : '#212529',
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
                  backgroundColor: openIndex === index ? '#E8F5E9' : '#F8F9FA',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginLeft: '12px'
                }}>
                  {openIndex === index ? 
                    <FiChevronUp size={18} color="#006B3F" /> : 
                    <FiChevronDown size={18} color="#adb5bd" />
                  }
                </div>
              </button>
              
              {openIndex === index && (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default FAQ;