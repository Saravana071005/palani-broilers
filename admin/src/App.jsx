import { useState, useEffect } from 'react'
import Header from './components/Header'
import ProductManagement from './components/ProductManagement'
import ContactManagement from './components/ContactManagement'
import axios from 'axios'

function App() {
  const [activeTab, setActiveTab] = useState('products')

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'products'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'contact'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-200'
            }`}
          >
            Contact Details
          </button>
        </div>

        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'contact' && <ContactManagement />}
      </main>
    </div>
  )
}

export default App
