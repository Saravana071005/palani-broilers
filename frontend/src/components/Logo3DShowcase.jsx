import { useState, useRef, useEffect } from 'react'

function Logo3DShowcase() {
  const containerRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Only enable mouse tilt on non-touch desktop screens and when reduced motion is not requested
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (window.innerWidth <= 768 || isTouchDevice || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      // Check if mouse is near the container
      if (
        e.clientX < rect.left - 40 ||
        e.clientX > rect.right + 40 ||
        e.clientY < rect.top - 40 ||
        e.clientY > rect.bottom + 40
      ) {
        setTilt({ x: 0, y: 0, scale: 1 })
        setIsHovered(false)
        return
      }

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) / (rect.width / 2)
      const deltaY = (e.clientY - centerY) / (rect.height / 2)

      // Subtle, controlled tilt angles (+/- 8 degrees max)
      const rotY = Math.max(-8, Math.min(8, deltaX * 8))
      const rotX = Math.max(-8, Math.min(8, -deltaY * 8))

      setTilt({ x: rotX, y: rotY, scale: 1.02 })
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0, scale: 1 })
      setIsHovered(false)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="logo-3d-scene-container"
      aria-label="Palani Broilers 3D Animated Logo"
    >
      {/* Background Luminous Light Rings - Strictly Bounded */}
      <div className="logo-light-ring ring-outer" aria-hidden="true" />
      <div className="logo-light-ring ring-inner" aria-hidden="true" />

      {/* Floating Botanical Leaves & Ambient Sparks - Strictly Contained */}
      <div className="floating-botanicals" aria-hidden="true">
        <span className="botanical-leaf leaf-1">🌿</span>
        <span className="botanical-leaf leaf-2">🍃</span>
        <span className="botanical-leaf leaf-3">🌱</span>
        <span className="botanical-leaf leaf-4">🍃</span>
        <span className="spark-particle spark-1" />
        <span className="spark-particle spark-2" />
        <span className="spark-particle spark-3" />
      </div>

      {/* Organic Moss Pedestal Platform */}
      <div className="organic-ground-platform" aria-hidden="true">
        <div className="platform-pedestal">
          <div className="pedestal-moss-surface" />
          <div className="pedestal-rim" />
        </div>
        <div className="platform-shadow" />
      </div>

      {/* 3D Physical Logo Badge */}
      <div
        className={`logo-3d-wrapper ${!isHovered ? 'is-auto-floating' : ''}`}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(${tilt.scale}, ${tilt.scale}, ${tilt.scale})`,
          transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        {/* Shadow cast on the platform */}
        <div className="badge-drop-shadow" aria-hidden="true" />

        {/* 3D Physical Badge Layers */}
        <div className="badge-physical-disc">
          <div className="badge-extrusion-layer layer-back" />
          <div className="badge-extrusion-layer layer-mid" />
          <div className="badge-extrusion-layer layer-front" />

          {/* Specular Rim */}
          <div className="badge-specular-ring" />

          {/* Front Face with actual Palani Broilers Logo */}
          <div className="badge-face">
            <img
              src="/logo.png"
              alt="Palani Broilers Logo"
              className="badge-logo-img"
              loading="eager"
            />
            <div className="badge-gloss-overlay" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Logo3DShowcase
