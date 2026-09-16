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
          Thanjavur's Trusted Source for 100% Fresh Meat &amp; Seafood
        </p>
      </div>

      <div className="about-editorial-grid">
        <div className="about-story-card">
          <h3 className="about-card-title font-tamil">
            தினமும் புதிய, தரமான இறைச்சி தேர்வு
          </h3>
          <p className="about-card-paragraph">
            <strong>பழனி பிராய்லர்ஸ் (Palani Broilers)</strong> தஞ்சாவூர் நகரில் பல ஆண்டுகளாக மக்களுக்குத் தூய்மையான, உயர்தர இறைச்சி மற்றும் கடல் உணவுகளை வழங்கி வருகிறது. பண்ணையிலிருந்து தினந்தோறும் நேரடியாகத் தேர்வு செய்யப்படும் புதிய பிராய்லர் கோழி, நாட்டுக்கோழி, மென்மையான ஆட்டுக்கறி, மற்றும் கடல்/ஆற்று மீன் வகைகள் சுகாதாரமான முறையில் வெட்டி உடனடியாக வழங்கப்படுகின்றன.
          </p>
          <p className="about-card-paragraph">
            ஒவ்வொரு நாளும் சுகாதாரக் கட்டுப்பாடுகளுடன் கூடிய வெட்டு முறை, சுத்தமான நீர் கழுவல், மற்றும் சரியான வெப்பநிலை பராமரிப்புடன் வாடிக்கையாளர்களுக்குச் சிறந்த அனுபவத்தை உறுதி செய்கிறோம்.
          </p>
        </div>

        <div className="about-highlights-card">
          <div className="about-feature-item">
            <div className="about-feature-icon">
              <ShieldCheck size={22} className="text-forest" />
            </div>
            <div>
              <h4 className="about-feature-name">உயர்தர சுகாதாரம் (100% Hygienic)</h4>
              <p className="about-feature-desc">அனைத்து இறைச்சிகளும் சுத்தமான முறையில் வெட்டப்பட்டு சுகாதாரமாகப் பேக் செய்யப்படுகிறது.</p>
            </div>
          </div>

          <div className="about-feature-item">
            <div className="about-feature-icon">
              <Award size={22} className="text-forest" />
            </div>
            <div>
              <h4 className="about-feature-name">பண்ணை நேரடி தேர்வு (Farm Fresh)</h4>
              <p className="about-feature-desc">உயிர் கோழி, நாட்டுக்கோழி மற்றும் பண்ணை முட்டைகள் தினசரி தரப் பரிசோதனைக்குப் பின் வழங்கப்படுகிறது.</p>
            </div>
          </div>

          <div className="about-feature-item">
            <div className="about-feature-icon">
              <Truck size={22} className="text-forest" />
            </div>
            <div>
              <h4 className="about-feature-name">விரைவான நேரடி ஆர்டர் (Fast Delivery)</h4>
              <p className="about-feature-desc">தொலைபேசி மூலம் ஆர்டர் செய்து தஞ்சாவூர் கிளைகளில் பெறலாம் அல்லது உடனடி டெலிவரி வசதி பெறலாம்.</p>
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
            சுவையான பிராய்லர் துண்டுகள், எலும்பில்லா இறைச்சி, லெக் பீஸ் மற்றும் இயற்கை நாட்டுக்கோழி.
          </p>
        </div>

        <div className="about-pillar-card">
          <span className="about-pillar-tamil">ஆட்டுக்கறி</span>
          <span className="about-pillar-en">Tender Mutton</span>
          <p className="about-pillar-copy">
            முழுமையாக ஆய்வு செய்யப்பட்ட தரமான இளங்கடா ஆட்டுக்கறி, ஈரல் மற்றும் எலும்பு துண்டுகள்.
          </p>
        </div>

        <div className="about-pillar-card">
          <span className="about-pillar-tamil">மீன் &amp; கடல் உணவுகள்</span>
          <span className="about-pillar-en">Sea &amp; River Fish</span>
          <p className="about-pillar-copy">
            வஞ்சிரம், சங்கரா, கொடுவா, இறால், நண்டு மற்றும் தரமான கருவாடு வகைகள்.
          </p>
        </div>

        <div className="about-pillar-card">
          <span className="about-pillar-tamil">பண்ணை முட்டை</span>
          <span className="about-pillar-en">Farm Eggs</span>
          <p className="about-pillar-copy">
            புதிய வெள்ளை முட்டை மற்றும் இயற்கை நாட்டுக்கோழி முட்டை தினசரி கிடைக்கும்.
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