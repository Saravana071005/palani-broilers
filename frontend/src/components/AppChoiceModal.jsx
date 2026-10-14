import { useState, useEffect, useMemo, useRef } from 'react'
import { Smartphone, Download, PhoneCall, X, ExternalLink, Info, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.nextfuturetechnology.palanibroilers&hl=en_IN'
const ANDROID_PACKAGE_ID = 'com.nextfuturetechnology.palanibroilers'

function GooglePlayIcon({ size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3.609 1.814C3.393 2.052 3.25 2.426 3.25 2.923v18.154c0 .497.143.871.359 1.109l.063.063 10.166-10.166v-.24L3.672 1.751l-.063.063z"
        fill="#00E676"
      />
      <path
        d="M17.228 15.438l-3.39-3.39v-.24l3.39-3.39.077.044 4.015 2.281c1.146.65 1.146 1.716 0 2.366l-4.015 2.281-.077.058z"
        fill="#FFD600"
      />
      <path
        d="M17.305 15.38L13.838 11.913 3.609 22.142c.378.401 1.004.449 1.712.048l11.984-6.81z"
        fill="#FF3D00"
      />
      <path
        d="M17.305 8.446L5.321 1.636C4.613 1.235 3.987 1.283 3.609 1.684L13.838 11.913l3.467-3.467z"
        fill="#00B0FF"
      />
    </svg>
  )
}

function AppChoiceModal({
  product,
  categories = [],
  contact,
  onClose,
}) {
  const [launchAttempted, setLaunchAttempted] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [deviceNotice, setDeviceNotice] = useState('')
  const modalRef = useRef(null)
  const closeBtnRef = useRef(null)

  // Reset state when product changes
  useEffect(() => {
    setLaunchAttempted(false)
    setShowDetails(false)
    setDeviceNotice('')
  }, [product?._id, product?.productIndex])

  // Device detection
  const isAndroid = useMemo(() => {
    if (typeof navigator === 'undefined') return false
    return /Android/i.test(navigator.userAgent)
  }, [])

  const isIOS = useMemo(() => {
    if (typeof navigator === 'undefined') return false
    return /iPhone|iPad|iPod/i.test(navigator.userAgent)
  }, [])

  // Lock body scroll and trap focus on mount
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus close button on open for accessibility
    if (closeBtnRef.current) {
      closeBtnRef.current.focus()
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  // Category name lookup
  const categoryName = useMemo(() => {
    if (!product?.category) return ''
    if (Array.isArray(categories)) {
      const match = categories.find((c) =>
        c && (
          String(c.slug).toLowerCase() === String(product.category).toLowerCase() ||
          String(c._id).toLowerCase() === String(product.category).toLowerCase() ||
          String(c.name).toLowerCase() === String(product.category).toLowerCase()
        )
      )
      if (match?.name) return match.name
    }
    if (/^category-[a-f0-9]+$/i.test(product.category)) {
      return ''
    }
    return product.category
  }, [product?.category, categories])

  if (!product) return null

  const isOutOfStock = product.stockStatus === 'out-of-stock' || product.lowStock
  const displayIndex = product.productIndex || 'PB-001'
  const rawPhone = contact?.mainPhone ? String(contact.mainPhone).replace(/[^\d+]/g, '') : ''

  // Option 1 — Open App Handler
  const handleOpenApp = () => {
    if (isAndroid) {
      setLaunchAttempted(true)
      setDeviceNotice('Palani Broilers செயலியைத் திறக்க முயற்சிக்கிறது…')

      // Verified Android intent URI with fallback to official Play Store listing
      const productId = product._id || ''
      const pIndex = product.productIndex || ''
      const intentUri = `intent://open#Intent;package=${ANDROID_PACKAGE_ID};action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;S.product_id=${encodeURIComponent(productId)};S.product_index=${encodeURIComponent(pIndex)};S.browser_fallback_url=${encodeURIComponent(PLAY_STORE_URL)};end`

      window.location.href = intentUri
      return
    }

    if (isIOS) {
      setLaunchAttempted(true)
      setDeviceNotice('Palani Broilers செயலி தற்போது Android சாதனங்களுக்கானது. Google Play-ல் பார்வையிடலாம்.')
      return
    }

    // Desktop or other operating systems
    setLaunchAttempted(true)
    setDeviceNotice('Palani Broilers மொபைல் செயலி Android சாதனங்களுக்கானது. அதிகாரப்பூர்வ Google Play பக்கத்தை பார்வையிடலாம்.')
  }

  // Option 2 — Download App Handler
  const handleDownloadApp = () => {
    window.open(PLAY_STORE_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className="modal-backdrop-overlay"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        ref={modalRef}
        className="app-choice-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-choice-title"
        aria-describedby="app-choice-desc"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeBtnRef}
          type="button"
          className="app-choice-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Selected Product Context Strip */}
        <div className="choice-product-summary-bar">
          <div className="choice-product-media-mini">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={`${product.nameTamil || ''} - ${product.nameEnglish || ''} | Palani Broilers`}
                className="choice-product-thumb"
              />
            ) : (
              <div className="choice-product-fallback-thumb">PB</div>
            )}
          </div>

          <div className="choice-product-meta-text">
            <div className="choice-product-badges">
              <span className="choice-index-tag">{displayIndex}</span>
              {categoryName && (
                <span className="choice-category-tag">{categoryName}</span>
              )}
              <span className={`choice-stock-tag ${isOutOfStock ? 'is-out' : 'is-in'}`}>
                {isOutOfStock ? 'Out of stock' : 'Available Today'}
              </span>
            </div>
            <h3 className="choice-product-name-tamil font-tamil">{product.nameTamil}</h3>
            <p className="choice-product-name-en">{product.nameEnglish}</p>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="app-choice-body">
          <div className="app-choice-heading-group">
            <div className="app-choice-badge">
              <Smartphone size={13} className="text-coral" />
              <span>PALANI BROILERS APP</span>
            </div>
            <h2 id="app-choice-title" className="app-choice-main-title">
              How would you like to continue?
            </h2>
            <p id="app-choice-desc" className="app-choice-description">
              Continue with Palani Broilers App for a better shopping experience.
            </p>
            <p className="app-choice-sub-tamil font-tamil">
              பழனி பிராய்லர்ஸ் அதிகாரப்பூர்வ செயலியில் புதிய இறைச்சியை விரைவாக ஆர்டர் செய்திடுங்கள்.
            </p>
          </div>

          {/* Two Prominent Action Cards */}
          <div className="app-choice-actions-grid">
            {/* Option 1 — Open App */}
            <button
              type="button"
              className="choice-action-card open-app-card"
              onClick={handleOpenApp}
              aria-label="Option 1: Open Palani Broilers App"
            >
              <div className="choice-card-icon-wrap bg-forest-icon">
                <Smartphone size={26} className="text-forest-deep" />
              </div>
              <div className="choice-card-text">
                <span className="choice-card-badge-pill">OPTION 1</span>
                <span className="choice-card-main-title">Open App</span>
                <span className="choice-card-tamil-title font-tamil">செயலியில் திறக்கவும்</span>
                <span className="choice-card-caption">
                  {isAndroid ? 'Launch installed Android app' : 'Designed for Android devices'}
                </span>
              </div>
            </button>

            {/* Option 2 — Download App */}
            <button
              type="button"
              className="choice-action-card download-app-card"
              onClick={handleDownloadApp}
              aria-label="Option 2: Download on Google Play Store"
            >
              <div className="choice-card-icon-wrap bg-play-icon">
                <GooglePlayIcon size={26} />
              </div>
              <div className="choice-card-text">
                <span className="choice-card-badge-pill pill-play">OPTION 2 · GOOGLE PLAY</span>
                <span className="choice-card-main-title">
                  Download App <ExternalLink size={14} className="inline ml-1 opacity-70" />
                </span>
                <span className="choice-card-tamil-title font-tamil">Google Play-ல் பெறவும்</span>
                <span className="choice-card-caption">Get the official app on Google Play</span>
              </div>
            </button>
          </div>

          {/* Responsive Device Guidance / Fallback Message */}
          {launchAttempted && (
            <div className="app-choice-fallback-notice" role="status">
              <div className="fallback-notice-icon">
                <Info size={18} className="text-coral" />
              </div>
              <div className="fallback-notice-content">
                <p className="fallback-notice-title font-tamil">
                  {deviceNotice || 'செயலி நிறுவப்படவில்லை என்றால் Google Play-ல் பதிவிறக்கம் செய்யவும்.'}
                </p>
                <p className="fallback-notice-desc">
                  If the app did not open automatically, install the verified app directly from Google Play Store:
                </p>
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fallback-play-btn"
                >
                  <GooglePlayIcon size={16} />
                  <span>Open Google Play Listing</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}

          {/* Expandable Product Details for Web Browsing */}
          <div className="choice-details-accordion">
            <button
              type="button"
              className="choice-details-toggle"
              onClick={() => setShowDetails(!showDetails)}
              aria-expanded={showDetails}
            >
              <span>தயாரிப்பு விவரங்கள் (View Product Details)</span>
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showDetails && (
              <div className="choice-details-content">
                <div className="choice-details-grid">
                  <div className="choice-detail-item">
                    <span className="detail-label">தயாரிப்பு குறியீடு (Code):</span>
                    <span className="detail-value">{displayIndex}</span>
                  </div>
                  <div className="choice-detail-item">
                    <span className="detail-label">வகை (Category):</span>
                    <span className="detail-value">{categoryName || 'General'}</span>
                  </div>
                  <div className="choice-detail-item">
                    <span className="detail-label">நிலை (Status):</span>
                    <span className={`detail-value ${isOutOfStock ? 'text-coral' : 'text-forest'}`}>
                      {isOutOfStock ? 'தற்போது கையிருப்பில் இல்லை (Out of Stock)' : 'இன்று கிடைக்கும் (Available Today)'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Secondary Actions */}
          <div className="app-choice-footer">
            {rawPhone && (
              <a
                href={`tel:${rawPhone}`}
                className="choice-footer-phone-link"
                aria-label={`Call Palani Broilers at ${rawPhone}`}
              >
                <PhoneCall size={15} />
                <span>தொலைபேசியில் ஆர்டர் செய்ய: <strong>{contact.mainPhone}</strong></span>
              </a>
            )}

            <button
              type="button"
              className="choice-footer-dismiss"
              onClick={onClose}
            >
              பொருட்களை தொடர்ந்து பார்க்க (Back to Catalog)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppChoiceModal
