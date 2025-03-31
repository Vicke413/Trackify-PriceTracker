const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Search for products
router.get('/search', productController.searchProducts);

// Get product details by ASIN
router.get('/:asin', productController.getProductByAsin);

// Get trending products
router.get('/trending/list', productController.getTrendingProducts);

module.exports = router; 