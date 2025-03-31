import axios from 'axios';

// Base API URL - change this to point to your backend server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/api/users/login',
    register: '/api/users/register',
    profile: '/api/users/profile',
    updateProfile: '/api/users/profile',
    updatePassword: '/api/users/password',
  },
  
  // Products endpoints
  products: {
    search: '/api/products/search',
    trending: '/api/products/trending',
    tracked: '/api/products/tracked',
    trackProduct: (productId) => `/api/products/track/${productId}`,
    untrackProduct: (productId) => `/api/products/tracked/${productId}`,
    details: (productId) => `/api/products/${productId}`,
    priceHistory: (productId) => `/api/products/${productId}/price-history`,
  },
};

// Dummy data for development/testing
export const dummyData = {
  user: {
    _id: 'user123',
    name: 'Test User',
    email: 'testuser@example.com',
  },
  products: [
    {
      _id: 'prod1',
      asin: 'B08N5KWB9H',
      title: 'Test Product 1',
      currentPrice: 99.99,
      originalPrice: 129.99,
      discount: 23,
      imageUrl: 'https://via.placeholder.com/300',
      productUrl: 'https://amazon.com/dp/B08N5KWB9H',
      rating: 4.5,
      reviewCount: 1250,
      store: 'Amazon',
      category: 'Electronics'
    },
    {
      _id: 'prod2',
      asin: 'B08N5LNQCX',
      title: 'Test Product 2',
      currentPrice: 49.99,
      originalPrice: 69.99,
      discount: 28,
      imageUrl: 'https://via.placeholder.com/300',
      productUrl: 'https://amazon.com/dp/B08N5LNQCX',
      rating: 4.2,
      reviewCount: 853,
      store: 'Amazon',
      category: 'Home & Kitchen'
    },
    {
      _id: 'prod3',
      asin: 'B08N5M7R6P',
      title: 'Test Product 3',
      currentPrice: 199.99,
      originalPrice: 249.99,
      discount: 20,
      imageUrl: 'https://via.placeholder.com/300',
      productUrl: 'https://amazon.com/dp/B08N5M7R6P',
      rating: 4.7,
      reviewCount: 2105,
      store: 'Amazon',
      category: 'Electronics'
    },
  ]
};

// Helper function to use dummy data in development
export const useDummyData = process.env.REACT_APP_USE_DUMMY_DATA === 'true';

export default api;