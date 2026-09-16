import { useState, useEffect } from 'react'
import { Menu, PhoneCall, X, HelpCircle, Search } from 'lucide-react'

function Header({ contact, onOpenHelp, onTriggerSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const phone = contact?.mainPhone ? String(contact.mainPhone).replace(/[^\d+]/g, '') : ''

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

  const handleSearchClick = () => {
    closeMenu()
    if (onTriggerSearch) {
      onTriggerSearch()
    } else {
      const el = document.getElementById('products')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        const input = el.querySelector('input[type="search"]')
        if (input) {
          setTimeout(() => input.focus(), 300)
        }
      }
    }
  }

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="site-header-inner">
        {/* Brand Lockup */}
        <a href="#top" className="brand-lockup" aria-label="Palani Broilers Home">
          <img src="/logo.png" alt="Palani Broilers - பழனி பிராய்லர்ஸ் Thanjavur Logo" />
          <div className="brand-text">
            <span className="brand-title-tamil">பழனி பிராய்லர்ஸ்</span>
            <span className="brand-subtitle-en">PALANI BROILERS</span>
          </div>
        </a>

        {/* Desktop Navigation Links & Call Now */}
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#products">Products</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
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

        {/* Mobile Header Icons: Search + Menu (No Call Now in Mobile Header) */}
        <div className="mobile-header-actions">
          <button
            type="button"
            className="mobile-header-icon-btn"
            onClick={handleSearchClick}
            aria-label="Search products"
          >
            <Search size={19} />
          </button>

          <button
            type="button"
            className="mobile-header-icon-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={20} />
          </button>
        </div>
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
          <a href="#about" onClick={closeMenu}>
            <span>About</span>
            <span className="nav-num">03</span>
          </a>
          <a href="#contact" onClick={closeMenu}>
            <span>Contact</span>
            <span className="nav-num">04</span>
          </a>
          <button type="button" onClick={handleHelpClick}>
            <span>Help Guide</span>
            <span className="nav-num">05</span>
          </button>

          {phone && (
            <a
              href={`tel:${phone}`}
              className="mobile-nav-call-action"
              onClick={closeMenu}
            >
              <PhoneCall size={18} />
              <span>☎ Call Now ({phone})</span>
            </a>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
