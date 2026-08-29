const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const Product = require('./models/Product');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

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

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const productData = {
      nameTamil: req.body.nameTamil,
      nameEnglish: req.body.nameEnglish,
      price: parseFloat(req.body.price),
      unit: req.body.unit || 'kg',
      category: req.body.category || 'all',
      lowStock: req.body.lowStock === 'true',
      imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
    };

    const product = new Product(productData);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      nameTamil: req.body.nameTamil,
      nameEnglish: req.body.nameEnglish,
      price: parseFloat(req.body.price),
      unit: req.body.unit || 'kg',
      category: req.body.category || 'all',
      lowStock: req.body.lowStock === 'true'
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
      const imagePath = path.join(__dirname, product.imageUrl);
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
