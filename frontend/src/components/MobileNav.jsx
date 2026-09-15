import { PhoneCall, ShoppingBag, HelpCircle } from 'lucide-react'

function MobileNav({ contact, onOpenHelp }) {
  const phone = String(contact?.mainPhone || '').replace(/[^\d+]/g, '')

  return (
    <nav className="mobile-sticky-action-bar" aria-label="Mobile quick actions">
      <a href="#products" className="mobile-action-tab">
        <ShoppingBag size={18} />
        <span>பொருட்கள்</span>
      </a>

      <button
        type="button"
        onClick={onOpenHelp}
        className="mobile-action-tab"
      >
        <HelpCircle size={18} />
        <span>உதவி</span>
      </button>

      {phone ? (
        <a
          href={`tel:${phone}`}
          className="mobile-action-tab mobile-action-call-now"
        >
          <PhoneCall size={16} />
          <span>CALL NOW</span>
        </a>
      ) : (
        <a
          href="#contact"
          className="mobile-action-tab mobile-action-call-now"
        >
          <span>தொடர்பு</span>
        </a>
      )}
    </nav>
  )
}

export default MobileNav
