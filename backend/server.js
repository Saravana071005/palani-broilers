const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const crypto = require('crypto');
require('dotenv').config({
  path: path.join(__dirname, '.env')
});

const Product = require('./models/Product');
const Contact = require('./models/Contact');
const Category = require('./models/Category');

const app = express();
let databaseConnectionPromise;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (!databaseConnectionPromise) {
    databaseConnectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    })
      .then((connection) => {
        console.log('MongoDB connected successfully');
        return connection;
      })
      .catch((error) => {
        databaseConnectionPromise = undefined;
        throw error;
      });
  }

  return databaseConnectionPromise;
}


// ================= CORS =================

const allowedOrigins = new Set([
  'https://palani-broilers.vercel.app',
  'https://palani-broilers-admin.vercel.app',
  ...((process.env.ALLOWED_ORIGINS || '').split(',')
    .map((origin) => origin.trim())
    .filter(Boolean))
]);

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.add('http://localhost:3001');
}

const ADMIN_COOKIE_NAME = 'palani_admin_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

function getCookie(req, name) {
  const cookies = req.headers.cookie || '';
  const match = cookies.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

function hash(value) {
  return crypto.createHash('sha256').update(value || '').digest();
}

function credentialsMatch(email, password) {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) return false;
  return crypto.timingSafeEqual(hash(email), hash(process.env.ADMIN_EMAIL)) &&
    crypto.timingSafeEqual(hash(password), hash(process.env.ADMIN_PASSWORD));
}

function signSession(payload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function verifySession(token) {
  if (!token || !process.env.ADMIN_SESSION_SECRET) return false;
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return false;
  const expectedSignature = crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(encodedPayload).digest('base64url');
  if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return false;
  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    return payload.sub === 'admin' && Number.isFinite(payload.exp) && payload.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req, res, next) {
  if (!verifySession(getCookie(req, ADMIN_COOKIE_NAME))) {
    return res.status(401).json({ message: 'Admin authentication is required' });
  }
  next();
}

function requireAdminOrigin(req, res, next) {
  const origin = req.get('origin');
  if (!origin || !allowedOrigins.has(origin)) {
    return res.status(403).json({ message: 'Admin request origin is not allowed' });
  }
  next();
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Origin is not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// ==================== ADMIN AUTHENTICATION ====================

app.post('/api/admin/login', requireAdminOrigin, (req, res) => {
  if (!process.env.ADMIN_SESSION_SECRET || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ message: 'Admin authentication is not configured' });
  }

  if (!credentialsMatch(req.body.email, req.body.password)) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const expiresAt = Date.now() + SESSION_DURATION_MS;
  res.cookie(ADMIN_COOKIE_NAME, signSession({ sub: 'admin', exp: expiresAt }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: SESSION_DURATION_MS,
    path: '/'
  });
  res.status(200).json({ authenticated: true });
});

app.get('/api/admin/session', requireAdminOrigin, requireAdmin, (req, res) => {
  res.json({ authenticated: true });
});

app.post('/api/admin/logout', requireAdminOrigin, (req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  });
  res.status(204).end();
});

// ================= CLOUDINARY =================

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

async function ensureDatabase(req, res, next) {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({
      message: 'Database connection unavailable'
    });
  }
}

app.use(['/api/products', '/api/contact'], (req, res, next) => {
  if (req.method === 'GET') return ensureDatabase(req, res, next);
  next();
});

const systemCategories = [
  { slug: 'live', name: 'Live Chicken' },
  { slug: 'sea-crabs', name: 'Sea Crabs' },
  { slug: 'karuvaadi', name: 'Karuvaadi' }
];

function normalizeCategoryName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function categorySlugFromName(name) {
  const slug = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);

  return slug || `category-${crypto.randomBytes(6).toString('hex')}`;
}

function categoryDisplayName(slug) {
  const systemCategory = systemCategories.find((category) => category.slug === slug);
  if (systemCategory) return systemCategory.name;
  return String(slug).replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function ensureCategoryRecords() {
  await Promise.all(systemCategories.map((category) => Category.updateOne(
    { slug: category.slug },
    { $setOnInsert: { ...category, isSystem: true } },
    { upsert: true }
  )));

  const productCategories = await Product.distinct('category', { category: { $nin: ['', null, 'all'] } });
  await Promise.all(productCategories.map((slug) => Category.updateOne(
    { slug },
    { $setOnInsert: { slug, name: categoryDisplayName(slug), isSystem: true } },
    { upsert: true }
  )));
}

async function requireKnownCategory(req, res, next) {
  const category = String(req.body.category || 'all').trim();
  if (category === 'all') {
    req.body.category = 'all';
    return next();
  }

  try {
    const exists = await Category.exists({ slug: category });
    if (!exists) return res.status(400).json({ message: 'Select a valid product category' });
    req.body.category = category;
    next();
  } catch (error) {
    next(error);
  }
}


// ==================== ROOT ROUTE ====================

app.get('/', (req, res) => {
  res.json({
    message: 'Palani Broilers API Server',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      categories: '/api/categories',
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
//                        CATEGORY ROUTES
// ============================================================

app.get('/api/categories', ensureDatabase, async (req, res) => {
  try {
    await ensureCategoryRecords();
    const categories = await Category.find().sort({ name: 1 }).lean();
    const productCounts = await Product.aggregate([
      { $group: { _id: '$category', productCount: { $sum: 1 } } }
    ]);
    const countBySlug = new Map(productCounts.map((item) => [item._id, item.productCount]));
    res.json(categories.map((category) => ({
      ...category,
      productCount: countBySlug.get(category.slug) || 0
    })));
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Unable to fetch categories' });
  }
});

app.post('/api/categories', requireAdminOrigin, requireAdmin, ensureDatabase, async (req, res) => {
  const name = normalizeCategoryName(req.body.name);
  if (!name) return res.status(400).json({ message: 'Category name is required' });

  try {
    await ensureCategoryRecords();
    const duplicateName = await Category.findOne({ name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
    if (duplicateName) return res.status(409).json({ message: 'A category with that name already exists' });

    const slug = categorySlugFromName(name);
    if (slug === 'all') return res.status(400).json({ message: '“All” is reserved for viewing every product' });
    if (await Category.exists({ slug })) return res.status(409).json({ message: 'A category with that name already exists' });

    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({ message: error.code === 11000 ? 'A category with that name already exists' : 'Unable to create category' });
  }
});

app.put('/api/categories/:id', requireAdminOrigin, requireAdmin, ensureDatabase, async (req, res) => {
  const name = normalizeCategoryName(req.body.name);
  if (!name) return res.status(400).json({ message: 'Category name is required' });

  try {
    const duplicateName = await Category.findOne({ _id: { $ne: req.params.id }, name: { $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
    if (duplicateName) return res.status(409).json({ message: 'A category with that name already exists' });

    const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({ message: 'Unable to update category' });
  }
});

app.delete('/api/categories/:id', requireAdminOrigin, requireAdmin, ensureDatabase, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    if (category.isSystem) return res.status(409).json({ message: 'This existing category is protected to preserve legacy product filtering' });

    const productCount = await Product.countDocuments({ category: category.slug });
    if (productCount > 0) return res.status(409).json({ message: `This category is used by ${productCount} product${productCount === 1 ? '' : 's'}. Reassign those products before deleting it.` });

    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Unable to delete category' });
  }
});

// ============================================================
//                         PRODUCT ROUTES
// ============================================================


// GET ALL PRODUCTS

app.get('/api/products', async (req, res) => {

  try {

    const { category } = req.query;
    const filter = category && category !== 'all' ? { category } : {};

    const products = await Product.find(filter)
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {

    console.error('Error fetching products:', error);

    res.status(500).json({
      message: error.message
    });

  }

});



// CREATE PRODUCT

app.post('/api/products', requireAdminOrigin, requireAdmin, ensureDatabase, upload.single('image'), requireKnownCategory, async (req, res) => {

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

app.put('/api/products/:id', requireAdminOrigin, requireAdmin, ensureDatabase, upload.single('image'), requireKnownCategory, async (req, res) => {

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

app.delete('/api/products/:id', requireAdminOrigin, requireAdmin, ensureDatabase, async (req, res) => {

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

    let contact = await Contact.findOne().select('-mainEmail -branches.email');


    if (!contact) {

      /*
       Contact.js requires mainPhone.
       Therefore we use a temporary default value
       instead of an empty string.
      */

      contact = new Contact({

        mainPhone: 'Not set',

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

app.put('/api/contact', requireAdminOrigin, requireAdmin, ensureDatabase, async (req, res) => {

  try {

    let contact = await Contact.findOne().select('-mainEmail -branches.email');


    if (!contact) {

      contact = new Contact({ mainPhone: req.body.mainPhone });

    } else {

      contact.mainPhone = req.body.mainPhone;

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

app.post('/api/contact/branches', requireAdminOrigin, requireAdmin, ensureDatabase, async (req, res) => {

  try {

    let contact = await Contact.findOne().select('-mainEmail -branches.email');


    if (!contact) {

      contact = new Contact({

        mainPhone: 'Not set',

        branches: [{
          name: req.body.name,
          phone: req.body.phone,
          address: req.body.address,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
          googleMapUrl: req.body.googleMapUrl
        }]

      });

    } else {

      contact.branches.push({
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        pincode: req.body.pincode,
        googleMapUrl: req.body.googleMapUrl
      });

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

app.put('/api/contact/branches/:index', requireAdminOrigin, requireAdmin, ensureDatabase, async (req, res) => {

  try {

    const contact = await Contact.findOne().select('-mainEmail -branches.email');


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


    contact.branches[branchIndex] = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      googleMapUrl: req.body.googleMapUrl
    };


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

app.delete('/api/contact/branches/:index', requireAdminOrigin, requireAdmin, ensureDatabase, async (req, res) => {

  try {

    const contact = await Contact.findOne().select('-mainEmail -branches.email');


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

module.exports = app;
