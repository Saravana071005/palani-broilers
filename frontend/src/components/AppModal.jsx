import { useEffect } from 'react'
import { X, Smartphone, Download, HelpCircle, PhoneCall } from 'lucide-react'

function AppModal({ product, onOpenApp, onDownloadApp, onClose, appOpenStatus, appUnavailable, onNeedHelp, contact }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  if (!product) return null
  const phone = String(contact?.mainPhone || '').replace(/[^\d+]/g, '')

  return (
    <div className="app-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="presentation" onMouseDown={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label="மூடவும்"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="text-orange-600" size={40} />
          </div>
          <h3 id="product-dialog-title" className="text-xl font-bold text-gray-800 mb-2">
            {product.nameTamil}
          </h3>
          <p className="text-gray-600">{product.nameEnglish}</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            ₹{product.price.toFixed(2)}/{product.unit}
          </p>
        </div>

        <p className="text-gray-600 text-center mb-5">உங்களுக்கு வசதியான முறையில் ஆர்டர் செய்யுங்கள்</p>

        {appOpenStatus && (
          <p className="text-sm text-center text-gray-600 mb-4" role="status">
            {appOpenStatus}
          </p>
        )}

        <div className="app-choice-grid">
          {phone && <div className="order-action-card call-action-card">
            <div className="action-card-heading"><span className="action-icon"><PhoneCall size={21} /></span><div><span className="fast-order-badge">விரைவான ஆர்டர்</span><strong>நேரடியாக ஆர்டர் செய்யுங்கள்</strong></div></div>
            <span>எங்களை அழைத்து உங்கள் ஆர்டரை பதிவு செய்யுங்கள்</span>
            <a className="modal-call" href={`tel:${phone}`}><PhoneCall size={20} /><span>இப்போது அழைக்கவும்</span></a>
          </div>}
          <div className="order-action-card app-action-card"><div className="action-card-heading"><span className="action-icon"><Smartphone size={20} /></span><strong>செயலி மூலம் ஆர்டர் செய்யுங்கள்</strong></div><span>Palani Broilers செயலியைத் திறக்கவும்</span>{!appUnavailable && <button onClick={onOpenApp} className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold"><Smartphone size={20} /><span>செயலியைத் திறக்கவும்</span></button>}</div>
          <div className="order-action-card download-action-card"><div className="action-card-heading"><span className="action-icon"><Download size={20} /></span><strong>செயலி இல்லையா?</strong></div><span>Android APK-ஐ பதிவிறக்கம் செய்யுங்கள்</span><button onClick={onDownloadApp} className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold"><Download size={20} /><span>செயலியை பதிவிறக்கவும்</span></button></div>
        </div>
        <button onClick={onNeedHelp} className="modal-help"><HelpCircle size={17} /> உதவி வேண்டுமா?</button>

        <p className="text-xs text-gray-400 text-center mt-4">
          செயலி இல்லையெனில் Download App வழியாக APK-ஐ பதிவிறக்கலாம்.
        </p>
      </div>
    </div>
  )
}

export default AppModal
