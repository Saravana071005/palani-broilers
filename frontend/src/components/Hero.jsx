import { ArrowDown, Sparkles } from 'lucide-react'

function Hero() {
  return (
    <section className="hero-shell" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-kicker"><Sparkles size={15} /><span>Palani Broilers - Thanjavur</span></div>
        <p className="hero-tamil">பழனி பிராய்லர்ஸ்</p>
        <h1 id="hero-title">Our Products, brought into focus.</h1>
        <p>Explore the current Palani Broilers selection through a richer, more immersive product experience.</p>
        <a className="hero-cta" href="#products">Explore products <ArrowDown size={18} /></a>
      </div>
      <div className="hero-visual" aria-hidden="true"><div className="hero-halo" /><div className="hero-logo-frame"><img src="/logo.png" alt="" /></div></div>
    </section>
  )
}

export default Hero
