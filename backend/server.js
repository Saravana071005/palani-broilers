const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

require('dotenv').config();

const Product = require('./models/Product');
const Contact = require('./models/Contact');

const app = express();
const PORT = process.env.PORT || 5000;


// ==================== CORS ====================

app.use(cors({
  origin: [
    'https://palani-broilers-admin.vercel.app',
    'https://palani-broilers.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());


// ==================== CLOUDINARY ====================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// ==================== MULTER ====================

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});


// ==================== MONGODB ====================

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


// ==================== ROOT ROUTE ====================

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


// ==================== CLOUDINARY UPLOAD ====================

function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'palani-broilers/products',
        resource_type: 'image'
      },

      (error, result) => {

        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }

      }
    );

    stream.end(file.buffer);
  });
}


// ============================================================
//                         PRODUCT ROUTES
// ============================================================


// GET ALL PRODUCTS

app.get('/api/products', async (req, res) => {

  try {

    const products = await Product.find()
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {

    console.error('Error fetching products:', error);

    res.status(500).json({
      message: error.message
    });

  }

});


// GET ONE PRODUCT

app.get('/api/products/:id', async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {

      return res.status(404).json({
        message: 'Product not found'
      });

    }

    res.json(product);

  } catch (error) {

    console.error('Error fetching product:', error);

    res.status(500).json({
      message: error.message
    });

  }

});


// CREATE PRODUCT

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

      unit: req.body.unit || 'kg',

      category: req.body.category || 'all',

      lowStock: req.body.lowStock === 'true',

      imageUrl: imageUrl

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


// UPDATE PRODUCT

app.put('/api/products/:id', upload.single('image'), async (req, res) => {

  try {

    const updateData = {

      nameTamil: req.body.nameTamil,

      nameEnglish: req.body.nameEnglish,

      price: req.body.price,

      unit: req.body.unit || 'kg',

      category: req.body.category || 'all',

      lowStock: req.body.lowStock === 'true'

    };


    if (req.file) {

      updateData.imageUrl =
        await uploadToCloudinary(req.file);

    }


    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true
        }
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


// DELETE PRODUCT

app.delete('/api/products/:id', async (req, res) => {

  try {

    const product =
      await Product.findByIdAndDelete(req.params.id);


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


// ============================================================
//                         CONTACT ROUTES
// ============================================================


// GET CONTACT

app.get('/api/contact', async (req, res) => {

  try {

    let contact = await Contact.findOne();


    if (!contact) {

      /*
       Contact.js requires mainPhone.
       Therefore we use a temporary default value
       instead of an empty string.
      */

      contact = new Contact({

        mainPhone: 'Not set',

        mainEmail: '',

        branches: []

      });

      await contact.save();

    }


    res.json(contact);

  } catch (error) {

    console.error('Error fetching contact:', error);

    res.status(500).json({
      message: error.message
    });

  }

});


// UPDATE CONTACT

app.put('/api/contact', async (req, res) => {

  try {

    let contact = await Contact.findOne();


    if (!contact) {

      contact = new Contact(req.body);

    } else {

      Object.assign(contact, req.body);

    }


    const updatedContact =
      await contact.save();


    res.json(updatedContact);

  } catch (error) {

    console.error('Error updating contact:', error);

    res.status(400).json({
      message: error.message
    });

  }

});


// ============================================================
//                       BRANCH ROUTES
// ============================================================


// ADD BRANCH

app.post('/api/contact/branches', async (req, res) => {

  try {

    let contact = await Contact.findOne();


    if (!contact) {

      contact = new Contact({

        mainPhone: 'Not set',

        mainEmail: '',

        branches: [req.body]

      });

    } else {

      contact.branches.push(req.body);

    }


    const updatedContact =
      await contact.save();


    res.json(updatedContact);

  } catch (error) {

    console.error('Error adding branch:', error);

    res.status(400).json({
      message: error.message
    });

  }

});


// UPDATE BRANCH

app.put('/api/contact/branches/:index', async (req, res) => {

  try {

    const contact = await Contact.findOne();


    if (!contact) {

      return res.status(404).json({
        message: 'Contact not found'
      });

    }


    const branchIndex =
      parseInt(req.params.index, 10);


    if (
      Number.isNaN(branchIndex) ||
      branchIndex < 0 ||
      branchIndex >= contact.branches.length
    ) {

      return res.status(404).json({
        message: 'Branch not found'
      });

    }


    contact.branches[branchIndex] = req.body;


    const updatedContact =
      await contact.save();


    res.json(updatedContact);

  } catch (error) {

    console.error('Error updating branch:', error);

    res.status(400).json({
      message: error.message
    });

  }

});


// DELETE BRANCH

app.delete('/api/contact/branches/:index', async (req, res) => {

  try {

    const contact = await Contact.findOne();


    if (!contact) {

      return res.status(404).json({
        message: 'Contact not found'
      });

    }


    const branchIndex =
      parseInt(req.params.index, 10);


    if (
      Number.isNaN(branchIndex) ||
      branchIndex < 0 ||
      branchIndex >= contact.branches.length
    ) {

      return res.status(404).json({
        message: 'Branch not found'
      });

    }


    contact.branches.splice(branchIndex, 1);


    const updatedContact =
      await contact.save();


    res.json(updatedContact);

  } catch (error) {

    console.error('Error deleting branch:', error);

    res.status(500).json({
      message: error.message
    });

  }

});


// ============================================================
//                         APK ROUTE
// ============================================================

app.get('/api/download-apk', (req, res) => {

  res.status(404).json({
    message: 'APK file is not available on Vercel'
  });

});


// ============================================================
//                         START SERVER
// ============================================================

app.listen(PORT, () => {

  console.log(
    `Server is running on port ${PORT}`
  );

});


// Export app

module.exports = app;