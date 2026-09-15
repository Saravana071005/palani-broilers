import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './ProductCard'
import CategoryNav from './CategoryNav'

function ProductCarousel({
  products,
  categories,
  onProductClick,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) {
  const trackRef = useRef(null)
  const idleTimeoutRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)

  // Category mapping helper
  const categoryMap = useMemo(() => {
    const map = {}
    categories.forEach((c) => {
      map[c.slug] = c.name
      map[c._id] = c.name
    })
    return map
  }, [categories])

  // Category product counts
  const categoryCounts = useMemo(() => {
    const counts = { all: products.length }
    products.forEach((p) => {
      const cat = p.category || 'all'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [products])

  // Filter products by category and search query (Tamil, English, index, category)
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const productCat = String(product.category || '').toLowerCase()
        if (productCat !== selectedCategory.toLowerCase()) {
          return false
        }
      }

      // Search filter
      if (!query) return true

      const tamil = String(product.nameTamil || '').toLowerCase()
      const english = String(product.nameEnglish || '').toLowerCase()
      const index = String(product.productIndex || '').toLowerCase()
      const category = String(product.category || '').toLowerCase()
      const catName = String(categoryMap[product.category] || '').toLowerCase()

      return (
        tamil.includes(query) ||
        english.includes(query) ||
        index.includes(query) ||
        category.includes(query) ||
        catName.includes(query)
      )
    })
  }, [products, selectedCategory, searchQuery, categoryMap])

  // Stable derived sorting: In-stock first, Out-of-stock last.
  const sortedProducts = useMemo(() => {
    const inStock = []
    const outOfStock = []

    filteredProducts.forEach((item) => {
      const isOut = item.stockStatus === 'out-of-stock' || item.lowStock
      if (isOut) {
        outOfStock.push(item)
      } else {
        inStock.push(item)
      }
    })

    return [...inStock, ...outOfStock]
  }, [filteredProducts])

  // Pause autoplay on manual interaction, then resume after 5 seconds of idle time
  const handleInteractionStart = useCallback(() => {
    setIsPaused(true)
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current)
      idleTimeoutRef.current = null
    }
  }, [])

  const handleInteractionEnd = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current)
    }
    idleTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, 5000)
  }, [])

  // Calculate scroll amount based on single card width + gap
  const getScrollAmount = useCallback(() => {
    const track = trackRef.current
    if (!track) return 300
    const firstCard = track.querySelector('.carousel-slide-item')
    if (firstCard) {
      const cardRect = firstCard.getBoundingClientRect()
      return cardRect.width + 16
    }
    return Math.max(240, track.clientWidth * 0.4)
  }, [])

  // Scroll left (previous)
  const scrollPrev = useCallback(() => {
    handleInteractionStart()
    const track = trackRef.current
    if (!track) return

    const amount = getScrollAmount()
    if (track.scrollLeft <= 5) {
      // Loop wrap-around to the end
      track.scrollTo({
        left: track.scrollWidth - track.clientWidth,
        behavior: 'smooth'
      })
    } else {
      track.scrollBy({ left: -amount, behavior: 'smooth' })
    }
    handleInteractionEnd()
  }, [getScrollAmount, handleInteractionStart, handleInteractionEnd])

  // Scroll right (next)
  const scrollNext = useCallback((isAuto = false) => {
    if (!isAuto) {
      handleInteractionStart()
    }
    const track = trackRef.current
    if (!track) return

    const amount = getScrollAmount()
    const maxScrollLeft = track.scrollWidth - track.clientWidth - 10

    if (track.scrollLeft >= maxScrollLeft) {
      // Smooth loop back to the start
      track.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      track.scrollBy({ left: amount, behavior: 'smooth' })
    }

    if (!isAuto) {
      handleInteractionEnd()
    }
  }, [getScrollAmount, handleInteractionStart, handleInteractionEnd])

  // Autoplay Effect: Slow, gentle automatic progression
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isPaused || sortedProducts.length <= 1 || prefersReducedMotion) {
      return
    }

    // Advance 1 step every 4 seconds
    const interval = setInterval(() => {
      scrollNext(true)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPaused, sortedProducts.length, scrollNext])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current)
      }
    }
  }, [])

  return (
    <section id="products" className="catalogue-section" aria-labelledby="showcase-heading">
      {/* Category Navigation */}
      <div id="categories">
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          productCounts={categoryCounts}
        />
      </div>

      {/* Catalogue Header & Search */}
      <div className="catalogue-tools-header">
        <div className="catalogue-headline">
          <h2 id="showcase-heading">எங்கள் பொருட்கள்</h2>
          <span>Daily Catalogue</span>
        </div>

        <label className="minimal-search-box" aria-label="Search products">
          <Search size={17} className="text-forest flex-shrink-0" />
          <input
            type="search"
            placeholder="Search Tamil, English, or PB-001..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
      </div>

      {/* Product Carousel Container with Circular Arrows on both sides */}
      {sortedProducts.length > 0 ? (
        <div
          className="product-carousel-wrapper"
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
        >
          {/* Left Arrow Button */}
          <button
            type="button"
            className="carousel-arrow-btn arrow-prev"
            onClick={scrollPrev}
            aria-label="Previous products"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Horizontal Scrollable Track */}
          <div
            ref={trackRef}
            className="product-carousel-track"
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            onMouseDown={handleInteractionStart}
            onMouseUp={handleInteractionEnd}
            onWheel={() => {
              handleInteractionStart()
              handleInteractionEnd()
            }}
          >
            {sortedProducts.map((product, idx) => {
              const categoryName = categoryMap[product.category] || product.category

              return (
                <div
                  key={product._id || product.productIndex || idx}
                  className="carousel-slide-item"
                >
                  <ProductCard
                    product={product}
                    index={idx}
                    isFeature={false}
                    onClick={onProductClick}
                    categoryName={categoryName}
                  />
                </div>
              )
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            className="carousel-arrow-btn arrow-next"
            onClick={() => scrollNext(false)}
            aria-label="Next products"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      ) : (
        <div className="catalogue-empty-state">
          <p className="text-base font-semibold text-forest mb-1">
            பொருட்கள் கிடைக்கவில்லை
          </p>
          <p className="text-sm text-earth-muted">
            தேடல் அல்லது வகையை மாற்றி முயற்சிக்கவும்.
          </p>
        </div>
      )}
    </section>
  )
}

export default ProductCarousel
