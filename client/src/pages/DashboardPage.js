import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import apiService, { isDummyApiEnabled } from '../services/apiService';

const DashboardPage = () => {
  const [trackedProducts, setTrackedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTrackedProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Authentication token not found. Please login again.');
          setLoading(false);
          return;
        }
        
        // Use the apiService instead of direct axios calls
        const response = await apiService.products.tracked();
        
        setTrackedProducts(response.data);
        setLoading(false);
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to fetch tracked products';
        setError(errorMsg);
        console.error('Error fetching tracked products:', error);
        setLoading(false);
      }
    };
    
    fetchTrackedProducts();
  }, []);
  
  const handleUntrackProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }
      
      // Use the apiService instead of direct axios calls
      await apiService.products.untrackProduct(productId);
      
      // Remove the untracked product from state
      setTrackedProducts(trackedProducts.filter(product => product._id !== productId));
      
      toast.success('Product untracked successfully');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to untrack product';
      toast.error(errorMsg);
      console.error('Error untracking product:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <Link to="/login" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Go to Login
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Demo mode indicator */}
        {isDummyApiEnabled() && (
          <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 7a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Demo Mode:</span> Using dummy data for product tracking.
                </p>
              </div>
            </div>
          </div>
        )}
      
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Your Tracked Products</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Monitor price changes and get notified when prices drop
          </p>
        </div>
        
        {trackedProducts.length === 0 ? (
          <div className="mt-12 text-center">
            <div className="rounded-md bg-gray-50 px-6 py-5 sm:py-6">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tracked products</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by tracking your first product.</p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Find Products to Track
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {trackedProducts.map((product) => (
              <div key={product._id} className="relative">
                <ProductCard product={product} />
                <button
                  onClick={() => handleUntrackProduct(product._id)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1.5 rounded-full -mt-2 -mr-2 shadow-lg hover:bg-red-600 focus:outline-none"
                  title="Untrack product"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage; 