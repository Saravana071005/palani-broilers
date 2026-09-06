import { ArrowDown, Sparkles } from 'lucide-react'

function Hero() {
  return (
    <section className="hero-shell" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-kicker"><Sparkles size={15} /><span>Palani Broilers - Thanjavur</span></div>
        <p className="hero-tamil">பழனி பிராய்லர்ஸ்</p>
        <h1 id="hero-title">தரம் மற்றும் நம்பிக்கை</h1>
        <p>தினமும் புதிய, தரமான இறைச்சி மற்றும் கடல் உணவுகளை எளிதாகத் தேர்வு செய்யுங்கள்.</p>
        <a className="hero-cta" href="#products">பொருட்களைப் பார்க்கவும் <ArrowDown size={18} /></a>
      </div>
      <div className="hero-visual" aria-hidden="true"><div className="hero-halo" /><div className="hero-logo-frame"><img src="/logo.png" alt="" /></div></div>
    </section>
  )
}

export default Hero
