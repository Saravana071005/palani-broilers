import { useEffect } from 'react'
import { Download, HelpCircle, PhoneCall, Smartphone, X } from 'lucide-react'

function AppModal({ product, onOpenApp, onDownloadApp, onClose, appOpenStatus, appUnavailable, onNeedHelp, contact }) {
  useEffect(() => { const closeOnEscape = (event) => event.key === 'Escape' && onClose(); document.addEventListener('keydown', closeOnEscape); return () => document.removeEventListener('keydown', closeOnEscape) }, [onClose])
  if (!product) return null
  const phone = String(contact?.mainPhone || '').replace(/[^\d+]/g, '')
  const unavailable = product.stockStatus === 'out-of-stock' || product.lowStock
  return <div className="app-modal" role="presentation" onMouseDown={onClose}><div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label="மூடவும்"><X /></button>
    <div className="modal-image">{product.imageUrl ? <img src={product.imageUrl} alt={product.nameEnglish} /> : <span>PB</span>}</div>
    <div className="modal-details"><p className="eyebrow">{unavailable ? 'OUT OF STOCK' : 'AVAILABLE TODAY'}</p><h2 id="product-dialog-title">{product.nameTamil}</h2><p className="modal-english">{product.nameEnglish}</p><p className="modal-category">{product.category || 'Palani Broilers'}</p><p className="modal-note">உங்களுக்கு வசதியான முறையில் ஆர்டர் செய்யுங்கள்.</p>{appOpenStatus && <p className="modal-status" role="status">{appOpenStatus}</p>}
      <div className="modal-actions">{phone && <a className="modal-call" href={`tel:${phone}`}><PhoneCall /> இப்போது அழைக்கவும் <small>விரைவான வழி</small></a>}{!appUnavailable && <button type="button" className="modal-app" onClick={onOpenApp}><Smartphone /> செயலியைத் திறக்கவும்</button>}<button type="button" className="modal-download" onClick={onDownloadApp}><Download /> செயலியை பதிவிறக்கவும்</button><button type="button" className="modal-help" onClick={onNeedHelp}><HelpCircle /> உதவி வேண்டுமா?</button></div>
    </div>
  </div></div>
}
export default AppModal
