import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductShowcase from './components/ProductShowcase'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'
import CustomerComments from './components/CustomerComments'
import Footer from './components/Footer'
import MobileNav from './components/MobileNav'
import AppChoiceModal from './components/AppChoiceModal'

const API_URL = 'https://palani-broilers-api.vercel.app'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.nextfuturetechnology.palanibroilers&hl=en_IN'
const ANDROID_PACKAGE_ID = 'com.nextfuturetechnology.palanibroilers'

function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [contact, setContact] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState(null)

  useEffect(() => {
    fetchProducts()
    fetchContact()
  }, [selectedCategory])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    setIsLoadingProducts(true)
    setProductsError(null)
    try {
      // Normalize category: only pass category param if it's a specific valid category, not 'all' or empty
      const isAll = !selectedCategory || selectedCategory === 'all' || selectedCategory === 'All Products'
      const params = isAll ? {} : { category: selectedCategory }
      const response = await axios.get(`${API_URL}/api/products`, { params })
      setProducts(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProductsError(error?.message || 'Failed to fetch products')
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const fetchContact = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/contact`)
      setContact(response.data)
    } catch (error) {
      console.error('Error fetching contact:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`)
      setCategories(response.data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setShowModal(true)
  }

  // Derive featured hero product: first in-stock product with an image
  const featuredHeroProduct = useMemo(() => {
    if (!products || products.length === 0) return null
    const inStock = products.find(
      (p) => (p.stockStatus !== 'out-of-stock' && !p.lowStock) && p.imageUrl
    )
    return inStock || products[0] || null
  }, [products])

  // Category name lookup for hero
  const featuredCategoryName = useMemo(() => {
    if (!featuredHeroProduct) return ''
    const match = categories.find(
      (c) => c.slug === featuredHeroProduct.category || c._id === featuredHeroProduct.category
    )
    return match?.name || featuredHeroProduct.category || ''
  }, [featuredHeroProduct, categories])

  return (
    <div className="app-shell">
      {/* Minimal Sticky Header */}
      <Header contact={contact} />

      <main>
        {/* Compact Editorial Hero with 3D Logo Showcase */}
        <Hero contact={contact} />


        {/* Product Showcase Section */}
        <div className="site-content">
          <ProductShowcase
            products={products}
            categories={categories}
            onProductClick={handleProductClick}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isLoading={isLoadingProducts}
            error={productsError}
            onRetry={fetchProducts}
          />

          {/* Editorial About Section for SEO & Business Story */}
          <AboutSection contact={contact} />

          {/* Customer Comments & Feedback Section */}
          <CustomerComments />

          {/* Contact Section */}
          {contact && <ContactSection contact={contact} />}

          {/* Minimal Footer */}
          <Footer contact={contact} />
        </div>
      </main>

      {/* Sticky Bottom Mobile Bar */}
      <MobileNav contact={contact} />

      {/* Official Palani Broilers App Choice Modal */}
      {showModal && (
        <AppChoiceModal
          product={selectedProduct}
          categories={categories}
          contact={contact}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default App
