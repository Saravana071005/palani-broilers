import { PhoneCall, Sparkles } from 'lucide-react'
import Logo3DShowcase from './Logo3DShowcase'

function Hero({ contact }) {
  const phone = contact?.mainPhone ? String(contact.mainPhone).replace(/[^\d+]/g, '') : ''

  return (
    <section id="top" className="editorial-hero-showcase" aria-labelledby="hero-title-tamil">
      {/* Subtle organic ambient background elements */}
      <div className="hero-ambient-bg" aria-hidden="true">
        <div className="hero-ambient-glow glow-1" />
        <div className="hero-ambient-glow glow-2" />
        <span className="hero-bg-leaf leaf-bg-1">🍃</span>
        <span className="hero-bg-leaf leaf-bg-2">🌿</span>
      </div>

      {/* Left Column: Editorial Headline & Single Call Now Action */}
      <div className="hero-left-column">
        <div className="hero-brand-badge">
          <Sparkles size={13} className="text-coral" />
          <span>PALANI BROILERS · THANJAVUR</span>
        </div>

        <div className="hero-heading-group">
          <h1 id="hero-title-tamil" className="hero-tamil-title">
            தினமும் புதிய,<br />
            உயர்தர இறைச்சி
          </h1>
          <p className="hero-english-tagline">
            “Fresh. Quality. Everyday.”
          </p>
        </div>

        <p className="hero-tamil-desc">
          பழனி பிராய்லர்ஸ் வழங்கும் தரமான பிராய்லர், நாட்டுக்கோழி, ஆட்டுக்கறி, மீன் மற்றும் கடல் உணவுகளை எளிதாக தேர்வு செய்து உடனே ஆர்டர் செய்திடுங்கள்.
        </p>

        {/* Only the Call Now action is shown */}
        <div className="hero-actions-container">
          {phone ? (
            <a href={`tel:${phone}`} className="hero-btn-call">
              <PhoneCall size={17} />
              <span>☎ Call Now</span>
            </a>
          ) : null}
        </div>
      </div>

      {/* Right Column: 3D Logo Showcase & Organic Platform */}
      <div className="hero-right-column">
        <Logo3DShowcase />
      </div>
    </section>
  )
}

export default Hero
