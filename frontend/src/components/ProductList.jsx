import { Search } from 'lucide-react'

function ProductList({ products, categories, onProductClick, selectedCategory, onCategoryChange, searchQuery, onSearchChange }) {
  const categoryOptions = [
    { id: 'all', name: 'All' },
    ...categories.map((category) => ({ id: category.slug, name: category.name }))
  ]

  return (
    <section id="products" className="mb-12">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Products</h2>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => onProductClick(product)}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="relative h-48 bg-gray-100">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.nameEnglish}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                  <span className="text-4xl">🥩</span>
                </div>
              )}
              {product.stockStatus === 'out-of-stock' ? (
                <div className="absolute top-3 right-3 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Out of Stock
                </div>
              ) : product.lowStock && (
                <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Low Stock
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-gray-800 text-lg mb-1">
                {product.nameTamil}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {product.nameEnglish}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-600">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-gray-500">/{product.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </section>
  )
}

export default ProductList
