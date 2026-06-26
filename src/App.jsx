import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const savedUser = localStorage.getItem('user');
      const savedIsNewUser = localStorage.getItem('is_new_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error('Failed to parse user:', e);
        }
      }
      if (savedIsNewUser === 'true') {
        setIsNewUser(true);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.is_new_user) {
      setIsNewUser(true);
      localStorage.setItem('is_new_user', 'true');
    } else {
      setIsNewUser(false);
      localStorage.setItem('is_new_user', 'false');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsNewUser(false);
    localStorage.removeItem('user');
    localStorage.removeItem('is_new_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('phone_number');
  };

  const handleProfileComplete = () => {
    setIsNewUser(false);
    localStorage.setItem('is_new_user', 'false');
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <Router>
      <div className="kenya-pattern"></div>
      <div className="kenya-flag">
        <div className="flag-black"></div>
        <div className="flag-red"></div>
        <div className="flag-green"></div>
      </div>

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
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/complete-profile" element={
            <ProtectedRoute>
              <CompleteProfile onComplete={handleProfileComplete} />
            </ProtectedRoute>
          } />
          
          <Route path="/constitution" element={<ConstitutionSearch />} />
          <Route path="/chatbot" element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          } />
          <Route path="/history" element={<History />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/mps" element={<MPList />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/crime" element={
            <ProtectedRoute>
              <Crime />
            </ProtectedRoute>
          } />
          <Route path="/events" element={<Events />} />
          <Route path="/did-you-know" element={<DidYouKnow />} />
        </Routes>
      </div>
      
      <Footer />
    </Router>
  );
}

export default App;