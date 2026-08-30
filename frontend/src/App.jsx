import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductList from './components/ProductList'
import ContactSection from './components/ContactSection'
import AppModal from './components/AppModal'
import axios from 'axios'
const API_URL = 'https://palani-broilers-api.vercel.app'
const ANDROID_APP_INTENT = 'intent://open/#Intent;scheme=palaniposapp;package=com.example.palaniposapp;component=com.example.palaniposapp/.MainActivity;end'

function App() {
  const [products, setProducts] = useState([])
  const [contact, setContact] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [appOpenStatus, setAppOpenStatus] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchContact()
  }, [selectedCategory])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`, {
        params: { category: selectedCategory }
      })
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
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

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setAppOpenStatus('')
    setShowModal(true)
  }

  const handleOpenApp = () => {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setAppOpenStatus('Palani Broilers APK is for Android devices. Please open this page on Android to install the app.')
      return
    }

    if (!/Android/i.test(navigator.userAgent)) {
      setAppOpenStatus('Palani Broilers APK is for Android devices. Open this page on Android to install the app.')
      return
    }

    setAppOpenStatus('Opening the Palani Broilers app…')
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
        setAppOpenStatus('Palani Broilers app is not installed or could not open. Use Download APK below to install or update it.')
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, 1200)
  }

const handleDownloadApp = () => {
  const link = document.createElement('a')
  link.href = '/palani-broilers.apk'
  link.download = 'palani-broilers.apk'
  document.body.appendChild(link)
  link.click()
    link.remove()
    setAppOpenStatus('')
    setShowModal(false)
}

  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase()
    return (
      product.nameTamil.toLowerCase().includes(searchLower) ||
      product.nameEnglish.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="app-shell">
      <Header />
      <main>
        <Hero />
        <div className="site-content">
        <ProductList
          products={filteredProducts}
          onProductClick={handleProductClick}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
          {contact && <ContactSection contact={contact} />}
        </div>
      </main>

      {showModal && (
        <AppModal
          product={selectedProduct}
          onOpenApp={handleOpenApp}
          onDownloadApp={handleDownloadApp}
          onClose={() => setShowModal(false)}
          appOpenStatus={appOpenStatus}
        />
      )}
    </div>
  )
}

export default App
