// src/components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiBookOpen, 
  FiMessageSquare, 
  FiBookmark, 
  FiHelpCircle, 
  FiUsers, 
  FiLogOut, 
  FiLogIn,
  FiBarChart2,
  FiFlag,
  FiMapPin,
  FiShield,
  FiAward,
  FiUser
} from 'react-icons/fi';

function Sidebar({ isOpen, onClose, user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in
  const token = localStorage.getItem('access_token');
  const isLoggedIn = !!token || !!user;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('phone_number');
    localStorage.removeItem('is_new_user');
    if (onLogout) onLogout();
    onClose();
    navigate('/');
  };

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Constitution', path: '/constitution', icon: FiBookOpen },
    { name: 'AI Legal Assistant', path: '/chatbot', icon: FiMessageSquare },
    { name: 'Kenyan History', path: '/history', icon: FiBookmark },
    { name: 'Legal FAQ', path: '/faq', icon: FiHelpCircle },
    { name: 'Parliament Scorecard', path: '/mps', icon: FiUsers },
    { name: 'Voting Verification', path: '/voting', icon: FiBarChart2 },
    { name: 'Crime Reporting', path: '/crime', icon: FiFlag },
    { name: 'Public Events', path: '/events', icon: FiMapPin },
    { name: 'Profile', path: '/profile', icon: FiAward },
  ];

  // Get user info for display
  const userData = user || JSON.parse(localStorage.getItem('user') || 'null');
  const displayName = userData?.first_name || userData?.phone_number || '';

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">Citizen Hub Kenya</div>
          <div className="sidebar-tagline">Empowering Citizens</div>
        </div>

        <div className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="sidebar-nav-icon"><Icon size={20} /></span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {isLoggedIn && displayName && (
          <div className="sidebar-user">
            <div className="sidebar-user-phone">{displayName}</div>
            <div className="sidebar-user-label">Logged In</div>
          </div>
        )}

        <button 
          className="sidebar-logout" 
          onClick={isLoggedIn ? handleLogout : handleLogin}
        >
          {isLoggedIn ? (
            <><FiLogOut size={16} /> Sign Out</>
          ) : (
            <><FiLogIn size={16} /> Sign In</>
          )}
        </button>
      </div>

      <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
    </>
  );
}

export default Sidebar;