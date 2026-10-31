import { Award, ShieldCheck, Truck, Sparkles, MapPin, PhoneCall } from 'lucide-react'

function AboutSection({ contact }) {
  const mainPhone = contact?.mainPhone || '+91 7305456147'
  const rawPhone = String(mainPhone).replace(/[^\d+]/g, '')

  return (
    <section id="about" className="editorial-about-section" aria-labelledby="about-heading">
      <div className="about-header-group">
        <div className="about-tag">
          <Sparkles size={13} className="text-coral" />
          <span>Palani Broilers · Thanjavur Heritage</span>
        </div>
        <h2 id="about-heading" className="about-title-tamil">
          பழனி பிராய்லர்ஸ் பற்றி
        </h2>
        <p className="about-subtitle-en">
          Thanjavur's Trusted Source for Fresh Meat &amp; Seafood
        </p>
      </div>

      <div className="about-editorial-grid">
        {/* Left Story Card */}
        <div className="about-story-card">
          <h3 className="about-card-title font-tamil">
            தினமும் புதிய, தரமான இறைச்சி!
          </h3>
          <p className="about-card-paragraph">
            பழனி பிராய்லர்ஸ் தஞ்சாவூரில் தரமான கோழி, ஆட்டுக்கறி, மீன் மற்றும் முட்டைகளை வழங்குகிறது.
          </p>
          <p className="about-card-paragraph">
            சுகாதாரமான முறையில் சுத்தம் செய்யப்பட்ட புதிய இறைச்சி, நம்பிக்கையான தரத்துடன் கிடைக்கும்.
          </p>
        </div>

        {/* Right Highlights Card */}
        <div className="about-highlights-card">
          <div className="about-feature-item">
            <div className="about-feature-icon">
              <ShieldCheck size={22} className="text-forest" />
            </div>
            <div>
              <h4 className="about-feature-name">உயர்தர சுகாதாரம்</h4>
              <p className="about-feature-desc">சுத்தமான முறையில் பதப்படுத்தப்பட்ட இறைச்சி.</p>
            </div>
          </div>

          <div className="about-feature-item">
            <div className="about-feature-icon">
              <Award size={22} className="text-forest" />
            </div>
            <div>
              <h4 className="about-feature-name">பண்ணைத் தரம்</h4>
              <p className="about-feature-desc">புத்தம் புதிய கோழி, மீன் மற்றும் முட்டைகள்.</p>
            </div>
          </div>

          <div className="about-feature-item">
            <div className="about-feature-icon">
              <Truck size={22} className="text-forest" />
            </div>
            <div>
              <h4 className="about-feature-name">விரைவான டெலிவரி</h4>
              <p className="about-feature-desc">உங்கள் ஆர்டர் நேரடியாக உங்கள் வீட்டிற்கு.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Overview Pillars */}
      <div className="about-pillars-grid">
        <div className="about-pillar-card">
          <span className="about-pillar-tamil">கோழி இறைச்சி</span>
          <span className="about-pillar-en">Fresh Chicken</span>
          <p className="about-pillar-copy">
            புதிய பிராய்லர் கோழி வகைகள்.
          </p>
        </div>

        <div className="about-pillar-card">
          <span className="about-pillar-tamil">ஆட்டுக்கறி</span>
          <span className="about-pillar-en">Tender Mutton</span>
          <p className="about-pillar-copy">
            தரமான ஆட்டிறைச்சி வகைகள்.
          </p>
        </div>

        <div className="about-pillar-card">
          <span className="about-pillar-tamil">மீன் &amp; கடல் உணவுகள்</span>
          <span className="about-pillar-en">Sea &amp; River Fish</span>
          <p className="about-pillar-copy">
            புதிய கடல் மற்றும் ஆற்று மீன்கள்.
          </p>
        </div>

        <div className="about-pillar-card">
          <span className="about-pillar-tamil">பண்ணை முட்டை</span>
          <span className="about-pillar-en">Farm Eggs</span>
          <p className="about-pillar-copy">
            புதிய நாட்டுக்கோழி மற்றும் பண்ணை முட்டைகள்.
          </p>
        </div>
      </div>

      {/* Quick Location & Contact Bar */}
      <div className="about-location-bar">
        <div className="about-location-info">
          <MapPin size={18} className="text-coral" />
          <span>
            <strong>தஞ்சாவூர் கிளைகள்:</strong> ஞானம் நகர் (புளியந்தோப்பு) &amp; பூக்கார தெரு (சுப்பிரமணியசுவாமி கோயில் அருகில்).
          </span>
        </div>
        {rawPhone && (
          <a href={`tel:${rawPhone}`} className="about-call-link">
            <PhoneCall size={16} />
            <span>ஆர்டர் செய்ய: {mainPhone}</span>
          </a>
        )}
      </div>
    </section>
  )
}

export default AboutSection
