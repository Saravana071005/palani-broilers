import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import axios from 'axios'
const API_URL = 'https://palani-broilers-api.vercel.app'

function ProductManagement() {
  const [products, setProducts] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`)
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    
    try {
      if (editingProduct) {
        await axios.put(`${API_URL}/api/products/${editingProduct._id}`, formData)
      } else {
        await axios.post(`${API_URL}/api/products`, formData)
      }
      fetchProducts()
      setShowForm(false)
      setEditingProduct(null)
      setImagePreview(null)
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setShowForm(true)
    setImagePreview(product.imageUrl || null)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    setImagePreview(null)
  }

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/api/products/${id}`)
        fetchProducts()
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Error deleting product')
      }
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <button
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSaveProduct} className="space-y-4 bg-gray-50 p-6 rounded-xl mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (Tamil)</label>
              <input
                name="nameTamil"
                defaultValue={editingProduct?.nameTamil}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
              <input
                name="nameEnglish"
                defaultValue={editingProduct?.nameEnglish}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingProduct?.price}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input
                name="unit"
                defaultValue={editingProduct?.unit || 'kg'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                defaultValue={editingProduct?.category || 'all'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All</option>
                <option value="live">Live Chicken</option>
                <option value="sea-crabs">Sea Crabs</option>
                <option value="karuvaadi">Karuvaadi</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                name="lowStock"
                type="checkbox"
                defaultChecked={editingProduct?.lowStock}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label className="text-sm font-medium text-gray-700">Low Stock</label>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={handleCancelForm}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center space-x-2"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center space-x-4">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.nameEnglish}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🥩</span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-800">{product.nameTamil}</p>
                <p className="text-sm text-gray-600">{product.nameEnglish}</p>
                <p className="text-sm text-orange-600 font-semibold">₹{product.price.toFixed(2)}/{product.unit}</p>
                {product.lowStock && (
                  <span className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded-full mt-1">
                    Low Stock
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditProduct(product)}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found. Add your first product!</p>
        </div>
      )}
    </div>
  )
}

export default ProductManagement
