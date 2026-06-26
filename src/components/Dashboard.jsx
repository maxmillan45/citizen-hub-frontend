import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, logout } from '../services/api';
import { FiUser, FiLogOut, FiHome, FiBook, FiUsers, FiCalendar, FiHelpCircle } from 'react-icons/fi';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setUser(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('phone_number');
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 20px' }}></div>
        <p style={{ color: '#6c757d' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#BB0000' }}>{error}</p>
          <button onClick={fetchProfile}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#006B3F',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🇰🇪</span>
          <h2 style={{ color: 'white', margin: 0, fontSize: '20px' }}>Citizen Hub</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: 'white' }}>
            <FiUser size={16} style={{ marginRight: '6px' }} />
            {user?.phone_number || 'User'}
          </span>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px'
            }}
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container" style={{ padding: '32px 24px' }}>
        <h1 style={{ marginBottom: '8px' }}>Welcome to Citizen Hub</h1>
        <p style={{ color: '#6c757d', marginBottom: '32px' }}>
          Your one-stop platform for civic engagement and legal information
        </p>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <FiBook size={32} color="#006B3F" style={{ marginBottom: '8px' }} />
            <h3 style={{ fontSize: '14px', color: '#6c757d', margin: 0 }}>Constitution</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A1A', margin: '4px 0' }}>14</p>
            <p style={{ fontSize: '12px', color: '#6c757d' }}>Articles</p>
          </div>
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <FiUsers size={32} color="#006B3F" style={{ marginBottom: '8px' }} />
            <h3 style={{ fontSize: '14px', color: '#6c757d', margin: 0 }}>MPs</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A1A', margin: '4px 0' }}>102</p>
            <p style={{ fontSize: '12px', color: '#6c757d' }}>Tracked</p>
          </div>
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <FiCalendar size={32} color="#006B3F" style={{ marginBottom: '8px' }} />
            <h3 style={{ fontSize: '14px', color: '#6c757d', margin: 0 }}>Events</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A1A', margin: '4px 0' }}>22</p>
            <p style={{ fontSize: '12px', color: '#6c757d' }}>Upcoming</p>
          </div>
          <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <FiHelpCircle size={32} color="#006B3F" style={{ marginBottom: '8px' }} />
            <h3 style={{ fontSize: '14px', color: '#6c757d', margin: 0 }}>FAQs</h3>
            <p style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A1A', margin: '4px 0' }}>52</p>
            <p style={{ fontSize: '12px', color: '#6c757d' }}>Answered</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Quick Access</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px'
          }}>
            <button
              onClick={() => navigate('/constitution')}
              style={{
                padding: '12px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
            >
              <FiBook size={20} color="#006B3F" />
              <div style={{ fontSize: '13px', marginTop: '4px' }}>Constitution</div>
            </button>
            <button
              onClick={() => navigate('/mp-list')}
              style={{
                padding: '12px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
            >
              <FiUsers size={20} color="#006B3F" />
              <div style={{ fontSize: '13px', marginTop: '4px' }}>MPs</div>
            </button>
            <button
              onClick={() => navigate('/events')}
              style={{
                padding: '12px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
            >
              <FiCalendar size={20} color="#006B3F" />
              <div style={{ fontSize: '13px', marginTop: '4px' }}>Events</div>
            </button>
            <button
              onClick={() => navigate('/faq')}
              style={{
                padding: '12px',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; }}
            >
              <FiHelpCircle size={20} color="#006B3F" />
              <div style={{ fontSize: '13px', marginTop: '4px' }}>FAQs</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;