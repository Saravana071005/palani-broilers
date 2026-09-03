import { useState, useEffect } from 'react'
import { Edit, Save, X, Phone, MapPin, Plus, Trash2 } from 'lucide-react'
import axios from 'axios'

const API_URL = 'https://palani-broilers-api.vercel.app'

function ContactManagement() {
  const [contact, setContact] = useState(null)
  const [editingMain, setEditingMain] = useState(false)
  const [editingBranch, setEditingBranch] = useState(null)
  const [showBranchForm, setShowBranchForm] = useState(false)

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/contact`)
      setContact(response.data)
    } catch (error) {
      console.error('Error fetching contact:', error)
    }
  }

  const handleSaveMain = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${API_URL}/api/contact`, {
        mainPhone: e.target.mainPhone.value
      })
      fetchContact()
      setEditingMain(false)
    } catch (error) {
      console.error('Error saving contact:', error)
      alert('Error saving contact details')
    }
  }

  const handleAddBranch = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/api/contact/branches`, {
        name: e.target.name.value,
        phone: e.target.phone.value,
        address: e.target.address.value,
        city: e.target.city.value,
        state: e.target.state.value,
        pincode: e.target.pincode.value,
        googleMapUrl: e.target.googleMapUrl.value
      })
      fetchContact()
      setShowBranchForm(false)
    } catch (error) {
      console.error('Error adding branch:', error)
      alert('Error adding branch')
    }
  }

  const handleEditBranch = async (e, index) => {
    e.preventDefault()
    try {
      await axios.put(`${API_URL}/api/contact/branches/${index}`, {
        name: e.target.name.value,
        phone: e.target.phone.value,
        address: e.target.address.value,
        city: e.target.city.value,
        state: e.target.state.value,
        pincode: e.target.pincode.value,
        googleMapUrl: e.target.googleMapUrl.value
      })
      fetchContact()
      setEditingBranch(null)
    } catch (error) {
      console.error('Error updating branch:', error)
      alert('Error updating branch')
    }
  }

  const handleDeleteBranch = async (index) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await axios.delete(`${API_URL}/api/contact/branches/${index}`)
        fetchContact()
      } catch (error) {
        console.error('Error deleting branch:', error)
        alert('Error deleting branch')
      }
    }
  }

  if (!contact) {
    return <div className="bg-white rounded-2xl shadow-lg p-6">Loading...</div>
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Details Management</h2>

      {/* Main Contact */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Main Contact</h3>
          {!editingMain && (
            <button
              onClick={() => setEditingMain(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center space-x-2"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
          )}
        </div>

        {editingMain ? (
          <form onSubmit={handleSaveMain} className="space-y-4 bg-gray-50 p-6 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Phone</label>
                <input
                  name="mainPhone"
                  defaultValue={contact.mainPhone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
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
                onClick={() => setEditingMain(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start space-x-4 bg-gray-50 p-4 rounded-xl">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Main Phone</h3>
                <p className="text-gray-600">{contact.mainPhone || 'Not set'}</p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Branches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Branches ({contact.branches?.length || 0})</h3>
          <button
            onClick={() => setShowBranchForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Add Branch</span>
          </button>
        </div>

        {showBranchForm && (
          <form onSubmit={handleAddBranch} className="space-y-4 bg-gray-50 p-6 rounded-xl mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Branch</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                <input
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  name="phone"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  name="address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  name="city"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  name="state"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input
                  name="pincode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
                <input
                  name="googleMapUrl"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Add Branch</span>
              </button>
              <button
                type="button"
                onClick={() => setShowBranchForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {contact.branches?.map((branch, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-xl">
              {editingBranch === index ? (
                <form onSubmit={(e) => handleEditBranch(e, index)} className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Edit Branch: {branch.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                      <input
                        name="name"
                        defaultValue={branch.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        name="phone"
                        defaultValue={branch.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        name="address"
                        defaultValue={branch.address}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        name="city"
                        defaultValue={branch.city}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        name="state"
                        defaultValue={branch.state}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        name="pincode"
                        defaultValue={branch.pincode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
                      <input
                        name="googleMapUrl"
                        defaultValue={branch.googleMapUrl}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>Update</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingBranch(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center space-x-2"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg mb-2">{branch.name}</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone size={16} className="text-orange-600" />
                          <span className="text-gray-600">{branch.phone}</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <MapPin size={16} className="text-orange-600 mt-1" />
                          <span className="text-gray-600">
                            {branch.address}<br />
                            {branch.city}, {branch.state}
                            {branch.pincode && <>, {branch.pincode}</>}
                          </span>
                        </div>
                      </div>
                      {branch.googleMapUrl && (
                        <a
                          href={branch.googleMapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-orange-600 hover:text-orange-700 transition"
                        >
                          View on Google Maps
                        </a>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setEditingBranch(index)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteBranch(index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {(!contact.branches || contact.branches.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            No branches added yet. Click "Add Branch" to add your first branch.
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactManagement
