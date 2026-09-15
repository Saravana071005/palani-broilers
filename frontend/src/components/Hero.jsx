import { ArrowDownRight, PhoneCall, Sparkles } from 'lucide-react'

function Hero({ contact }) {
  const phone = String(contact?.mainPhone || '').replace(/[^\d+]/g, '')
  return <section id="top" className="editorial-hero" aria-labelledby="hero-title">
    <div className="hero-orbit hero-orbit-one" aria-hidden="true" /><div className="hero-orbit hero-orbit-two" aria-hidden="true" />
    <div className="hero-copy"><p className="eyebrow"><Sparkles size={14} /> PALANI BROILERS — THANJAVUR</p><p className="hero-brand-tamil">பழனி பிராய்லர்ஸ்</p><h1 id="hero-title"><span>தரம்</span><span>மற்றும்</span><span>நம்பிக்கை</span></h1><p className="hero-summary">தினமும் புதிய, தரமான இறைச்சி மற்றும் கடல் உணவுகளை எளிதாக தேர்வு செய்யுங்கள்.</p><div className="hero-actions"><a className="hero-primary" href="#products">பொருட்களை பார்க்க <ArrowDownRight /></a>{phone && <a className="hero-secondary" href={`tel:${phone}`}><PhoneCall /> இப்போது அழைக்கவும்</a>}</div></div>
    <div className="hero-art" aria-hidden="true"><div className="hero-art-disc" /><div className="hero-logo-wrap"><img src="/logo.png" alt="" /></div><p>FRESH<br />EVERY DAY</p></div>
  </section>
}
export default Hero
