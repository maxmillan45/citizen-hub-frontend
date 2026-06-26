import React, { useState, useEffect } from 'react';
import { searchConstitution, getArticle } from '../services/api';
import { FiSearch, FiBook, FiArrowLeft, FiFileText, FiInfo, FiGlobe } from 'react-icons/fi';

function ConstitutionSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showSimplified, setShowSimplified] = useState(true);
  const [language, setLanguage] = useState('english');

  // Load all articles on page load
  useEffect(() => {
    loadAllArticles();
  }, []);

  const loadAllArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await searchConstitution('');
      const data = response.data;
      
      let articlesArray = [];
      if (Array.isArray(data)) {
        articlesArray = data;
      } else if (data && data.results && Array.isArray(data.results)) {
        articlesArray = data.results;
      } else {
        articlesArray = [];
      }
      
      setResults(articlesArray);
      setSearchPerformed(true);
    } catch (err) {
      console.error('Failed to load articles:', err);
      setError('Failed to load constitution articles.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      loadAllArticles();
      return;
    }
    
    setLoading(true);
    setError(null);
    setSelectedArticle(null);
    setSearchPerformed(true);
    
    try {
      const response = await searchConstitution(query);
      const data = response.data;
      
      let articlesArray = [];
      if (Array.isArray(data)) {
        articlesArray = data;
      } else if (data && data.results && Array.isArray(data.results)) {
        articlesArray = data.results;
      } else {
        articlesArray = [];
      }
      
      setResults(articlesArray);
      
      if (articlesArray.length === 0) {
        setError('No articles found matching your search.');
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to search the constitution. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewArticle = async (number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getArticle(number);
      setSelectedArticle(response.data);
    } catch (err) {
      console.error('Failed to load article:', err);
      setError('Failed to load article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getTopicLabel = (topic) => {
    const topics = {
      'rights': 'Rights & Freedoms',
      'land': 'Land & Property',
      'government': 'Government',
      'citizenship': 'Citizenship',
      'other': 'General'
    };
    return topics[topic] || topic;
  };

  const getTopicColor = (topic) => {
    const colors = {
      'rights': '#006B3F',
      'land': '#006B3F',
      'government': '#1A1A1A',
      'citizenship': '#BB0000',
      'other': '#6c757d'
    };
    return colors[topic] || '#6c757d';
  };

  const getDisplayText = (article) => {
    if (showSimplified) {
      if (language === 'swahili' && article.simplified_swahili) {
        return article.simplified_swahili;
      }
      if (article.simplified_english) {
        return article.simplified_english;
      }
    }
    return article.full_text || article.content || 'Content not available';
  };

  const getDisplayTitle = (article) => {
    if (showSimplified) {
      if (language === 'swahili') {
        return `Kifungu ${article.article_number}`;
      }
      return `Article ${article.article_number} (Simplified)`;
    }
    return `Article ${article.article_number}`;
  };

  if (selectedArticle) {
    return (
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        <button 
          onClick={() => setSelectedArticle(null)} 
          className="btn-outline" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer' }}
        >
          <FiArrowLeft size={16} />
          Back to results
        </button>
        
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1A1A1A', margin: 0 }}>
                {getDisplayTitle(selectedArticle)}
              </h1>
              {selectedArticle.title && !showSimplified && (
                <h3 style={{ fontSize: '16px', fontWeight: '400', color: '#6c757d', marginTop: '4px' }}>
                  {selectedArticle.title}
                </h3>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedArticle.topic && (
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: getTopicColor(selectedArticle.topic),
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {getTopicLabel(selectedArticle.topic)}
                </span>
              )}
              <button
                onClick={() => setShowSimplified(!showSimplified)}
                className="btn-outline"
                style={{ padding: '4px 12px', fontSize: '12px', cursor: 'pointer' }}
              >
                {showSimplified ? 'Show Full Text' : 'Show Simplified'}
              </button>
              {showSimplified && (
                <button
                  onClick={() => setLanguage(language === 'kiswahili' ? 'swahili' : 'english')}
                  className="btn-outline"
                  style={{ padding: '4px 12px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <FiGlobe size={14} />
                  {language === 'kiswahili' ? 'English' : 'Kiswahili'}
                </button>
              )}
            </div>
          </div>
          
          <div style={{ 
            lineHeight: '1.8', 
            color: '#212529',
            whiteSpace: 'pre-wrap',
            padding: '16px',
            backgroundColor: showSimplified ? '#E8F5E9' : 'transparent',
            borderRadius: '8px'
          }}>
            {getDisplayText(selectedArticle)}
          </div>
          
          {selectedArticle.chapter && (
            <div style={{ 
              marginTop: '24px', 
              padding: '16px', 
              backgroundColor: '#F8F9FA', 
              borderRadius: '8px',
              fontSize: '14px',
              color: '#6c757d'
            }}>
              <strong>Chapter:</strong> {selectedArticle.chapter}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 className="heading-1" style={{ marginBottom: '12px' }}>Constitution of Kenya 2010</h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>
          Browse and search the Kenyan Constitution in English or Kiswahili
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '200px', position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#adb5bd' }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by keyword, topic, or article number..."
              style={{
                width: '100%',
                padding: '12px 12px 12px 40px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <button 
            onClick={handleSearch} 
            disabled={loading} 
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
          >
            {loading ? 'Searching...' : <><FiSearch size={16} /> Search</>}
          </button>
          <button 
            onClick={loadAllArticles} 
            disabled={loading} 
            className="btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }}
          >
            <FiBook size={16} />
            Show All
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          background: '#FFEBEE', 
          borderRadius: '12px', 
          padding: '16px 20px', 
          marginBottom: '24px',
          border: '1px solid #FFCDD2',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FiInfo size={18} color="#BB0000" />
          <p style={{ color: '#BB0000', margin: 0 }}>{error}</p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
          <p style={{ color: '#6c757d' }}>Loading articles...</p>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '60px', 
          textAlign: 'center',
          border: '1px solid #f0f0f0'
        }}>
          <FiBook size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#495057' }}>No articles found</h3>
          <p style={{ color: '#6c757d' }}>Try a different search term</p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: '#6c757d', fontSize: '14px' }}>
              Showing <strong style={{ color: '#006B3F' }}>{results.length}</strong> articles
            </p>
          </div>
          <div className="grid grid-2" style={{ gap: '20px' }}>
            {results.map((article) => (
              <div 
                key={article.id || Math.random()} 
                className="card" 
                onClick={() => handleViewArticle(article.article_number)} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '20px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  border: '1px solid #f0f0f0',
                  borderRadius: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#006B3F' }}>
                    Article {article.article_number}
                  </h3>
                  {article.topic && (
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      backgroundColor: getTopicColor(article.topic),
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '500',
                      flexShrink: 0,
                      marginLeft: '8px'
                    }}>
                      {getTopicLabel(article.topic)}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '14px', color: '#495057', margin: '8px 0 12px 0' }}>
                  {article.title || `Article ${article.article_number}`}
                </p>
                {article.simplified_english && (
                  <p style={{ fontSize: '13px', color: '#6c757d', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.simplified_english.substring(0, 150)}...
                  </p>
                )}
                <div style={{ marginTop: '12px', color: '#006B3F', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiFileText size={14} />
                  Click to read full article
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConstitutionSearch;