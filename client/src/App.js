import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import SearchResultsPage from './pages/SearchResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import TrendingPage from './pages/TrendingPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';

// CSS imports
import './index.css';

const App = () => {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow py-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
            <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App; 