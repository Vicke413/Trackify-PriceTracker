import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/products/search`, {
          params: { query }
        });

        // Transform API response to match our product model
        if (response.data && response.data.search_results) {
          const transformedProducts = response.data.search_results
            .filter(item => item.asin && item.title)
            .map(item => ({
              asin: item.asin,
              title: item.title,
              currentPrice: item.price?.value || 0,
              originalPrice: item.price?.before_price?.value || item.price?.value || 0,
              discount: item.price?.savings_percent || 0,
              imageUrl: item.image || '',
              productUrl: item.link || '',
              rating: item.rating || 0,
              reviewCount: item.ratings_total || 0,
              store: 'Amazon'
            }));
            
          setProducts(transformedProducts);
        } else {
          setProducts([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error searching products:', err);
        setError('Failed to fetch search results. Please try again.');
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Search results for "${query}"` : 'Search Results'}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No products found</h2>
          <p className="text-gray-600">
            We couldn't find any products matching your search.
          </p>
          <p className="text-gray-600 mt-2">
            Try using different keywords or check your spelling.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.asin} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage; 