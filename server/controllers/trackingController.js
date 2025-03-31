const TrackedProduct = require('../models/TrackedProduct');
const Product = require('../models/Product');

/**
 * Track a product for a user
 * @route POST /api/tracking
 */
exports.trackProduct = async (req, res) => {
  try {
    const { productId, targetPrice, alertThreshold, notes } = req.body;
    const userId = req.user.id; // Assuming authentication middleware sets req.user
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user is already tracking this product
    let trackedProduct = await TrackedProduct.findOne({ user: userId, product: productId });
    
    if (trackedProduct) {
      return res.status(400).json({ message: 'Product already being tracked' });
    }
    
    // Create new tracked product
    trackedProduct = new TrackedProduct({
      user: userId,
      product: productId,
      targetPrice,
      alertThreshold,
      notes
    });
    
    await trackedProduct.save();
    
    return res.status(201).json({
      message: 'Product tracking started',
      trackedProduct
    });
  } catch (error) {
    console.error('Error tracking product:', error);
    return res.status(500).json({ 
      message: 'Error tracking product',
      error: error.message 
    });
  }
};

/**
 * Get all tracked products for a user
 * @route GET /api/tracking
 */
exports.getTrackedProducts = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming authentication middleware sets req.user
    
    const trackedProducts = await TrackedProduct.find({ user: userId })
      .populate('product')
      .sort({ addedAt: -1 });
    
    return res.status(200).json(trackedProducts);
  } catch (error) {
    console.error('Error fetching tracked products:', error);
    return res.status(500).json({ 
      message: 'Error fetching tracked products',
      error: error.message 
    });
  }
};

/**
 * Update tracked product settings
 * @route PUT /api/tracking/:id
 */
exports.updateTrackedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetPrice, alertEnabled, alertThreshold, notes } = req.body;
    const userId = req.user.id; // Assuming authentication middleware sets req.user
    
    // Find the tracked product and verify ownership
    const trackedProduct = await TrackedProduct.findOne({ _id: id, user: userId });
    
    if (!trackedProduct) {
      return res.status(404).json({ message: 'Tracked product not found' });
    }
    
    // Update fields
    if (targetPrice !== undefined) trackedProduct.targetPrice = targetPrice;
    if (alertEnabled !== undefined) trackedProduct.alertEnabled = alertEnabled;
    if (alertThreshold !== undefined) trackedProduct.alertThreshold = alertThreshold;
    if (notes !== undefined) trackedProduct.notes = notes;
    
    await trackedProduct.save();
    
    return res.status(200).json({
      message: 'Tracked product updated',
      trackedProduct
    });
  } catch (error) {
    console.error('Error updating tracked product:', error);
    return res.status(500).json({ 
      message: 'Error updating tracked product',
      error: error.message 
    });
  }
};

/**
 * Stop tracking a product
 * @route DELETE /api/tracking/:id
 */
exports.stopTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming authentication middleware sets req.user
    
    // Find the tracked product and verify ownership
    const trackedProduct = await TrackedProduct.findOne({ _id: id, user: userId });
    
    if (!trackedProduct) {
      return res.status(404).json({ message: 'Tracked product not found' });
    }
    
    await trackedProduct.remove();
    
    return res.status(200).json({
      message: 'Product tracking stopped'
    });
  } catch (error) {
    console.error('Error stopping product tracking:', error);
    return res.status(500).json({ 
      message: 'Error stopping product tracking',
      error: error.message 
    });
  }
}; 