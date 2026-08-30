import { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import ProductList from './components/ProductList'
import ContactSection from './components/ContactSection'
import AppModal from './components/AppModal'
import axios from 'axios'
const API_URL = 'https://palani-broilers-api.vercel.app'

function App() {
  const [products, setProducts] = useState([])
  const [contact, setContact] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

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
    setShowModal(true)
  }

  const handleOpenApp = () => {
    // Deep link to the app - replace with your actual app scheme
    window.location.href = 'palanibroilers://product/' + selectedProduct._id
    setShowModal(false)
  }

const handleDownloadApp = () => {
  const link = document.createElement('a')
  link.href = '/palani-broilers.apk'
  link.download = 'palani-broilers.apk'
  document.body.appendChild(link)
  link.click()
  link.remove()
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
        />
      )}
    </div>
  )
}

export default App
