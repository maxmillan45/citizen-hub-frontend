import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { askChatbot, getChatHistory } from '../services/api';
import { FiSend, FiMessageSquare, FiUser, FiCpu } from 'react-icons/fi';

function Chatbot() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      loadHistory();
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadHistory = async () => {
    try {
      const response = await getChatHistory();
      const allMessages = [];
      response.data.forEach((conv) => {
        allMessages.push({ 
          id: conv.id, 
          text: conv.question, 
          sender: 'user', 
          timestamp: conv.created_at 
        });
        allMessages.push({ 
          id: `${conv.id}_answer`, 
          text: conv.answer, 
          sender: 'bot', 
          timestamp: conv.created_at,
          sources: conv.sources 
        });
      });
      setMessages(allMessages);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      text: question, 
      sender: 'user', 
      timestamp: new Date() 
    };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await askChatbot(question, 'en');
      const botMessage = { 
        id: Date.now() + 1, 
        text: response.data.answer, 
        sender: 'bot', 
        timestamp: new Date(),
        sources: response.data.sources 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const errorMessage = { 
        id: Date.now() + 1, 
        text: 'Sorry, I could not process your question. Please try again.', 
        sender: 'bot', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    'What are my rights if arrested by police?',
    'Can police search my phone without a warrant?',
    'What is the right to privacy under the Constitution?',
    'Can the government take my land?',
    'What are my rights as an employee?',
    'How do I access government information?',
  ];

  const handleExampleClick = (example) => {
    setQuestion(example);
  };

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
            <FiCpu size={32} color="#D4A017" />
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
      <p className="text-muted" style={{ marginBottom: '32px' }}>
        Ask any question about your constitutional rights. Get answers based on the Constitution of Kenya 2010.
      </p>

      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #f0f0f0',
        marginBottom: '24px'
      }}>
        <div style={{ 
          height: '450px', 
          overflowY: 'auto', 
          padding: '24px',
          backgroundColor: '#F8F9FA'
        }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <FiMessageSquare size={48} color="#dee2e6" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#495057' }}>How can I help you today?</h3>
              <p style={{ color: '#6c757d', marginBottom: '24px' }}>
                Ask me anything about the Kenyan Constitution and your legal rights
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {exampleQuestions.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'white',
                      border: '1px solid #dee2e6',
                      borderRadius: '20px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E8F5E9';
                      e.currentTarget.style.borderColor = '#006B3F';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = '#dee2e6';
                    }}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '16px'
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    {msg.sender === 'user' ? (
                      <FiUser size={14} color="#006B3F" />
                    ) : (
                      <FiCpu size={14} color="#BB0000" />
                    )}
                    <span style={{ fontSize: '11px', color: '#999' }}>
                      {msg.sender === 'user' ? 'You' : 'AI Legal Assistant'}
                    </span>
                  </div>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: msg.sender === 'user' ? '#006B3F' : 'white',
                    color: msg.sender === 'user' ? 'white' : '#333',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    wordWrap: 'break-word'
                  }}>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                      {msg.text}
                    </div>
                    {msg.sources && msg.sources.length > 0 && (
                      <div style={{ 
                        fontSize: '10px', 
                        marginTop: '8px', 
                        paddingTop: '8px',
                        borderTop: '1px solid rgba(0,0,0,0.1)',
                        color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#999'
                      }}>
                        Sources: Articles {msg.sources.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
              <div style={{ padding: '12px 16px', borderRadius: '12px', backgroundColor: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ animation: 'pulse 1.5s infinite' }}>●</span>
                  <span style={{ animation: 'pulse 1.5s infinite 0.3s' }}>●</span>
                  <span style={{ animation: 'pulse 1.5s infinite 0.6s' }}>●</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleAsk} style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid #f0f0f0',
          display: 'flex',
          gap: '12px',
          backgroundColor: 'white'
        }}>
          <textarea
            className="input-field"
            rows="2"
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk(e);
              }
            }}
            style={{ resize: 'none', flex: 1 }}
          />
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px' }}
          >
            <FiSend size={16} />
            Send
          </button>
        </form>
      </div>

      <div style={{ 
        padding: '16px', 
        backgroundColor: '#FFF8E7', 
        borderRadius: '8px',
        borderLeft: '4px solid #D4A017',
        fontSize: '13px',
        color: '#666'
      }}>
        <strong>Note:</strong> This AI Legal Assistant provides information based on the Constitution of Kenya 2010. 
        For specific legal advice, please consult a qualified lawyer.
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default Chatbot;
