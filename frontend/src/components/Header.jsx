import { HelpCircle, Menu, X } from 'lucide-react'
import { useState } from 'react'
function Header() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)
  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/logo.png" 
              alt="Palani Broilers Logo" 
              className="w-16 h-16 rounded-full shadow-md object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">பழனி பிராய்லர்ஸ்</h1>
              <p className="text-orange-100 text-sm">Palani Broilers - Thanjavur</p>
            </div>
          </div>
          
          <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
          <nav className={open ? 'site-nav site-nav-open' : 'site-nav'}>
            <a onClick={close} href="#products">Products</a><a onClick={close} href="#contact">Contact</a><a onClick={close} href="#help"><HelpCircle size={17} /> Help</a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
