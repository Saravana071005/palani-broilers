import { ShoppingCart, Menu } from 'lucide-react'

function Header() {
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
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#products" className="text-white hover:text-orange-200 transition">
              Products
            </a>
            <a href="#contact" className="text-white hover:text-orange-200 transition">
              Contact
            </a>
            <button className="bg-white text-orange-600 px-4 py-2 rounded-full font-semibold hover:bg-orange-100 transition flex items-center space-x-2">
              <ShoppingCart size={20} />
              <span>Cart</span>
            </button>
          </nav>

          <button className="md:hidden text-white">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
