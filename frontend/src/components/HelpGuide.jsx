import { useState, useEffect } from 'react'
import { Download, ChevronDown, ChevronUp, PhoneCall, Sparkles } from 'lucide-react'

const visualSteps = [
  {
    step: '01',
    title: 'PRODUCT தேர்வு செய்யவும்',
    subtitle: 'Browse & Choose',
    desc: 'இணையதளத்தில் உங்களுக்குத் தேவையான புதிய இறைச்சி மற்றும் கடல் உணவுகளை வகைகளின்படி தேர்வு செய்யுங்கள்.',
    image: '/help/open-app.jpeg'
  },
  {
    step: '02',
    title: 'APP பதிவிறக்கம் / திறக்கவும்',
    subtitle: 'Install APK or Open App',
    desc: 'Android போனில் Palani Broilers APK பதிவிறக்கம் செய்து நிறுவவும், அல்லது செயலியை நேரடியாக திறக்கவும்.',
    image: '/help/install.jpeg'
  },
  {
    step: '03',
    title: 'APP அல்லது CALL மூலம் ஆர்டர்',
    subtitle: 'Easy Order',
    desc: 'செயலியில் Cart வழியாக ஆர்டர் செய்யலாம் அல்லது CALL NOW மூலம் நேரடியாக தொலைபேசியில் ஆர்டர் தரலாம்.',
    image: '/help/checkout.jpeg'
  }
]

function HelpGuide({ onDownloadApp, contact }) {
  const [isOpen, setIsOpen] = useState(true)
  const rawPhone = contact?.mainPhone ? String(contact.mainPhone).replace(/[^\d+]/g, '') : ''

  useEffect(() => {
    const handleOpenHelp = () => {
      setIsOpen(true)
    }
    window.addEventListener('palani-open-help', handleOpenHelp)
    return () => window.removeEventListener('palani-open-help', handleOpenHelp)
  }, [])

  return (
    <section id="help" className="help-guide-card" aria-labelledby="help-guide-heading">
      <div className="help-guide-header">
        <div>
          <div className="flex items-center gap-2 text-forest text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles size={13} className="text-coral" />
            <span>எளிய வழிகாட்டி</span>
          </div>
          <h2 id="help-guide-heading" className="help-guide-title">
            ஆர்டர் செய்வது எப்படி?
          </h2>
          <p className="help-guide-sub">
            3 எளிய படிகளில் தரமான இறைச்சியை ஆர்டர் செய்திடுங்கள்.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onDownloadApp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest text-white text-xs font-bold transition hover:bg-forest-light"
          >
            <Download size={14} />
            <span>APK பதிவிறக்கம்</span>
          </button>

          {rawPhone && (
            <a
              href={`tel:${rawPhone}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral text-white text-xs font-bold transition hover:bg-coral-hover"
            >
              <PhoneCall size={14} />
              <span>நேரடி அழைப்பு</span>
            </a>
          )}

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full border border-sage-border text-forest hover:bg-sage transition"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Collapse help guide' : 'Expand help guide'}
          >
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="help-guide-grid">
          {visualSteps.map((stepItem) => (
            <div key={stepItem.step} className="help-step-item">
              <span className="help-step-number">{stepItem.step}</span>
              <h3 className="help-step-title">{stepItem.title}</h3>
              <p className="help-step-desc">{stepItem.desc}</p>
              <div className="help-step-img-wrap">
                <img
                  src={stepItem.image}
                  alt={stepItem.title}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default HelpGuide
