import { LogOut } from 'lucide-react'

function Header({ onLogout }) {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/logo.png" 
              alt="Palani Broilers Logo" 
              className="w-12 h-12 rounded-full shadow-md object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Palani Broilers</h1>
              <p className="text-orange-100 text-sm">Admin Panel</p>
            </div>
          </div>
          <button className="admin-logout" type="button" onClick={onLogout}><LogOut size={17} />Logout</button>
        </div>
      </div>
    </header>
  )
}

export default Header
