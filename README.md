# Palani Broilers Website

A full-stack website for Palani Broilers business with product management, app integration, and admin panel.

## Features

- **Product Catalog**: Display products with Tamil and English names, prices, and stock status
- **Category Filtering**: Filter products by categories managed from the admin panel
- **Search Functionality**: Search products by name
- **App Integration**: Click on any product to open app or download the APK
- **Product TXT Import**: Preview, validate, and securely import products and categories from a `.txt` file
- **Admin Panel**: 
  - Add, edit, and delete products
  - Update product prices and stock status
  - Manage contact details and location information
- **Contact Section**: Display phone, address, and Google Maps integration
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- Multer for file uploads
- CORS for cross-origin requests

### Frontend
- React 18
- Vite
- TailwindCSS
- Axios for API calls
- Lucide React for icons

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (installed and running)
- npm or yarn

## Installation

### 1. Clone or navigate to the project directory

```bash
cd C:\Users\Admin\CascadeProjects\palani-broilers
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/palani-broilers
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Seed the Database

```bash
cd backend
node seed.js
```

This will populate the database with initial products and contact details.

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:
```bash
# On Windows with MongoDB installed as service
# MongoDB should start automatically
# Or start manually:
mongod
```

### Start Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products (optional category filter)
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product (with image upload)
- `PUT /api/products/:id` - Update a product (with image upload)
- `DELETE /api/products/:id` - Delete a product

### Categories
- `GET /api/categories` - Get categories and their product counts
- `POST /api/categories` - Create a category (admin only)
- `PUT /api/categories/:id` - Rename a category (admin only)
- `DELETE /api/categories/:id` - Delete an unused custom category (admin only)

### Product import
- `POST /api/admin/import-products` - Preview or confirm a TXT product import (admin only; multipart field: `file`)
- Use `CATEGORY: Name` followed by `PRODUCT:` blocks with `Tamil Name`, `English Name`, `Price`, and optional `Unit` fields. A product can also include its own `Category` field.

### Contact
- `GET /api/contact` - Get contact details
- `PUT /api/contact` - Update contact details

### APK Download
- `GET /api/download-apk` - Download the mobile app APK

## Admin Panel

Access the admin panel by clicking the "Admin Panel" button in the top-right corner of the website.

### Features:
- **Product Management**: Add, edit, delete products with image upload
- **Contact Management**: Update phone, address, and Google Maps URL
- **Category Management**: Add, rename, and safely remove custom product categories
- **Product Import**: Upload a TXT file, inspect its preview, then confirm a safe import
- **Real-time Updates**: Changes reflect immediately on the website

## App Integration

When a user clicks on a product:
1. A modal appears with "Open App" and "Download App" options
2. **Open App**: Uses an Android explicit intent for the installed Palani Broilers app activity.
3. **Download App**: Downloads `/palani-broilers.apk` from the frontend public folder when the app is unavailable.

## Project Structure

```
palani-broilers/
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   └── Contact.js
│   ├── uploads/          # Uploaded images and APK
│   ├── server.js          # Express server
│   ├── seed.js            # Database seeder
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ContactSection.jsx
│   │   │   ├── AppModal.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Customization

### Update Company Logo
Replace the emoji in `frontend/src/components/Header.jsx` with your actual logo image:
```jsx
<img src="/path/to/logo.png" alt="Palani Broilers Logo" className="w-16 h-16" />
```

### Update APK File
Place your APK file in `backend/uploads/app-release.apk` or update the path in `backend/server.js`.

### Update Contact Details
Use the admin panel or directly update via the API endpoint.

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the MONGODB_URI in `.env` file
- Verify MongoDB is accessible on the specified port

### Frontend Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear Vite cache: `npm run dev -- --force`

### Image Upload Issues
- Ensure `backend/uploads` directory exists and is writable
- Check file size limits in multer configuration

## License

This project is for Palani Broilers business use.
