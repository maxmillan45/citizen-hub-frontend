import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { askChatbot, getChatHistory } from '../services/api';
import { FiSend, FiMessageSquare, FiUser, FiCpu, FiLock } from 'react-icons/fi';

function Chatbot() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
      response.data.forEach((conv) => {
        allMessages.push({ id: conv.id, text: conv.question, sender: 'user' });
        allMessages.push({ id: `${conv.id}_answer`, text: conv.answer, sender: 'bot', sources: conv.sources });
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
    
    try {
      const response = await askChatbot(question, 'en');
      const botMessage = { 
        id: Date.now() + 1, 
        text: response.data.answer, 
        sender: 'bot', 
        sources: response.data.sources 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: 'Sorry, I could not process your question. Please try again.', 
        sender: 'bot' 
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
                  backgroundColor: msg.sender === 'user' ? '#0066cc' : 'white',
                  color: msg.sender === 'user' ? 'white' : '#333'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {msg.sender === 'user' ? <FiUser size={14} /> : <FiCpu size={14} />}
                    <strong>{msg.sender === 'user' ? 'You' : 'AI Assistant'}</strong>
                  </div>
                  <div>{msg.text}</div>
                </div>
              </div>
            ))
          )}
          {loading && <div>Thinking...</div>}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleAsk} style={{ padding: '16px 20px', display: 'flex', gap: '12px', backgroundColor: 'white' }}>
          <input
            type="text"
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
          />
          <button type="submit" disabled={loading} style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#0066cc', color: 'white' }}>
            <FiSend /> Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
