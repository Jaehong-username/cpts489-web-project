import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../index.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // Check login status when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || userData.username || '');
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setIsLoggedIn(false);
    setUserName('');
    
    // Redirect to home page
    navigate('/');
    
    // Optional: Show logout success message
    alert('You have been successfully logged out');
  };

  return (
    <header className="site-header">
      <h1><span>Trucker Broker</span></h1>
   
      <div className="nav-bar">
        <hr></hr>
        <ul className="nav-list">
          <li className="nav-item rounded"><Link to="/">Home</Link></li>
          <li className="nav-item rounded"><Link to="/about">About</Link></li>
          <li className="nav-item rounded"><Link to="/truckers">Truckers</Link></li>
          <li className="nav-item rounded"><Link to="/brokers">Brokers</Link></li>
          <li className="nav-item rounded"><Link to="/brokerages">Brokerages</Link></li>
          <li className="nav-item rounded"><Link to="/reviews">Review</Link></li>
          <li className="nav-item rounded"><Link to="/contact">Contact</Link></li>
          <li className="nav-item rounded"><Link to="/loadboards">Load Board</Link></li>
          
          {isLoggedIn && (
            <li className="nav-item rounded logout-btn">
              <button 
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  font: 'inherit',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Logout {userName ? `(${userName})` : ''}
              </button>
            </li>
          )}
        </ul>
        <hr></hr>
      </div>
    </header>
  );
}

export default Header;