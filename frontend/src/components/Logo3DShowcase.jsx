import { useState, useRef, useEffect } from 'react'

function Logo3DShowcase() {
  const containerRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Only enable mouse tilt on desktop screens and when reduced motion is NOT requested
      if (window.innerWidth <= 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      // If mouse is somewhat near the showcase
      const padding = 100
      if (
        e.clientX < rect.left - padding ||
        e.clientX > rect.right + padding ||
        e.clientY < rect.top - padding ||
        e.clientY > rect.bottom + padding
      ) {
        setTilt({ x: 0, y: 0, scale: 1 })
        setIsHovered(false)
        return
      }

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) / (rect.width / 2)
      const deltaY = (e.clientY - centerY) / (rect.height / 2)

      // Clamp max tilt angles to +/- 12 degrees
      const rotY = Math.max(-12, Math.min(12, deltaX * 12))
      const rotX = Math.max(-12, Math.min(12, -deltaY * 12))

      setTilt({ x: rotX, y: rotY, scale: 1.04 })
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0, scale: 1 })
      setIsHovered(false)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    const node = containerRef.current
    if (node) {
      node.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (node) {
        node.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="logo-3d-scene"
      aria-label="Palani Broilers 3D Animated Logo"
    >
      {/* Background Luminous Light Rings */}
      <div className="logo-light-ring ring-outer" aria-hidden="true" />
      <div className="logo-light-ring ring-inner" aria-hidden="true" />

      {/* Floating Botanical Leaves */}
      <div className="floating-botanicals" aria-hidden="true">
        <span className="botanical-leaf leaf-1">🌿</span>
        <span className="botanical-leaf leaf-2">🍃</span>
        <span className="botanical-leaf leaf-3">🌱</span>
        <span className="botanical-leaf leaf-4">🍃</span>
        <span className="spark-particle spark-1" />
        <span className="spark-particle spark-2" />
        <span className="spark-particle spark-3" />
      </div>

      {/* Organic Moss / Botanical Ground Pedestal */}
      <div className="organic-ground-platform" aria-hidden="true">
        <div className="platform-pedestal">
          <div className="pedestal-moss-surface" />
          <div className="pedestal-rim" />
        </div>
        <div className="platform-shadow" />
      </div>

      {/* 3D Floating Physical Logo Badge */}
      <div
        className={`logo-3d-wrapper ${!isHovered ? 'is-auto-floating' : ''}`}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg) scale3d(${tilt.scale}, ${tilt.scale}, ${tilt.scale})`,
          transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        {/* Shadow cast by floating badge onto the platform */}
        <div className="badge-drop-shadow" aria-hidden="true" />

        {/* 3D Extruded Physical Badge Construction */}
        <div className="badge-physical-disc">
          {/* Depth Extrusion Layers */}
          <div className="badge-extrusion-layer layer-back" />
          <div className="badge-extrusion-layer layer-mid" />
          <div className="badge-extrusion-layer layer-front" />

          {/* Golden / Sage Specular Rim Ring */}
          <div className="badge-specular-ring" />

          {/* Actual Palani Broilers Logo Face */}
          <div className="badge-face">
            <img
              src="/logo.png"
              alt="Palani Broilers Logo"
              className="badge-logo-img"
              loading="eager"
            />
            {/* Shimmer / Gloss Highlight */}
            <div className="badge-gloss-overlay" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Logo3DShowcase
