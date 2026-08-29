import { useState, useEffect } from 'react'
import Header from './components/Header'
import ProductList from './components/ProductList'
import ContactSection from './components/ContactSection'
import AppModal from './components/AppModal'
import axios from 'axios'

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
      const response = await axios.get('/api/products', {
        params: { category: selectedCategory }
      })
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchContact = async () => {
    try {
      const response = await axios.get('/api/contact')
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

  const handleDownloadApp = async () => {
    try {
      const response = await axios.get('/api/download-apk', {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'palani-broilers-app.apk')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading APK:', error)
      alert('Error downloading app. Please try again.')
    }
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductList
          products={filteredProducts}
          onProductClick={handleProductClick}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        {contact && <ContactSection contact={contact} />}
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
