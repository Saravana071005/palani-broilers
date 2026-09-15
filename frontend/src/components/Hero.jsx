import { ArrowDownRight, PhoneCall, Sparkles } from 'lucide-react'
import FeaturedProduct from './FeaturedProduct'

function Hero({ contact, featuredProduct, onProductClick, categoryName }) {
  const phone = String(contact?.mainPhone || '').replace(/[^\d+]/g, '')

  return (
    <section id="top" className="editorial-hero-compact" aria-labelledby="hero-main-title">
      {/* Editorial Copy */}
      <div className="hero-copy-column">
        <div className="hero-lead-badge">
          <Sparkles size={13} className="text-coral" />
          <span>Palani Broilers · Thanjavur</span>
        </div>

        <div className="hero-title-group">
          <h1 id="hero-main-title" className="hero-tamil-headline">
            தினமும் புதிய, உயர்தர இறைச்சி
          </h1>
          <p className="hero-tagline-editorial">
            “Fresh. Quality. Everyday.”
          </p>
        </div>

        <p className="hero-description">
          பிராய்லர், நாட்டுக்கோழி, ஆட்டுக்கறி மற்றும் கடல் உணவுகளை உடனுக்குடன் எளிதாக ஆர்டர் செய்திடுங்கள்.
        </p>

        <div className="hero-cta-row">
          <a href="#products" className="hero-cta-products">
            <span>பொருட்களை பார்க்க</span>
            <ArrowDownRight size={16} />
          </a>

          {phone && (
            <a href={`tel:${phone}`} className="hero-cta-call">
              <PhoneCall size={16} />
              <span>Call Now</span>
            </a>
          )}
        </div>
      </div>

      {/* Immediate Product Imagery / Featured Spotlight */}
      <div className="hero-media-column">
        {featuredProduct ? (
          <FeaturedProduct
            product={featuredProduct}
            onProductClick={onProductClick}
            categoryName={categoryName}
          />
        ) : (
          <div className="hero-spotlight-card p-8 text-center bg-white border border-sage-border rounded-2xl">
            <img src="/logo.png" alt="Palani Broilers" className="w-20 h-20 mx-auto mb-3 rounded-full" />
            <h3 className="font-tamil font-bold text-forest-deep text-lg">பழனி பிராய்லர்ஸ்</h3>
            <p className="text-earth-muted text-xs uppercase tracking-wider">FRESH MEAT & SEAFOOD</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero
