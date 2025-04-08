import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import TruckersPage from './pages/TruckersPage.jsx';
import BrokersPage from './pages/BrokersPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoadBoard from './pages/LoadBoard.jsx';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/truckers" element={<TruckersPage />} />
            <Route path="/brokers" element={<BrokersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/loadboard" element={<LoadBoard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;