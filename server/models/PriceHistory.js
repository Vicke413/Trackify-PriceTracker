const mongoose = require('mongoose');

const PriceHistorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  currency: {
    type: String,
    default: 'USD'
  },
  discount: {
    type: Number,
    default: 0
  },
  isLowestPrice: {
    type: Boolean,
    default: false
  }
});

// Create a compound index on product and date for efficient queries
PriceHistorySchema.index({ product: 1, date: 1 });

module.exports = mongoose.model('PriceHistory', PriceHistorySchema); 