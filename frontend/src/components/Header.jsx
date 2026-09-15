import { useState, useEffect } from 'react'
import { Menu, PhoneCall, X, HelpCircle } from 'lucide-react'

function Header({ contact, onOpenHelp }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const phone = String(contact?.mainPhone || '').replace(/[^\d+]/g, '')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setMobileMenuOpen(false)

  const handleHelpClick = () => {
    closeMenu()
    if (onOpenHelp) {
      onOpenHelp()
    }
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header-inner">
        {/* Brand Left */}
        <a href="#top" className="brand-lockup" aria-label="Palani Broilers Home">
          <img src="/logo.png" alt="Palani Broilers" />
          <div className="brand-text">
            <span className="brand-title-tamil">பழனி பிராய்லர்ஸ்</span>
            <span className="brand-subtitle-en">PALANI BROILERS</span>
          </div>
        </a>

        {/* Desktop Nav Center / Right */}
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#products">Products</a>
          <a href="#categories">Categories</a>
          <a href="#contact">Contact</a>
          <button type="button" onClick={handleHelpClick}>
            <HelpCircle size={15} />
            <span>Help</span>
          </button>
          {phone && (
            <a href={`tel:${phone}`} className="header-call-btn">
              <PhoneCall size={14} />
              <span>Call Now</span>
            </a>
          )}
        </nav>

        {/* Mobile Menu Trigger */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Nav Overlay Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <button
            type="button"
            className="mobile-nav-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>

          <a href="#products" onClick={closeMenu}>
            <span>Products</span>
            <span className="nav-num">01</span>
          </a>
          <a href="#categories" onClick={closeMenu}>
            <span>Categories</span>
            <span className="nav-num">02</span>
          </a>
          <a href="#contact" onClick={closeMenu}>
            <span>Contact</span>
            <span className="nav-num">03</span>
          </a>
          <button type="button" onClick={handleHelpClick}>
            <span>Help Guide</span>
            <span className="nav-num">04</span>
          </button>

          {phone && (
            <a
              href={`tel:${phone}`}
              className="mobile-nav-call-action"
              onClick={closeMenu}
            >
              <PhoneCall size={18} />
              <span>இப்போது அழைக்கவும் ({phone})</span>
            </a>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
