const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors({
  origin: [
    'https://palani-broilers-admin.vercel.app',
    'https://palani-broilers.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

require('dotenv').config({
  path: path.join(__dirname, '.env')
});


const Product = require('./models/Product');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(cors());
app.use(express.json());
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

  
// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Palani Broilers API Server',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      contact: '/api/contact',
      downloadApk: '/api/download-apk'
    },
    status: 'running'
  });
});

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'palani-broilers/products',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });
};
app.use(cors({
  origin: [
    'https://palani-broilers-admin.vercel.app',
    'https://palani-broilers.vercel.app'
  ]
}));

app.use(express.json());
// Product Routes
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = '';

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file);
    }

    const productData = {
      nameTamil: req.body.nameTamil,
      nameEnglish: req.body.nameEnglish,
      price: req.body.price,
      unit: req.body.unit,
      category: req.body.category,
      lowStock: req.body.lowStock === 'true',
      imageUrl
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({
      message: error.message
    });
  }
});

app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      nameTamil: req.body.nameTamil,
      nameEnglish: req.body.nameEnglish,
      price: req.body.price,
      unit: req.body.unit,
      category: req.body.category,
      lowStock: req.body.lowStock === 'true'
    };

    if (req.file) {
      updateData.imageUrl = await uploadToCloudinary(req.file);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      message: error.message
    });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image file if exists
    if (product.imageUrl) {
      app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      message: error.message
    });
  }
});
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Contact Routes
app.get('/api/contact', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      // Create default contact if none exists
      contact = new Contact({
        mainPhone: '',
        mainEmail: '',
        branches: []
      });
      await contact.save();
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/contact', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact(req.body);
    } else {
      Object.assign(contact, req.body);
    }
    const updatedContact = await contact.save();
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Branch management routes
app.post('/api/contact/branches', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      contact = new Contact({
        mainPhone: '',
        mainEmail: '',
        branches: [req.body]
      });
    } else {
      contact.branches.push(req.body);
    }
    const updatedContact = await contact.save();
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/contact/branches/:index', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    const branchIndex = parseInt(req.params.index);
    if (branchIndex < 0 || branchIndex >= contact.branches.length) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    contact.branches[branchIndex] = req.body;
    const updatedContact = await contact.save();
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/contact/branches/:index', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    const branchIndex = parseInt(req.params.index);
    if (branchIndex < 0 || branchIndex >= contact.branches.length) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    contact.branches.splice(branchIndex, 1);
    const updatedContact = await contact.save();
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// APK Download Route
app.get('/api/download-apk', (req, res) => {
  const apkPath = 'C:\\Users\\Admin\\Downloads\\app-release.apk';
  if (fs.existsSync(apkPath)) {
    res.download(apkPath, 'palani-broilers-app.apk');
  } else {
    res.status(404).json({ message: 'APK file not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
