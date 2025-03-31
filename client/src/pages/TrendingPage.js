import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const TrendingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get('/api/products/trending');
        setProducts(response.data);
        
        // Extract unique categories from products
        const uniqueCategories = [...new Set(response.data.map(product => product.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to fetch trending products';
        setError(errorMsg);
        console.error('Error fetching trending products:', error);
        setLoading(false);
      }
    };
    
    fetchTrendingProducts();
  }, []);
  
  // Filter products by category if a filter is selected
  const filteredProducts = filterCategory
    ? products.filter(product => product.category === filterCategory)
    : products;
  
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
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Trending Products</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover the most popular products with significant price drops
          </p>
        </div>
        
        {/* Category filter */}
        <div className="mt-6 flex justify-center">
          <div className="inline-flex shadow-sm rounded-md">
            <button
              type="button"
              onClick={() => setFilterCategory('')}
              className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                !filterCategory ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            {categories.map((category, index) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilterCategory(category)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  index === categories.length - 1 ? 'rounded-r-md' : ''
                } ${
                  filterCategory === category ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No trending products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filterCategory ? `No products in the ${filterCategory} category` : 'Check back later for trending products'}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingPage; 