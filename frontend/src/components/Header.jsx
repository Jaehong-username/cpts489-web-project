import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

function Header() {
  return (
    <header className="site-header">
      <h1><en>Trucker Broker</en></h1>
    
        <div class = "nav-bar">
            <hr></hr>
            <ul class = "nav-list">
                
                <li class = "nav-item rounded"><Link to="/">Home</Link></li>

                <li class = "nav-item rounded"><Link to="/about">About</Link></li>
                
                <li class = "nav-item rounded"><Link to="/truckers">Truckers</Link></li>
                
                <li class = "nav-item rounded"><Link to="/brokers">Brokers</Link></li>
                
                <li class = "nav-item rounded"><Link to="/brokerages">Brokerages</Link></li>
                
                <li class = "nav-item rounded"><Link to="/reviews">Review</Link></li>
                
                <li class = "nav-item rounded"><Link to="/contact">Contact</Link></li>

                <li class = "nav-item rounded"><Link to="/loadboards">Load Board</Link></li>
                
                
            </ul>
            <hr></hr>
        </div>
    </header>
  );
}

export default Header;