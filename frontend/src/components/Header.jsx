import { HelpCircle, Menu, PhoneCall, X } from 'lucide-react'
import { useState } from 'react'

function Header({ contact }) {
  const [open, setOpen] = useState(false)
  const phone = String(contact?.mainPhone || '').replace(/[^\d+]/g, '')
  const close = () => setOpen(false)
  const showHelp = () => {
    close()
    window.dispatchEvent(new Event('palani-open-help'))
    requestAnimationFrame(() => document.getElementById('help')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return <header className="site-header"><div className="site-header-inner">
    <a className="brand-lockup" href="#top" aria-label="Palani Broilers முகப்பு"><img src="/logo.png" alt="Palani Broilers logo" /><span><b>பழனி பிராய்லர்ஸ்</b><small>PALANI BROILERS · THANJAVUR</small></span></a>
    <nav className="desktop-nav" aria-label="Main navigation"><a href="#products">Products</a><a href="#contact">Contact</a><button type="button" onClick={showHelp}><HelpCircle size={16} /> Help</button>{phone && <a className="header-call" href={`tel:${phone}`}><PhoneCall size={16} /> Order / Call</a>}</nav>
    <button className="mobile-menu" type="button" onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
    {open && <div className="mobile-nav-overlay" role="dialog" aria-modal="true" aria-label="Navigation menu"><button className="mobile-nav-close" type="button" onClick={close} aria-label="Close menu"><X /></button><a onClick={close} href="#products">Products <span>01</span></a><a onClick={close} href="#categories">Categories <span>02</span></a><a onClick={close} href="#contact">Contact <span>03</span></a><a onClick={showHelp} href="#how-to-order">How to Order <span>04</span></a><button type="button" onClick={showHelp}>Help <span>05</span></button>{phone && <a className="mobile-nav-call" href={`tel:${phone}`}><PhoneCall /> இப்போது அழைக்கவும்</a>}</div>}
  </div></header>
}

export default Header
