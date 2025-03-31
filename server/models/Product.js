const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  asin: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  currency: {
    type: String,
    default: 'USD'
  },
  discount: {
    type: Number,
    default: 0
  },
  imageUrl: {
    type: String
  },
  productUrl: {
    type: String,
    required: true
  },
  rating: {
    type: Number
  },
  reviewCount: {
    type: Number
  },
  availability: {
    type: String
  },
  features: [{
    type: String
  }],
  categories: [{
    type: String
  }],
  store: {
    type: String,
    required: true,
    default: 'Amazon'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema); 