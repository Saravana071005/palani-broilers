import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductShowcase from './components/ProductShowcase'
import ContactSection from './components/ContactSection'
import HelpGuide from './components/HelpGuide'
import Footer from './components/Footer'
import MobileNav from './components/MobileNav'
import ProductModal from './components/ProductModal'

const API_URL = 'https://palani-broilers-api.vercel.app'
const ANDROID_APP_INTENT = 'intent://open/#Intent;package=com.example.palaniposapp;component=com.example.palaniposapp/.MainActivity;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;end'

function App() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [contact, setContact] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [appOpenStatus, setAppOpenStatus] = useState('')
  const [appUnavailable, setAppUnavailable] = useState(false)
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
    setAppOpenStatus('')
    setAppUnavailable(false)
    setShowModal(true)
  }

  const handleOpenApp = () => {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    const isAndroid = /Android/i.test(navigator.userAgent)

    if (isIOS) {
      // iOS custom scheme
      const productId = selectedProduct?._id || selectedProduct?.productIndex || ''
      window.location.href = `palanibroilers://product/${productId}`
      setTimeout(() => {
        setAppOpenStatus('Palani Broilers செயலி நிறுவப்படவில்லை.')
        setAppUnavailable(true)
      }, 1500)
      return
    }

    if (!isAndroid) {
      setAppOpenStatus('Palani Broilers APK ஆண்ட்ராய்டு போன்களுக்கானது. மொபைலில் திறந்து நிறுவவும்.')
      setAppUnavailable(true)
      return
    }

    setAppOpenStatus('செயலியைத் திறக்கிறது…')
    let appOpened = false

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        appOpened = true
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange, { once: true })
    window.location.href = ANDROID_APP_INTENT

    window.setTimeout(() => {
      if (!appOpened) {
        setAppOpenStatus('Palani Broilers செயலி இன்னும் நிறுவப்படவில்லை.')
        setAppUnavailable(true)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, 1300)
  }

  const handleDownloadApp = () => {
    const link = document.createElement('a')
    link.href = '/palani-broilers.apk'
    link.download = 'palani-broilers.apk'
    document.body.appendChild(link)
    link.click()
    link.remove()
    setAppOpenStatus('APK பதிவிறக்கம் தொடங்கப்பட்டது...')
  }

  const handleOpenHelp = () => {
    if (showModal) {
      setShowModal(false)
    }
    window.dispatchEvent(new Event('palani-open-help'))
    requestAnimationFrame(() => {
      const el = document.getElementById('help')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
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
      <Header contact={contact} onOpenHelp={handleOpenHelp} />

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

          {/* Contact Section */}
          {contact && <ContactSection contact={contact} />}

          {/* Compact Tamil Help Guide */}
          <HelpGuide onDownloadApp={handleDownloadApp} contact={contact} />

          {/* Minimal Footer */}
          <Footer contact={contact} onOpenHelp={handleOpenHelp} />
        </div>
      </main>

      {/* Sticky Bottom Mobile Bar */}
      <MobileNav contact={contact} onOpenHelp={handleOpenHelp} />

      {/* Premium Product Modal */}
      {showModal && (
        <ProductModal
          product={selectedProduct}
          onOpenApp={handleOpenApp}
          onDownloadApp={handleDownloadApp}
          onClose={() => setShowModal(false)}
          appOpenStatus={appOpenStatus}
          appUnavailable={appUnavailable}
          contact={contact}
          onNeedHelp={handleOpenHelp}
        />
      )}
    </div>
  )
}

export default App
