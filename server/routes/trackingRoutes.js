const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
const priceController = require('../controllers/priceController');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get price history for a product
router.get('/price-history/:productId', priceController.getPriceHistory);

// Track a product
router.post('/', trackingController.trackProduct);

// Get all tracked products for a user
router.get('/', trackingController.getTrackedProducts);

// Update tracked product settings
router.put('/:id', trackingController.updateTrackedProduct);

// Stop tracking a product
router.delete('/:id', trackingController.stopTracking);

module.exports = router; 