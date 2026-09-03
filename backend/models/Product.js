const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nameTamil: {
    type: String,
    required: true
  },
  nameEnglish: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  category: {
    type: String,
    trim: true,
    default: 'all'
  },
  lowStock: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
