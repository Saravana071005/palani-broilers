const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    immutable: true,
    maxlength: 100
  },
  isSystem: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

categorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', categorySchema);
