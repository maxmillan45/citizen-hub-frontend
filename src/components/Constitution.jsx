import React, { useState } from 'react';
import { searchConstitution, getArticle } from '../services/api';

function Constitution() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
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

  const handleViewArticle = async (number) => {
    setLoading(true);
    try {
      const response = await getArticle(number);
      setSelectedArticle(response.data);
    } catch (err) {
      console.error('Failed to load article:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '48px' }}>
      <h1>Constitution of Kenya 2010</h1>
      <p>Search and browse the constitution</p>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search constitution..." onKeyPress={(e) => e.key === 'Enter' && handleSearch()} style={{ flex: 1, padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }} />
        <button onClick={handleSearch} disabled={loading} className="btn-primary">Search</button>
      </div>
      
      {selectedArticle ? (
        <div>
          <button onClick={() => setSelectedArticle(null)} style={{ marginBottom: '16px' }}>← Back to results</button>
          <div className="card">
            <h2>Article {selectedArticle.article_number}</h2>
            <h4>{selectedArticle.title}</h4>
            <div dangerouslySetInnerHTML={{ __html: selectedArticle.full_text }} />
          </div>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-2">
          {results.map(article => (
            <div key={article.id} className="card" onClick={() => handleViewArticle(article.article_number)} style={{ cursor: 'pointer' }}>
              <h3>Article {article.article_number}</h3>
              <p>{article.title}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Constitution;
