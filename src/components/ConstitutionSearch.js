import React, { useState } from 'react';
import { searchConstitution, getArticle } from '../services/api';
import { FiSearch, FiBookOpen, FiChevronRight, FiFileText, FiInfo } from 'react-icons/fi';

function ConstitutionSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearchPerformed(true);
    try {
      const response = await searchConstitution(query);
      setResults(response.data);
      setSelectedArticle(null);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewArticle = async (articleNumber) => {
    setLoading(true);
    try {
      const response = await getArticle(articleNumber);
      setSelectedArticle(response.data);
    } catch (err) {
      console.error('Failed to fetch article:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load all articles on page load
  React.useEffect(() => {
    loadAllArticles();
  }, []);

  const loadAllArticles = async () => {
    setLoading(true);
    try {
      const response = await searchConstitution('');
      setResults(response.data);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '40px' }}>
        <h1 className="heading-1" style={{ marginBottom: '12px' }}>The Constitution of Kenya</h1>
        <p className="text-muted" style={{ fontSize: '16px' }}>Explore the supreme law of Kenya (2010) with simplified explanations</p>
      </div>

      {/* Search Bar */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        padding: '24px', 
        marginBottom: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '44px' }}
              placeholder="Search by keyword, article number, or topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: '120px' }}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {searchPerformed && results.length === 0 && !loading && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#FFF8E7', borderRadius: '8px', color: '#856404' }}>
            No articles found. Try searching for "rights", "arrest", "privacy", or "property"
          </div>
        )}
      </div>

      {/* Results and Content Area */}
      <div className="grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        {/* Results Panel */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0'
        }}>
          <div style={{ 
            padding: '16px 20px', 
            background: '#F8F9FA', 
            borderBottom: '1px solid #e9ecef',
            fontWeight: '600',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#6c757d'
          }}>
            <FiFileText style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Articles ({results.length})
          </div>
          <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
            {loading && results.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div className="loading-spinner" style={{ margin: '0 auto 16px' }}></div>
                <p style={{ color: '#999' }}>Loading articles...</p>
              </div>
            ) : (
              results.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleViewArticle(article.article_number)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    backgroundColor: selectedArticle?.id === article.id ? '#E8F5E9' : 'white',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedArticle?.id !== article.id) {
                      e.currentTarget.style.backgroundColor = '#F8F9FA';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedArticle?.id !== article.id) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '2px 8px',
                        backgroundColor: selectedArticle?.id === article.id ? '#006B3F' : '#E9ECEF',
                        color: selectedArticle?.id === article.id ? 'white' : '#006B3F',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        marginBottom: '8px'
                      }}>
                        Article {article.article_number}
                      </span>
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        marginBottom: '4px',
                        color: selectedArticle?.id === article.id ? '#006B3F' : '#212529'
                      }}>
                        {article.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6c757d', lineHeight: '1.4' }}>
                        {article.full_text.substring(0, 100)}...
                      </p>
                    </div>
                    <FiChevronRight style={{ color: '#adb5bd', marginTop: '4px' }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Article Viewer Panel */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid #f0f0f0'
        }}>
          {selectedArticle ? (
            <>
              <div style={{ 
                padding: '20px 24px', 
                background: 'linear-gradient(135deg, #006B3F 0%, #008C52 100%)',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <FiBookOpen size={24} />
                  <span style={{ fontSize: '14px', opacity: 0.9 }}>Constitution of Kenya</span>
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
                  Article {selectedArticle.article_number}
                </h2>
                <p style={{ fontSize: '16px', opacity: 0.9 }}>{selectedArticle.title}</p>
              </div>
              
              <div style={{ padding: '24px' }}>
                {/* Full Text Section */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#6c757d',
                    marginBottom: '12px'
                  }}>
                    Full Text
                  </h3>
                  <div style={{ 
                    padding: '20px', 
                    backgroundColor: '#F8F9FA', 
                    borderRadius: '8px',
                    lineHeight: '1.8',
                    fontSize: '15px',
                    color: '#333'
                  }}>
                    {selectedArticle.full_text}
                  </div>
                </div>

                {/* Simplified Explanation Section */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#6c757d',
                    marginBottom: '12px'
                  }}>
                    <FiInfo style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                    Simplified Explanation
                  </h3>
                  <div style={{ 
                    padding: '20px', 
                    backgroundColor: '#E8F5E9', 
                    borderRadius: '8px',
                    lineHeight: '1.7',
                    fontSize: '15px',
                    color: '#1a3c2a',
                    borderLeft: '4px solid #006B3F'
                  }}>
                    {selectedArticle.simplified_english}
                  </div>
                </div>

                {/* Swahili Version (if available) */}
                {selectedArticle.simplified_swahili && (
                  <div>
                    <h3 style={{ 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: '#6c757d',
                      marginBottom: '12px'
                    }}>
                      Kiswahili
                    </h3>
                    <div style={{ 
                      padding: '20px', 
                      backgroundColor: '#FFF8E7', 
                      borderRadius: '8px',
                      lineHeight: '1.7',
                      fontSize: '15px',
                      color: '#5c431c',
                      borderLeft: '4px solid #D4A017'
                    }}>
                      {selectedArticle.simplified_swahili}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '60px 40px',
              textAlign: 'center'
            }}>
              <FiBookOpen size={64} color="#dee2e6" style={{ marginBottom: '20px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#495057' }}>
                Select an Article
              </h3>
              <p style={{ color: '#6c757d', maxWidth: '300px' }}>
                Click on any article from the list to read its full text and simplified explanation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConstitutionSearch;
