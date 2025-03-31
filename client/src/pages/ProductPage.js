import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-hot-toast';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProductPage = () => {
  const { asin } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetPrice, setTargetPrice] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [historyPeriod, setHistoryPeriod] = useState('30d');
  
  // Check if user is authenticated
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${asin}`);
        setProduct(response.data.product);
        setPriceHistory(response.data.priceHistory);
        
        // Check if user is tracking this product
        if (isAuthenticated) {
          try {
            const trackingResponse = await axios.get('/api/tracking', {
              headers: { 'x-auth-token': token }
            });
            
            const isProductTracked = trackingResponse.data.some(
              item => item.product._id === response.data.product._id
            );
            
            setIsTracking(isProductTracked);
          } catch (err) {
            console.error('Error checking tracking status:', err);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Error fetching product details. Please try again.');
        setLoading(false);
        console.error('Error fetching product:', err);
      }
    };
    
    fetchProductDetails();
  }, [asin, isAuthenticated, token]);
  
  // Fetch price history with different time periods
  useEffect(() => {
    const fetchPriceHistory = async () => {
      if (!product) return;
      
      try {
        const response = await axios.get(`/api/tracking/price-history/${product._id}?period=${historyPeriod}`, {
          headers: { 'x-auth-token': token }
        });
        
        setPriceHistory(response.data);
      } catch (err) {
        console.error('Error fetching price history:', err);
      }
    };
    
    if (isAuthenticated && product) {
      fetchPriceHistory();
    }
  }, [historyPeriod, product, token, isAuthenticated]);
  
  const handleTrackProduct = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to track products');
      navigate('/login', { state: { from: `/product/${asin}` } });
      return;
    }
    
    try {
      await axios.post('/api/tracking', {
        productId: product._id,
        targetPrice: targetPrice ? parseFloat(targetPrice) : null
      }, {
        headers: { 'x-auth-token': token }
      });
      
      setIsTracking(true);
      toast.success('Product is now being tracked!');
    } catch (err) {
      toast.error('Error tracking product. Please try again.');
      console.error('Error tracking product:', err);
    }
  };
  
  const handleStopTracking = async () => {
    try {
      // First get the tracking ID
      const trackingResponse = await axios.get('/api/tracking', {
        headers: { 'x-auth-token': token }
      });
      
      const trackedProduct = trackingResponse.data.find(
        item => item.product._id === product._id
      );
      
      if (trackedProduct) {
        await axios.delete(`/api/tracking/${trackedProduct._id}`, {
          headers: { 'x-auth-token': token }
        });
        
        setIsTracking(false);
        toast.success('Product is no longer being tracked');
      }
    } catch (err) {
      toast.error('Error updating tracking status. Please try again.');
      console.error('Error updating tracking:', err);
    }
  };
  
  // Prepare chart data
  const chartData = {
    labels: priceHistory.map(entry => {
      const date = new Date(entry.date);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'Price History',
        data: priceHistory.map(entry => entry.price),
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Price: $${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/3 p-4 flex justify-center">
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="max-h-80 object-contain"
            />
          </div>
          
          {/* Product Details */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            )}
            
            {/* Price */}
            <div className="mb-4">
              <div className="flex items-center">
                {product.discount > 0 && (
                  <span className="text-lg text-gray-500 line-through mr-2">
                    ${product.originalPrice?.toFixed(2)}
                  </span>
                )}
                <span className="text-3xl font-bold text-gray-900">
                  ${product.currentPrice?.toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {product.availability}
              </p>
            </div>
            
            {/* Track Product */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              {isTracking ? (
                <div>
                  <p className="text-green-600 font-medium mb-2">
                    ✓ You are tracking this product
                  </p>
                  <button
                    onClick={handleStopTracking}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Stop Tracking
                  </button>
                </div>
              ) : (
                <div>
                  <p className="font-medium mb-2">Track this product for price drops</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="number"
                      placeholder="Target price (optional)"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      className="border rounded px-3 py-2 w-full sm:w-48"
                    />
                    <button
                      onClick={handleTrackProduct}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Track Price
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Buy Now Button */}
            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center text-gray-900 font-bold py-3 px-4 rounded transition-colors mb-4"
            >
              Buy Now on {product.store || 'Amazon'}
            </a>
          </div>
        </div>
        
        {/* Price History Chart */}
        <div className="p-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Price History</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setHistoryPeriod('7d')}
                className={`px-3 py-1 rounded ${historyPeriod === '7d' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setHistoryPeriod('30d')}
                className={`px-3 py-1 rounded ${historyPeriod === '30d' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                30 Days
              </button>
              <button
                onClick={() => setHistoryPeriod('90d')}
                className={`px-3 py-1 rounded ${historyPeriod === '90d' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                90 Days
              </button>
              <button
                onClick={() => setHistoryPeriod('all')}
                className={`px-3 py-1 rounded ${historyPeriod === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                All
              </button>
            </div>
          </div>
          
          {priceHistory.length > 1 ? (
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="bg-gray-100 p-4 rounded text-center">
              <p>Not enough price history data available yet.</p>
              <p className="text-sm text-gray-600">Track this product to start collecting price history.</p>
            </div>
          )}
        </div>
        
        {/* Product Description */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-bold mb-4">Product Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
        </div>
        
        {/* Product Features */}
        {product.features && product.features.length > 0 && (
          <div className="p-6 border-t">
            <h2 className="text-xl font-bold mb-4">Features</h2>
            <ul className="list-disc pl-5 space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage; 