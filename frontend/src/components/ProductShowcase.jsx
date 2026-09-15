import { useState, useMemo, useEffect } from 'react'
import { Search, ArrowRight, ArrowUp } from 'lucide-react'
import ProductCard from './ProductCard'
import CategoryNav from './CategoryNav'

function ProductShowcase({
  products,
  categories,
  onProductClick,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}) {
  // viewStep: 0 -> 5 products, 1 -> 10 products, 2 -> 15 products, 3 -> ALL products
  const [viewStep, setViewStep] = useState(0)

  // Reset to initial 5 products whenever category or search changes
  useEffect(() => {
    setViewStep(0)
  }, [selectedCategory, searchQuery])

  // Category mapping helper
  const categoryMap = useMemo(() => {
    const map = {}
    categories.forEach((c) => {
      map[c.slug] = c.name
      map[c._id] = c.name
    })
    return map
  }, [categories])

  // Compute category product counts
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

  // Determine how many products to show based on viewStep
  // Initial (step 0): 5
  // Step 1: 10
  // Step 2: 15
  // Step 3: ALL remaining
  const visibleCount = useMemo(() => {
    if (viewStep === 0) return Math.min(5, sortedProducts.length)
    if (viewStep === 1) return Math.min(10, sortedProducts.length)
    if (viewStep === 2) return Math.min(15, sortedProducts.length)
    return sortedProducts.length
  }, [viewStep, sortedProducts.length])

  const displayedProducts = useMemo(() => {
    return sortedProducts.slice(0, visibleCount)
  }, [sortedProducts, visibleCount])

  const hasMore = visibleCount < sortedProducts.length
  const canShowLess = !hasMore && sortedProducts.length > 5

  const handleViewMore = () => {
    setViewStep((prev) => prev + 1)
  }

  const handleShowLess = () => {
    setViewStep(0)
    const el = document.getElementById('products')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section id="products" className="catalogue-section" aria-labelledby="showcase-heading">
      {/* Category selector */}
      <div id="categories">
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          productCounts={categoryCounts}
        />
      </div>

      {/* Catalogue header & Search (Desktop right-aligned, Mobile stacked) */}
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

      {/* 5-Column Desktop Grid & 2-Column Mobile Grid */}
      {displayedProducts.length > 0 ? (
        <>
          <div className="editorial-5col-grid">
            {displayedProducts.map((product, idx) => {
              const categoryName = categoryMap[product.category] || product.category

              return (
                <div
                  key={product._id || product.productIndex || idx}
                  className="product-grid-cell"
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

          {/* 3-Step View More / Show Less Button */}
          {(hasMore || canShowLess) && (
            <div className="view-more-container">
              {hasMore ? (
                <button
                  type="button"
                  className="view-more-btn"
                  onClick={handleViewMore}
                >
                  <span>VIEW MORE</span>
                  <ArrowRight size={17} />
                </button>
              ) : (
                <button
                  type="button"
                  className="view-more-btn show-less-variant"
                  onClick={handleShowLess}
                >
                  <span>SHOW LESS</span>
                  <ArrowUp size={17} />
                </button>
              )}
            </div>
          )}
        </>
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

export default ProductShowcase
