import { useMemo } from 'react'
import { Search } from 'lucide-react'
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
  // Preserves existing catalog order within each group.
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

      {/* Catalogue header & Minimal Search */}
      <div className="catalogue-tools-header">
        <div className="catalogue-headline">
          <h2 id="showcase-heading">எங்கள் பொருட்கள்</h2>
          <span>/ Daily Catalogue</span>
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

      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="editorial-showcase-grid">
          {sortedProducts.map((product, idx) => {
            const isOutOfStock = product.stockStatus === 'out-of-stock' || product.lowStock
            // Asymmetric rhythm on desktop for in-stock items (e.g. index 0, 5, 11)
            const isFeature = !isOutOfStock && (idx === 0 || idx % 7 === 0)
            const categoryName = categoryMap[product.category] || product.category

            return (
              <ProductCard
                key={product._id || product.productIndex || idx}
                product={product}
                index={idx}
                isFeature={isFeature}
                onClick={onProductClick}
                categoryName={categoryName}
              />
            )
          })}
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

export default ProductShowcase
