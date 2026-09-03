import { Phone, MapPin, Navigation } from 'lucide-react'

function ContactSection({ contact }) {
  if (!contact) return null

  return (
    <section id="contact" className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
      
      {/* Main Contact */}
      <div className="mb-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Main Office</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Phone size={20} className="text-orange-600" />
            <span className="text-gray-700">{contact.mainPhone || 'Not available'}</span>
          </div>
        </div>
      </div>

      {/* Branches */}
      {contact.branches && contact.branches.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Branches ({contact.branches.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contact.branches.map((branch, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition">
                <h4 className="font-bold text-gray-800 text-lg mb-3">{branch.name}</h4>
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
                  {branch.googleMapUrl && (
                    <a
                      href={branch.googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition mt-2"
                    >
                      <Navigation size={16} />
                      <span>Get Directions</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default ContactSection
