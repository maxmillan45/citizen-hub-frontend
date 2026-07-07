// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import CompleteProfile from './components/CompleteProfile';
import ConstitutionSearch from './components/ConstitutionSearch';
import Chatbot from './components/Chatbot';
import History from './components/History';
import FAQ from './components/FAQ';
import MPList from './components/MPList';
import Voting from './components/Voting';
import Crime from './components/Crime';
import Events from './components/Events';
import Footer from './components/Footer';
import DidYouKnow from './components/DidYouKnow';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" />;
};

// Component to handle new user redirects
const AppRedirects = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('access_token');
  const isNewUser = localStorage.getItem('is_new_user') === 'true';
  
  useEffect(() => {
    const path = location.pathname;
    
    // If user is logged in and is new user, redirect to complete-profile
    if (token && isNewUser && path !== '/complete-profile') {
      navigate('/complete-profile');
    }
    
    // If user is logged in and not new user, redirect to home if on complete-profile
    if (token && !isNewUser && path === '/complete-profile') {
      navigate('/');
    }
    
    // If user is not logged in and trying to access protected pages, redirect to login
    if (!token && path !== '/login' && path !== '/complete-profile') {
      // Allow public pages to be accessed without login
      const publicPages = ['/', '/constitution', '/history', '/faq', '/mps', '/events', '/did-you-know'];
      if (!publicPages.includes(path)) {
        navigate('/login');
      }
    }
  }, [location.pathname, token, isNewUser, navigate]);
  
  return children;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse user:', e);
        }
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('is_new_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('phone_number');
  };

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <Router>
      <AppRedirects>
        <Navbar onMenuClick={openSidebar} />
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
          user={user} 
          onLogout={handleLogout} 
        />
        <div className="main-content" onClick={closeSidebar}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/constitution" element={<ConstitutionSearch />} />
            <Route path="/history" element={<History />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/mps" element={<MPList />} />
            <Route path="/events" element={<Events />} />
            <Route path="/did-you-know" element={<DidYouKnow />} />
            
            {/* Profile - accessible only for new users */}
            <Route path="/complete-profile" element={<CompleteProfile />} />
            
            {/* Protected Routes - require login */}
            <Route path="/chatbot" element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            } />
            
            <Route path="/voting" element={
              <ProtectedRoute>
                <Voting />
              </ProtectedRoute>
            } />
            
            <Route path="/crime" element={
              <ProtectedRoute>
                <Crime />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
        <Footer />
      </AppRedirects>
    </Router>
  );
}

export default App;