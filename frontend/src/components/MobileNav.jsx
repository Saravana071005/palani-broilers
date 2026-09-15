import { PhoneCall } from 'lucide-react'

function MobileNav({ contact }) {
  const phone = contact?.mainPhone ? String(contact.mainPhone).replace(/[^\d+]/g, '') : ''

  if (!phone) return null

  return (
    <div className="mobile-fixed-cta-container">
      <a
        href={`tel:${phone}`}
        className="mobile-fixed-call-btn"
        aria-label={`Call Palani Broilers at ${phone}`}
      >
        <PhoneCall size={20} />
        <span>☎ Call Now</span>
      </a>
    </div>
  )
}

export default MobileNav
