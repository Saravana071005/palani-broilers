import { useEffect } from 'react'
import { PhoneCall, Smartphone, Download, HelpCircle, X } from 'lucide-react'

function ProductModal({
  product,
  onOpenApp,
  onDownloadApp,
  onClose,
  appOpenStatus,
  appUnavailable,
  onNeedHelp,
  contact,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!product) return null

  const isOutOfStock = product.stockStatus === 'out-of-stock' || product.lowStock
  const displayIndex = product.productIndex || 'PB-001'
  const rawPhone = contact?.mainPhone ? String(contact.mainPhone).replace(/[^\d+]/g, '') : ''

  return (
    <div
      className="modal-backdrop-overlay"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="premium-product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title-tamil"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-trigger"
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Product Media Column */}
        <div className="modal-media-col">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.nameEnglish}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-sage text-forest font-bold text-2xl">
              Palani Broilers
            </div>
          )}
        </div>

        {/* Product Details & Actions Column */}
        <div className="modal-content-col">
          <div className="modal-meta-row">
            <span className="modal-index-pill">{displayIndex}</span>
            {product.category && (
              <span className="modal-cat-pill">{product.category}</span>
            )}
          </div>

          <h2 id="modal-title-tamil" className="modal-product-tamil">
            {product.nameTamil}
          </h2>
          <p className="modal-product-en">
            {product.nameEnglish}
          </p>

          <div
            className={`modal-status-badge ${isOutOfStock ? 'unavailable' : 'available'}`}
          >
            <span className="w-2 h-2 rounded-full bg-current" aria-hidden="true" />
            <span>{isOutOfStock ? 'தற்போது கையிருப்பில் இல்லை (Out of Stock)' : 'இன்று கிடைக்கும் (Available Today)'}</span>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions-list">
            {rawPhone ? (
              <a
                className="modal-action-call"
                href={`tel:${rawPhone}`}
              >
                <PhoneCall size={20} />
                <span>இப்போது அழைக்கவும் (CALL NOW)</span>
              </a>
            ) : null}

            {!appUnavailable && (
              <button
                type="button"
                className="modal-action-app"
                onClick={onOpenApp}
              >
                <Smartphone size={18} />
                <span>செயலியில் திறக்கவும் (OPEN APP)</span>
              </button>
            )}

            <button
              type="button"
              className="modal-action-download"
              onClick={onDownloadApp}
            >
              <Download size={18} />
              <span>செயலியை பதிவிறக்கவும் (DOWNLOAD APP)</span>
            </button>

            <button
              type="button"
              className="modal-action-help"
              onClick={onNeedHelp}
            >
              <HelpCircle size={18} />
              <span>உதவி வழிகாட்டி (HELP)</span>
            </button>
          </div>

          {/* Fallback Message for Sideloaded App */}
          {(appOpenStatus || appUnavailable) && (
            <div className="modal-sideload-fallback" role="status">
              <p className="font-semibold mb-1">
                {appOpenStatus || 'App installed இல்லையா?'}
              </p>
              <p className="text-xs">
                Palani Broilers செயலியை பதிவிறக்கம் செய்ய மேலே உள்ள <strong>DOWNLOAD APP</strong> பட்டனை பயன்படுத்தவும்.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductModal
