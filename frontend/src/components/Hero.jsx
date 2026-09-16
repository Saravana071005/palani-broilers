import { Sparkles, PhoneCall } from 'lucide-react'
import Logo3DShowcase from './Logo3DShowcase'

function GoogleRatingBadge() {
  return (
    <div className="google-rating-card" role="region" aria-label="Google Business Rating">
      <div className="google-icon-wrapper" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      </div>
      <div className="rating-details">
        <span className="rating-brand-title">palani broilers</span>
        <div className="rating-row">
          <span className="rating-numeric">4.1</span>
          <span className="rating-stars" aria-hidden="true">★★★★☆</span>
          <span className="rating-count">(20)</span>
        </div>
        <span className="rating-category-label">Chicken & Mutton Shop</span>
      </div>
    </div>
  )
}

function Hero({ contact }) {
  const phone = contact?.mainPhone ? String(contact.mainPhone).replace(/[^\d+]/g, '') : ''

  return (
    <section id="top" className="editorial-hero-showcase" aria-labelledby="hero-title-tamil">
      {/* Subtle organic ambient background */}
      <div className="hero-ambient-bg" aria-hidden="true">
        <div className="hero-ambient-glow glow-1" />
        <div className="hero-ambient-glow glow-2" />
        <span className="hero-bg-leaf leaf-bg-1">🍃</span>
        <span className="hero-bg-leaf leaf-bg-2">🌿</span>
      </div>

      {/* 3D Logo Showcase (Right column on desktop, 1st element on mobile) */}
      <div className="hero-section-logo">
        <Logo3DShowcase />
      </div>

      {/* Google Rating (Below description on desktop, 2nd element on mobile) */}
      <div className="hero-section-rating">
        <GoogleRatingBadge />
      </div>

      {/* Brand Badge (3rd element on mobile) */}
      <div className="hero-section-badge">
        <div className="hero-brand-badge">
          <Sparkles size={13} className="text-coral" />
          <span>PALANI BROILERS · THANJAVUR</span>
        </div>
      </div>

      {/* Tamil Heading (4th element on mobile) */}
      <div className="hero-section-title">
        <h1 id="hero-title-tamil" className="hero-tamil-title">
          <span className="sr-only">Palani Broilers (பழனி பிராய்லர்ஸ்) Thanjavur - </span>
          தினமும் புதிய,<br />
          உயர்தர இறைச்சி
        </h1>
      </div>

      {/* Tagline (5th element on mobile) */}
      <div className="hero-section-tagline">
        <p className="hero-english-tagline">
          “Fresh. Quality. Everyday.”
        </p>
      </div>

      {/* Description (6th element on mobile) */}
      <div className="hero-section-desc">
        <p className="hero-tamil-desc">
          பழனி பிராய்லர்ஸ் வழங்கும் தரமான பிராய்லர், நாட்டுக்கோழி, ஆட்டுக்கறி, மீன் மற்றும் கடல் உணவுகளை எளிதாக தேர்வு செய்து உடனே ஆர்டர் செய்திடுங்கள்.
        </p>

        {/* Desktop Call Row */}
        {phone && (
          <div className="hero-desktop-call-row">
            <a href={`tel:${phone}`} className="hero-btn-call">
              <PhoneCall size={16} />
              <span>☎ Call Now ({phone})</span>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero
