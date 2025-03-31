const axios = require('axios');
const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');
const TrackedProduct = require('../models/TrackedProduct');
const User = require('../models/User');
const { getProductParams, getRequestOptions } = require('../config/apiConfig');

/**
 * Update prices for all tracked products
 * Used by the scheduled job
 */
exports.updateProductPrices = async () => {
  try {
    // Get all products that are being tracked by at least one user
    const trackedProductIds = await TrackedProduct.distinct('product');
    const products = await Product.find({ _id: { $in: trackedProductIds } });
    
    console.log(`Updating prices for ${products.length} tracked products`);
    
    for (const product of products) {
      try {
        await updateSingleProductPrice(product);
      } catch (error) {
        console.error(`Error updating price for product ${product.asin}:`, error.message);
      }
    }
    
    return { success: true, message: `Updated prices for ${products.length} products` };
  } catch (error) {
    console.error('Error in batch price update:', error);
    throw error;
  }
};

/**
 * Update price for a single product
 * @param {Object} product - Product document
 */
const updateSingleProductPrice = async (product) => {
  try {
    // Fetch latest product data from API
    const params = getProductParams(product.asin);
    const options = getRequestOptions(params);
    
    const response = await axios.request(options);
    
    if (!response.data || !response.data.product) {
      throw new Error('Invalid API response');
    }
    
    const apiProduct = response.data.product;
    const newPrice = apiProduct.buybox_winner?.price?.value || 0;
    const originalPrice = apiProduct.price?.before_price?.value || newPrice;
    const discount = originalPrice > newPrice 
      ? Math.round(((originalPrice - newPrice) / originalPrice) * 100) 
      : 0;
    
    // Skip if price hasn't changed
    if (product.currentPrice === newPrice) {
      console.log(`Price unchanged for ${product.asin}, skipping update`);
      return;
    }
    
    // Update product
    product.currentPrice = newPrice;
    product.originalPrice = originalPrice;
    product.discount = discount;
    product.lastUpdated = new Date();
    
    await product.save();
    
    // Add new price history entry
    const priceEntry = new PriceHistory({
      product: product._id,
      price: newPrice,
      currency: product.currency,
      discount: discount
    });
    
    await priceEntry.save();
    
    // Check if this is lowest price and update if needed
    await checkLowestPrice(product._id);
    
    // Send alerts to users if price has dropped significantly
    if (product.currentPrice < product.originalPrice) {
      await sendPriceAlerts(product);
    }
    
    console.log(`Updated price for ${product.asin}: $${newPrice}`);
  } catch (error) {
    console.error(`Error updating price for ${product.asin}:`, error);
    throw error;
  }
};

/**
 * Check if current price is the lowest and update price history
 * @param {ObjectId} productId - Product ID
 */
const checkLowestPrice = async (productId) => {
  try {
    const priceHistory = await PriceHistory.find({ product: productId })
      .sort({ price: 1 })
      .limit(1);
    
    if (priceHistory.length === 0) return;
    
    const lowestPrice = priceHistory[0];
    
    // Reset all isLowestPrice flags
    await PriceHistory.updateMany(
      { product: productId }, 
      { $set: { isLowestPrice: false } }
    );
    
    // Set lowest price
    await PriceHistory.findByIdAndUpdate(
      lowestPrice._id,
      { $set: { isLowestPrice: true } }
    );
  } catch (error) {
    console.error('Error checking lowest price:', error);
  }
};

/**
 * Send price drop alerts to users tracking this product
 * @param {Object} product - Product with updated price
 */
const sendPriceAlerts = async (product) => {
  try {
    // Find all users tracking this product with alerts enabled
    const trackedProducts = await TrackedProduct.find({
      product: product._id,
      alertEnabled: true
    }).populate('user');
    
    for (const tracked of trackedProducts) {
      const user = tracked.user;
      const thresholdPercentage = tracked.alertThreshold || user.priceAlertThreshold || 10;
      
      // Calculate price drop percentage
      const priceDrop = (product.originalPrice - product.currentPrice) / product.originalPrice * 100;
      
      // If price drop exceeds threshold or drops below target price, send alert
      const exceedsDropThreshold = priceDrop >= thresholdPercentage;
      const belowTargetPrice = tracked.targetPrice && product.currentPrice <= tracked.targetPrice;
      
      if (exceedsDropThreshold || belowTargetPrice) {
        await sendAlertNotification(user, product, priceDrop);
      }
    }
  } catch (error) {
    console.error('Error sending price alerts:', error);
  }
};

/**
 * Send actual notification to user (email, push, etc.)
 * @param {Object} user - User to notify
 * @param {Object} product - Product with price drop
 * @param {number} priceDrop - Percentage price drop
 */
const sendAlertNotification = async (user, product, priceDrop) => {
  // This would connect to your notification service (email, push, etc.)
  console.log(`ALERT: Notifying ${user.email} about ${Math.round(priceDrop)}% price drop for ${product.title}`);
  
  // In a real implementation, you would send an email or push notification
  // For this example, we'll just log it
};

/**
 * Get price history for a product
 * @route GET /api/tracking/price-history/:productId
 */
exports.getPriceHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    const { period } = req.query; // period can be '7d', '30d', '90d', 'all'
    
    let dateFilter = {};
    const now = new Date();
    
    if (period === '7d') {
      dateFilter = { date: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
    } else if (period === '30d') {
      dateFilter = { date: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
    } else if (period === '90d') {
      dateFilter = { date: { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) } };
    }
    
    const priceHistory = await PriceHistory.find({ 
      product: productId,
      ...dateFilter 
    }).sort({ date: 1 });
    
    return res.status(200).json(priceHistory);
  } catch (error) {
    console.error('Error fetching price history:', error);
    return res.status(500).json({ 
      message: 'Error fetching price history',
      error: error.message 
    });
  }
}; 