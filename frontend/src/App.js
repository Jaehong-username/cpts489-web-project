import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import TruckersPage from './pages/TruckersPage.jsx';
import BrokersPage from './pages/BrokersPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoadBoard from './pages/LoadBoard.jsx';
import ReviewPage from './pages/ReviewPage.jsx';
import MessagePage from './pages/MessagePage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import TermsConditionsPage from './pages/TermsConditionsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import RequestPage from './pages/RequestPage.jsx';
import RequestDetailPage from './pages/RequestDetailPage.jsx';
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
            <Route path="/reviews" element={<ReviewPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/loadboard" element={<LoadBoard />} />
            <Route path="/messages" element={<MessagePage />} />
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="/terms-conditions" element={<TermsConditionsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/requests" element={<RequestPage />} />
            <Route path="/request-detail" element={<RequestDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;