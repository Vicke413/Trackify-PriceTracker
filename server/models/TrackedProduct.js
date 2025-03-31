const mongoose = require('mongoose');

const TrackedProductSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  targetPrice: {
    type: Number
  },
  alertEnabled: {
    type: Boolean,
    default: true
  },
  alertThreshold: {
    type: Number,
    default: 10 // Default alert at 10% price drop
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  }
});

// Create a compound index on user and product for efficient queries
TrackedProductSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('TrackedProduct', TrackedProductSchema); 