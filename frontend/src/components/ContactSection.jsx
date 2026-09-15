import { Phone, MapPin, Navigation } from 'lucide-react'

function ContactSection({ contact }) {
  if (!contact) return null

  const phoneLink = (phone) => `tel:${String(phone || '').replace(/[^\d+]/g, '')}`
  const mainPhoneRaw = phoneLink(contact.mainPhone)

  return (
    <section id="contact" className="editorial-contact-section" aria-labelledby="contact-heading">
      <div className="contact-headline-group">
        <div className="contact-section-tag">Palani Broilers · Thanjavur</div>
        <h2 id="contact-heading" className="contact-tamil-heading">
          தொடர்பு கொள்ளவும்
        </h2>
        <p className="contact-subheading">
          புதிய இறைச்சி மற்றும் கடல் உணவுகளுக்கான நேரடி தொலைபேசி ஆர்டர் & கிளைகள்.
        </p>
      </div>

      {/* Main Office / Hotline */}
      <div className="contact-main-hero-card">
        <div>
          <span className="text-xs uppercase tracking-widest text-sage font-bold block mb-1">
            முதன்மை தொடர்பு / Main Hotline
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            {contact.mainPhone || 'தகவல் இல்லை'}
          </div>
        </div>

        {contact.mainPhone && (
          <a
            className="contact-main-phone-btn"
            href={mainPhoneRaw}
          >
            <Phone size={20} />
            <span>இப்போது அழைக்கவும் (CALL NOW)</span>
          </a>
        )}
      </div>

      {/* Branches Showcase */}
      {contact.branches && contact.branches.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-coral" />
            <h3 className="text-lg font-bold text-white font-tamil m-0">
              எங்கள் கிளைகள் ({contact.branches.length})
            </h3>
          </div>

          <div className="branches-grid">
            {contact.branches.map((branch, index) => (
              <div key={branch._id || index} className="branch-editorial-card">
                <div>
                  <h4 className="branch-name">{branch.name}</h4>

                  {branch.phone && (
                    <a
                      className="branch-phone-link"
                      href={phoneLink(branch.phone)}
                    >
                      <Phone size={15} />
                      <span>{branch.phone}</span>
                    </a>
                  )}

                  <div className="branch-address">
                    {branch.address}
                    <br />
                    {branch.city}, {branch.state}
                    {branch.pincode ? ` - ${branch.pincode}` : ''}
                  </div>
                </div>

                {branch.googleMapUrl && (
                  <a
                    href={branch.googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="branch-map-btn"
                  >
                    <Navigation size={14} />
                    <span>வழிகாட்டி (Map)</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default ContactSection
