import { ArrowUpRight, Sparkles } from 'lucide-react'

function FeaturedProduct({ product, onProductClick, categoryName }) {
  if (!product) return null

  const isOutOfStock = product.stockStatus === 'out-of-stock' || product.lowStock
  const displayIndex = product.productIndex || 'PB-001'

  return (
    <div
      className="hero-spotlight-card"
      onClick={() => onProductClick(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onProductClick(product)
        }
      }}
      aria-label={`Featured: ${product.nameEnglish} (${product.nameTamil})`}
    >
      <div className="spotlight-media">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.nameEnglish}
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-sage text-forest font-bold text-xl">
            Palani Broilers
          </div>
        )}
        <span className="spotlight-pill-tag flex items-center gap-1">
          <Sparkles size={12} className="text-coral" /> Daily Feature
        </span>
      </div>

      <div className="spotlight-info">
        <div className="spotlight-titles">
          <div className="spotlight-index">{displayIndex} · {categoryName || 'Fresh Selection'}</div>
          <h3 className="spotlight-tamil font-tamil">{product.nameTamil}</h3>
          <p className="spotlight-en">{product.nameEnglish}</p>
        </div>
        <div className="spotlight-action-icon" aria-hidden="true">
          <ArrowUpRight size={18} />
        </div>
      </div>
    </div>
  )
}

export default FeaturedProduct
