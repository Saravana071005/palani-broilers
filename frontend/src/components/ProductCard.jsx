import { useState, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'

function ProductCard({ product, index, isFeature = false, onClick, categoryName }) {
  const cardRef = useRef(null)
  const [tiltStyle, setTiltStyle] = useState({})

  const isOutOfStock = product.stockStatus === 'out-of-stock' || product.lowStock
  const displayIndex = product.productIndex || `PB-${String(index + 1).padStart(3, '0')}`

  // 3D Tilt interaction on mouse move for desktop
  const handleMouseMove = (e) => {
    // Disable on touch / mobile devices or if reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth <= 768) {
      return
    }
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Max tilt angles: 6 degrees
    const rotateX = ((y - centerY) / centerY) * -5
    const rotateY = ((x - centerX) / centerX) * 5

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.4s ease-out'
    })
  }

  return (
    <div className={`product-card-3d-wrap ${isFeature ? 'editorial-card-feature' : ''}`}>
      <button
        ref={cardRef}
        type="button"
        className={`editorial-product-card ${isOutOfStock ? 'is-out-of-stock' : ''}`}
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick(product)}
        aria-label={`${product.nameEnglish} (${product.nameTamil}) - ${isOutOfStock ? 'Out of stock' : 'Available'}`}
      >
        <div className="product-card-media">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.nameEnglish || 'Product'}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-sage-light text-forest font-bold text-lg">
              PB
            </div>
          )}

          {/* Product Index Badge */}
          <span className="product-index-badge" aria-label={`Code: ${displayIndex}`}>
            {displayIndex}
          </span>

          {/* Category Tag */}
          {categoryName && (
            <span className="product-category-badge">
              {categoryName}
            </span>
          )}

          {/* Stock Status Badge */}
          <span
            className={`product-stock-pill ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}
          >
            {isOutOfStock ? 'Out of stock' : 'Available'}
          </span>
        </div>

        <div className="product-card-body">
          <div>
            <h3 className="product-name-tamil font-tamil">
              {product.nameTamil}
            </h3>
            <p className="product-name-en">
              {product.nameEnglish}
            </p>
          </div>

          <div className="product-card-footer">
            <span className="product-cta-text">
              View details <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </button>
    </div>
  )
}

export default ProductCard
