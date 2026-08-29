const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String
  },
  googleMapUrl: {
    type: String
  }
});

const contactSchema = new mongoose.Schema({
  mainPhone: {
    type: String,
    required: true
  },
  mainEmail: {
    type: String
  },
  branches: [branchSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
