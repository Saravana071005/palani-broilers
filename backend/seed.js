const mongoose = require('mongoose');
const Product = require('./models/Product');
const Contact = require('./models/Contact');
require('dotenv').config();

const seedProducts = [
  {
    nameTamil: 'உயிர் கெண்டை மீன்',
    nameEnglish: 'u kendai meen',
    price: 1.00,
    unit: 'kg',
    category: 'all',
    lowStock: true
  },
  {
    nameTamil: 'உயிர் பப்பு மீன்',
    nameEnglish: 'u bapu meen',
    price: 2.00,
    unit: 'kg',
    category: 'all',
    lowStock: false
  },
  {
    nameTamil: 'ஐ பப்பு மீன்',
    nameEnglish: 'I pabu meen',
    price: 1.00,
    unit: 'kg',
    category: 'all',
    lowStock: true
  },
  {
    nameTamil: 'உயிர் ஜிலேபி மீன்',
    nameEnglish: 'u jelabi meen',
    price: 1.00,
    unit: 'kg',
    category: 'all',
    lowStock: true
  },
  {
    nameTamil: 'சங்கர மீன் 1',
    nameEnglish: 'sangara meen 1',
    price: 1.00,
    unit: 'kg',
    category: 'all',
    lowStock: false
  },
  {
    nameTamil: 'கிழங்கா மீன் 1',
    nameEnglish: 'kelanga meen 1',
    price: 1.00,
    unit: 'kg',
    category: 'all',
    lowStock: false
  },
  {
    nameTamil: 'கிளி கொடுவா மீன்',
    nameEnglish: 'kili koduva meen',
    price: 1.00,
    unit: 'kg',
    category: 'all',
    lowStock: false
  },
  {
    nameTamil: 'கொடுவா மீன்',
    nameEnglish: 'koduva meen',
    price: 1.00,
    unit: 'kg',
    category: 'all',
    lowStock: false
  },
  {
    nameTamil: 'முரல் மீன் 1',
    nameEnglish: 'mural meen 1',
    price: 1.00,
    unit: 'kg',
    category: 'all',
    lowStock: false
  },
  {
    nameTamil: 'முரல் மீன் 2',
    nameEnglish: 'mural meen 2',
    price: 1.00,
    unit: 'kg',
    category: 'all',
    lowStock: false
  },
  {
    nameTamil: 'ஐ ஜிலேபி மீன்',
    nameEnglish: 'I jelabi meen',
    price: 1.00,
    unit: 'kg',
    category: 'all',
    lowStock: false
  },
  {
    nameTamil: 'விரால் மீன் 1',
    nameEnglish: 'veraal meen 1',
    price: 1.00,
    unit: 'kg',
    category: 'all',
    lowStock: false
  },
  {
    nameTamil: 'விரால் மீன் 2',
    nameEnglish: 'veraal meen 2',
    price: 1.00,
    unit: 'kg',
    category: 'all',
    lowStock: false
  },
  {
    nameTamil: 'ஐ விரால் மீன்',
    nameEnglish: 'I viraal fish',
    price: 1.00,
    unit: 'kg',
    category: 'all',
    lowStock: false
  }
];

const seedContact = {
  mainPhone: '+91 9876543210',
  mainEmail: 'info@palanibroilers.com',
  branches: [
    {
      name: 'Thanjavur Main Branch',
      phone: '+91 9876543210',
      email: 'thanjavur@palanibroilers.com',
      address: 'Main Market, Near Bus Stand',
      city: 'Thanjavur',
      state: 'Tamil Nadu',
      pincode: '613001',
      googleMapUrl: 'https://maps.google.com/?q=Thanjavur,Tamil+Nadu'
    },
    {
      name: 'Trichy Branch',
      phone: '+91 9876543211',
      email: 'trichy@palanibroilers.com',
      address: 'Srirangam Road, Near Railway Station',
      city: 'Trichy',
      state: 'Tamil Nadu',
      pincode: '620001',
      googleMapUrl: 'https://maps.google.com/?q=Trichy,Tamil+Nadu'
    },
    {
      name: 'Kumbakonam Branch',
      phone: '+91 9876543212',
      email: 'kumbakonam@palanibroilers.com',
      address: 'Sarangapani Street, Near Temple',
      city: 'Kumbakonam',
      state: 'Tamil Nadu',
      pincode: '612001',
      googleMapUrl: 'https://maps.google.com/?q=Kumbakonam,Tamil+Nadu'
    },
    {
      name: 'Madurai Branch',
      phone: '+91 9876543213',
      email: 'madurai@palanibroilers.com',
      address: 'KK Nagar, Main Road',
      city: 'Madurai',
      state: 'Tamil Nadu',
      pincode: '625001',
      googleMapUrl: 'https://maps.google.com/?q=Madurai,Tamil+Nadu'
    },
    {
      name: 'Salem Branch',
      phone: '+91 9876543214',
      email: 'salem@palanibroilers.com',
      address: 'Yercaud Main Road',
      city: 'Salem',
      state: 'Tamil Nadu',
      pincode: '636001',
      googleMapUrl: 'https://maps.google.com/?q=Salem,Tamil+Nadu'
    },
    {
      name: 'Coimbatore Branch',
      phone: '+91 9876543215',
      email: 'coimbatore@palanibroilers.com',
      address: 'Gandhipuram, Near Bus Stand',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641001',
      googleMapUrl: 'https://maps.google.com/?q=Coimbatore,Tamil+Nadu'
    },
    {
      name: 'Erode Branch',
      phone: '+91 9876543216',
      email: 'erode@palanibroilers.com',
      address: 'Brough Road, Near Market',
      city: 'Erode',
      state: 'Tamil Nadu',
      pincode: '638001',
      googleMapUrl: 'https://maps.google.com/?q=Erode,Tamil+Nadu'
    },
    {
      name: 'Karur Branch',
      phone: '+91 9876543217',
      email: 'karur@palanibroilers.com',
      address: 'Main Bazaar, Near Railway Station',
      city: 'Karur',
      state: 'Tamil Nadu',
      pincode: '639001',
      googleMapUrl: 'https://maps.google.com/?q=Karur,Tamil+Nadu'
    },
    {
      name: 'Pudukkottai Branch',
      phone: '+91 9876543218',
      email: 'pudukkottai@palanibroilers.com',
      address: 'Main Road, Near Bus Stand',
      city: 'Pudukkottai',
      state: 'Tamil Nadu',
      pincode: '622001',
      googleMapUrl: 'https://maps.google.com/?q=Pudukkottai,Tamil+Nadu'
    },
    {
      name: 'Ariyalur Branch',
      phone: '+91 9876543219',
      email: 'ariyalur@palanibroilers.com',
      address: 'Market Street, Near Temple',
      city: 'Ariyalur',
      state: 'Tamil Nadu',
      pincode: '621001',
      googleMapUrl: 'https://maps.google.com/?q=Ariyalur,Tamil+Nadu'
    }
  ]
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Contact.deleteMany({});
    console.log('Cleared existing data');

    // Insert products
    await Product.insertMany(seedProducts);
    console.log('Inserted products');

    // Insert contact
    await Contact.create(seedContact);
    console.log('Inserted contact details');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
