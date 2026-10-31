import { PhoneCall, Instagram, Facebook } from 'lucide-react'

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.nextfuturetechnology.palanibroilers&pcampaignid=web_share'
const INSTAGRAM_URL = 'https://www.instagram.com/palani_broilers/'
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61557441899218'

function Footer({ contact, onNavigateComments }) {
  const phone = String(contact?.mainPhone || '').replace(/[^\d+]/g, '')

  const handleCommentsClick = (e) => {
    e.preventDefault()
    if (onNavigateComments) {
      onNavigateComments()
    } else {
      if (window.location.pathname !== '/comments') {
        window.history.pushState({}, '', '/comments')
      }
      document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <footer className="minimal-editorial-footer">
      {/* Top Section: App Download & Social Media */}
      <div className="footer-connect-row">
        {/* Experience on Mobile / Google Play */}
        <div className="footer-app-section">
          <span className="footer-section-heading">EXPERIENCE PALANI BROILERS ON MOBILE</span>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-google-play-badge"
            aria-label="Get Palani Broilers App on Google Play"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="google-play-icon"
              aria-hidden="true"
            >
              <path
                d="M3.609 1.814C3.393 2.052 3.25 2.426 3.25 2.923v18.154c0 .497.143.871.359 1.109l.063.063 10.166-10.166v-.24L3.672 1.751l-.063.063z"
                fill="#00E676"
              />
              <path
                d="M17.228 15.438l-3.39-3.39v-.24l3.39-3.39.077.044 4.015 2.281c1.146.65 1.146 1.716 0 2.366l-4.015 2.281-.077.058z"
                fill="#FFD600"
              />
              <path
                d="M17.305 15.38L13.838 11.913 3.609 22.142c.378.401 1.004.449 1.712.048l11.984-6.81z"
                fill="#FF3D00"
              />
              <path
                d="M17.305 8.446L5.321 1.636C4.613 1.235 3.987 1.283 3.609 1.684L13.838 11.913l3.467-3.467z"
                fill="#00B0FF"
              />
            </svg>
            <div className="google-play-badge-text">
              <span className="google-play-badge-subtitle">GET IT ON</span>
              <span className="google-play-badge-title">Google Play</span>
            </div>
          </a>
        </div>

        {/* Social Media Section */}
        <div className="footer-social-section">
          <span className="footer-section-heading">KEEP IN TOUCH</span>
          <div className="footer-social-links">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-circle instagram"
              aria-label="Follow Palani Broilers on Instagram"
              title="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-circle facebook"
              aria-label="Follow Palani Broilers on Facebook"
              title="Facebook"
            >
              <Facebook size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section: Brand, Links & Copyright */}
      <div className="footer-bottom-row">
        <div className="footer-brand">
          <img src="/logo.png" alt="Palani Broilers - பழனி பிராய்லர்ஸ் Thanjavur Logo" />
          <div>
            <span className="font-bold text-forest-deep font-tamil block text-sm">
              பழனி பிராய்லர்ஸ்
            </span>
            <span className="text-xs text-earth-muted tracking-wider uppercase font-semibold">
              PALANI BROILERS · THANJAVUR
            </span>
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#products">Products</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
          <a href="/comments" onClick={handleCommentsClick}>கருத்துகள்</a>
          <a href="#contact">Contact</a>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center gap-1.5 text-coral font-bold hover:underline"
            >
              <PhoneCall size={14} />
              <span>Call Now</span>
            </a>
          )}
        </nav>

        <div className="footer-copyright">
          © {new Date().getFullYear()} Palani Broilers. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
