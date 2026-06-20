import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import ConstitutionSearch from './components/ConstitutionSearch';
import Chatbot from './components/Chatbot';
import History from './components/History';
import FAQ from './components/FAQ';
import MPList from './components/MPList';
import Voting from './components/Voting';
import Crime from './components/Crime';
import Events from './components/Events';
import Footer from './components/Footer';

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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/constitution" element={<ConstitutionSearch />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/history" element={<History />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/mps" element={<MPList/>} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/crime" element={<Crime />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </div>
      
      <Footer />
    </Router>
  );
}

export default App;
