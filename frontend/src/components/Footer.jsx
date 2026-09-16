import { PhoneCall } from 'lucide-react'

function Footer({ contact, onOpenHelp }) {
  const phone = String(contact?.mainPhone || '').replace(/[^\d+]/g, '')

  return (
    <footer className="minimal-editorial-footer">
      <div className="footer-brand">
        <img src="/logo.png" alt="Palani Broilers - பழனி பிராய்லர்ஸ் Thanjavur Logo" />
        <div>
          <span className="font-bold text-forest-deep font-tamil block text-sm">
            பழனி பிராய்லர்ஸ்
          </span>
          <span className="text-xs text-earth-muted tracking-wider uppercase font-semibold">
            PALANI BROILERS · THANJAVUR
          </span>
        </div>
      </div>

      <nav className="footer-links" aria-label="Footer navigation">
        <a href="#products">Products</a>
        <a href="#categories">Categories</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <button
          type="button"
          onClick={onOpenHelp}
          className="text-earth hover:text-forest-deep transition"
        >
          Help
        </button>
        {phone && (
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-1.5 text-coral font-bold hover:underline"
          >
            <PhoneCall size={14} />
            <span>Call Now</span>
          </a>
        )}
      </nav>

      <div className="footer-copyright">
        © {new Date().getFullYear()} Palani Broilers. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
