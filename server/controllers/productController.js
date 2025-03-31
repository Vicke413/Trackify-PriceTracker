const axios = require('axios');
const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');
const { getSearchParams, getProductParams, getRequestOptions } = require('../config/apiConfig');

/**
 * Search for products on Amazon
 * @route GET /api/products/search
 */
exports.searchProducts = async (req, res) => {
  try {
    const { query, category, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const params = getSearchParams(query, category, page);
    const options = getRequestOptions(params);
    
    const response = await axios.request(options);
    
    if (!response.data || !response.data.search_results) {
      return res.status(404).json({ message: 'No products found' });
    }
    
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Product search error:', error);
    return res.status(500).json({ 
      message: 'Error searching products',
      error: error.message 
    });
  }
};

/**
 * Get product details by ASIN
 * @route GET /api/products/:asin
 */
exports.getProductByAsin = async (req, res) => {
  try {
    const { asin } = req.params;
    
    // Check if product exists in our database
    let product = await Product.findOne({ asin });
    
    // If product exists and was updated recently, return it
    if (product && isProductUpToDate(product.lastUpdated)) {
      // Get price history for the product
      const priceHistory = await PriceHistory.find({ product: product._id })
        .sort({ date: -1 })
        .limit(30);
      
      return res.status(200).json({
        product,
        priceHistory
      });
    }
    
    // Otherwise fetch fresh data from API
    const params = getProductParams(asin);
    const options = getRequestOptions(params);
    
    const response = await axios.request(options);
    
    if (!response.data || !response.data.product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Transform and save the product data
    const productData = transformProductData(response.data.product);
    
    if (!product) {
      // Create new product
      product = new Product(productData);
    } else {
      // Update existing product
      product.title = productData.title;
      product.description = productData.description;
      product.originalPrice = productData.originalPrice;
      product.currentPrice = productData.currentPrice;
      product.discount = productData.discount;
      product.currency = productData.currency;
      product.imageUrl = productData.imageUrl;
      product.productUrl = productData.productUrl;
      product.rating = productData.rating;
      product.reviewCount = productData.reviewCount;
      product.availability = productData.availability;
      product.features = productData.features;
      product.categories = productData.categories;
      product.lastUpdated = new Date();
    }
    
    await product.save();
    
    // Create a new price history entry
    const priceEntry = new PriceHistory({
      product: product._id,
      price: product.currentPrice,
      currency: product.currency,
      discount: product.discount
    });
    
    await priceEntry.save();
    
    // Get recent price history
    const priceHistory = await PriceHistory.find({ product: product._id })
      .sort({ date: -1 })
      .limit(30);
    
    return res.status(200).json({
      product,
      priceHistory
    });
  } catch (error) {
    console.error('Product details error:', error);
    return res.status(500).json({ 
      message: 'Error fetching product details',
      error: error.message 
    });
  }
};

/**
 * Get trending products (most tracked or highest discount)
 * @route GET /api/products/trending
 */
exports.getTrendingProducts = async (req, res) => {
  try {
    // Get products with highest discount
    const trendingProducts = await Product.find({ discount: { $gt: 0 } })
      .sort({ discount: -1, lastUpdated: -1 })
      .limit(10);
    
    return res.status(200).json(trendingProducts);
  } catch (error) {
    console.error('Trending products error:', error);
    return res.status(500).json({ 
      message: 'Error fetching trending products',
      error: error.message 
    });
  }
};

/**
 * Check if product data is recent enough (less than 24 hours old)
 * @param {Date} lastUpdated - Last update date
 * @returns {boolean} - True if recent, false if needs update
 */
const isProductUpToDate = (lastUpdated) => {
  if (!lastUpdated) return false;
  
  const now = new Date();
  const hoursSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60);
  
  return hoursSinceUpdate < 24;
};

/**
 * Transform API response to match our product model
 * @param {Object} apiProduct - Product data from API
 * @returns {Object} - Transformed product data
 */
const transformProductData = (apiProduct) => {
  const currentPrice = apiProduct.buybox_winner?.price?.value || 0;
  const originalPrice = apiProduct.price?.before_price?.value || currentPrice;
  const discount = originalPrice > currentPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) 
    : 0;
  
  return {
    title: apiProduct.title || '',
    asin: apiProduct.asin,
    description: apiProduct.description || '',
    currentPrice,
    originalPrice,
    currency: apiProduct.buybox_winner?.price?.currency || 'USD',
    discount,
    imageUrl: apiProduct.main_image?.link || '',
    productUrl: apiProduct.link || '',
    rating: apiProduct.rating,
    reviewCount: apiProduct.ratings_total,
    availability: apiProduct.buybox_winner?.availability?.type || '',
    features: apiProduct.feature_bullets || [],
    categories: apiProduct.categories?.map(cat => cat.name) || [],
    store: 'Amazon',
    lastUpdated: new Date()
  };
}; 