import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { askChatbot, getChatHistory } from '../services/api';
import { FiSend, FiMessageSquare, FiUser, FiCpu, FiLock, FiAlertCircle } from 'react-icons/fi';

function Chatbot() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      loadHistory();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const response = await getChatHistory();
      const allMessages = [];
      const history = response.data || [];
      history.forEach((conv) => {
        allMessages.push({ id: conv.id, text: conv.question, sender: 'user' });
        allMessages.push({ id: `${conv.id}_answer`, text: conv.answer, sender: 'bot', sources: conv.sources || [] });
      });
      setMessages(allMessages);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || !isAuthenticated) return;
    
    const userMessage = { id: Date.now(), text: question, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);
    setError(null);
    
    try {
      const response = await askChatbot(question, 'en');
      const botMessage = { 
        id: Date.now() + 1, 
        text: response.data.answer, 
        sender: 'bot', 
        sources: response.data.sources || [] 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chatbot error:', err);
      
      // Extract meaningful error message
      let errorMessage = 'Sorry, I could not process your question. Please try again.';
      
      if (err.response) {
        // Server responded with error
        if (err.response.status === 401) {
          errorMessage = 'Your session has expired. Please login again.';
          setIsAuthenticated(false);
          localStorage.removeItem('access_token');
        } else if (err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        // Other errors
        errorMessage = err.message || 'Something went wrong. Please try again.';
      }
      
      setError(errorMessage);
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: errorMessage, 
        sender: 'bot',
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px', textAlign: 'center' }}>
        <div style={{
          maxWidth: '400px',
          margin: '0 auto',
          padding: '48px 24px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#FFF8E7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <FiLock size={32} color="#D4A017" />
          </div>
          <h2 style={{ marginBottom: '12px' }}>Login Required</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Please login to access the AI Legal Assistant.
          </p>
          <Link to="/login" style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#006B3F',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '500'
          }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      <h1 className="heading-1">AI Legal Assistant</h1>
      <p className="text-muted">Ask any question about your constitutional rights</p>
      
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        overflow: 'hidden',
        border: '1px solid #f0f0f0'
      }}>
        <div style={{ height: '450px', overflowY: 'auto', padding: '24px', backgroundColor: '#F8F9FA' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <FiMessageSquare size={48} color="#dee2e6" />
              <h3>How can I help you today?</h3>
              <p style={{ color: '#666', marginTop: '8px' }}>
                Ask about your rights, the constitution, or legal procedures
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: msg.sender === 'user' ? '#006B3F' : 'white',
                  color: msg.sender === 'user' ? 'white' : '#333',
                  border: msg.isError ? '1px solid #ffebee' : 'none'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {msg.sender === 'user' ? <FiUser size={14} /> : <FiCpu size={14} />}
                    <strong>{msg.sender === 'user' ? 'You' : 'AI Assistant'}</strong>
                    {msg.isError && <FiAlertCircle size={14} color="#c62828" />}
                  </div>
                  <div style={{ 
                    color: msg.isError ? '#c62828' : 'inherit',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}
                  </div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div style={{ 
                      marginTop: '8px', 
                      display: 'flex', 
                      gap: '6px', 
                      flexWrap: 'wrap' 
                    }}>
                      <span style={{ fontSize: '11px', color: '#666' }}>Sources:</span>
                      {msg.sources.map((source, i) => (
                        <span key={i} style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          backgroundColor: '#e3f2fd',
                          borderRadius: '4px',
                          color: '#1565c0'
                        }}>
                          Article {source}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '16px'
            }}>
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: 'white',
                color: '#666'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiCpu size={14} />
                  <strong>AI Assistant</strong>
                  <span style={{ marginLeft: '8px' }}>
                    <span className="dot" style={{ animation: 'pulse 1.2s infinite' }}>.</span>
                    <span className="dot" style={{ animation: 'pulse 1.2s infinite 0.3s' }}>.</span>
                    <span className="dot" style={{ animation: 'pulse 1.2s infinite 0.6s' }}>.</span>
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleAsk} style={{ padding: '16px 20px', display: 'flex', gap: '12px', backgroundColor: 'white', borderTop: '1px solid #f0f0f0' }}>
          <input
            type="text"
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            style={{ 
              flex: 1, 
              padding: '12px 16px', 
              borderRadius: '8px', 
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
          />
          <button 
            type="submit" 
            disabled={loading || !question.trim()} 
            style={{ 
              padding: '12px 24px', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: loading || !question.trim() ? '#6c757d' : '#006B3F',
              color: 'white',
              cursor: loading || !question.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiSend size={16} />
            Send
          </button>
        </form>
      </div>

      <style>{`
        .dot {
          display: inline-block;
          font-size: 20px;
          font-weight: bold;
        }
        @keyframes pulse {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

export default Chatbot;