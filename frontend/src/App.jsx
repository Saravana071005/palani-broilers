import { useState, useEffect, useMemo, useCallback } from 'react'
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

  // Dedicated routing state for /comments and /
  const [currentPath, setCurrentPath] = useState(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/'
  })

  const isCommentsPage = useMemo(() => {
    return currentPath === '/comments' || currentPath === '/comments/'
  }, [currentPath])

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Dynamic SEO Metadata for /comments and /
  useEffect(() => {
    const updateMeta = (selector, attr, value, tag, extraAttrs = {}) => {
      let el = document.querySelector(selector)
      if (el) {
        el.setAttribute(attr, value)
      } else if (tag) {
        el = document.createElement(tag)
        Object.entries(extraAttrs).forEach(([k, v]) => el.setAttribute(k, v))
        el.setAttribute(attr, value)
        document.head.appendChild(el)
      }
    }

    if (isCommentsPage) {
      document.title = 'Customer Reviews | Palani Broilers'
      updateMeta('meta[name="description"]', 'content', 'Share your experience and read customer feedback about Palani Broilers.', 'meta', { name: 'description' })
      updateMeta('link[rel="canonical"]', 'href', 'https://palanibroilers.store/comments', 'link', { rel: 'canonical' })
      updateMeta('meta[property="og:title"]', 'content', 'Customer Reviews | Palani Broilers', 'meta', { property: 'og:title' })
      updateMeta('meta[property="og:description"]', 'content', 'Share your experience and read customer feedback about Palani Broilers.', 'meta', { property: 'og:description' })
      updateMeta('meta[property="og:url"]', 'content', 'https://palanibroilers.store/comments', 'meta', { property: 'og:url' })
      updateMeta('meta[name="twitter:title"]', 'content', 'Customer Reviews | Palani Broilers', 'meta', { name: 'twitter:title' })
      updateMeta('meta[name="twitter:description"]', 'content', 'Share your experience and read customer feedback about Palani Broilers.', 'meta', { name: 'twitter:description' })
      updateMeta('meta[name="twitter:url"]', 'content', 'https://palanibroilers.store/comments', 'meta', { name: 'twitter:url' })
    } else {
      const defaultTitle = 'Palani Broilers - Fresh Chicken, Mutton & Seafood in Thanjavur | பழனி பிராய்லர்ஸ்'
      const defaultDesc = 'Official website of Palani Broilers (பழனி பிராய்லர்ஸ்), Thanjavur. Farm-fresh broiler & country chicken, tender mutton, fresh sea fish, and farm eggs. Daily hygienic processing & phone orders.'
      document.title = defaultTitle
      updateMeta('meta[name="description"]', 'content', defaultDesc, 'meta', { name: 'description' })
      updateMeta('link[rel="canonical"]', 'href', 'https://palanibroilers.store/', 'link', { rel: 'canonical' })
      updateMeta('meta[property="og:title"]', 'content', defaultTitle, 'meta', { property: 'og:title' })
      updateMeta('meta[property="og:description"]', 'content', defaultDesc, 'meta', { property: 'og:description' })
      updateMeta('meta[property="og:url"]', 'content', 'https://palanibroilers.store/', 'meta', { property: 'og:url' })
      updateMeta('meta[name="twitter:title"]', 'content', 'Palani Broilers - Fresh Meat & Seafood in Thanjavur', 'meta', { name: 'twitter:title' })
      updateMeta('meta[name="twitter:description"]', 'content', 'Fresh broiler & country chicken, tender mutton, sea fish & farm eggs in Thanjavur.', 'meta', { name: 'twitter:description' })
      updateMeta('meta[name="twitter:url"]', 'content', 'https://palanibroilers.store/', 'meta', { name: 'twitter:url' })
    }
  }, [isCommentsPage])

  // Scroll to comments section when visiting /comments
  useEffect(() => {
    if (isCommentsPage) {
      const scrollToComments = () => {
        const commentsSection = document.getElementById('comments')
        if (commentsSection) {
          commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }

      // Initial scroll and follow-up after catalog layout stabilizes
      scrollToComments()
      const t1 = setTimeout(scrollToComments, 200)
      const t2 = setTimeout(scrollToComments, 650)
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
  }, [isCommentsPage, isLoadingProducts])

  // SPA navigation handlers
  const handleNavigateComments = useCallback(() => {
    if (window.location.pathname !== '/comments') {
      window.history.pushState({}, '', '/comments')
      setCurrentPath('/comments')
    }
    const commentsEl = document.getElementById('comments')
    if (commentsEl) {
      commentsEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const handleNavigateHome = useCallback(() => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/')
      setCurrentPath('/')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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

  return (
    <div className="app-shell">
      {/* Minimal Sticky Header */}
      <Header
        contact={contact}
        onNavigateComments={handleNavigateComments}
        onNavigateHome={handleNavigateHome}
      />

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

          {/* Customer Comments & Testimonials Section */}
          <CustomerComments isCommentsPage={isCommentsPage} />

          {/* Contact Section */}
          {contact && <ContactSection contact={contact} />}

          {/* Minimal Footer */}
          <Footer
            contact={contact}
            onNavigateComments={handleNavigateComments}
          />
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
