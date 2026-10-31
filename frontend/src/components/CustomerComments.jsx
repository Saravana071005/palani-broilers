import { useState, useEffect, useMemo, useRef } from 'react'
import { MessageSquare, Star, Send, Sparkles, CheckCircle2, AlertCircle, User, ChevronDown, Quote, Heart } from 'lucide-react'
import axios from 'axios'

const API_URL = 'https://palani-broilers-api.vercel.app'

// Curated brand avatar palettes (Forest, Coral, Sage, Ochre, Terracotta, Pine)
const AVATAR_PALETTES = [
  { bg: '#1A371C', text: '#FAF7F2' },
  { bg: '#EE532F', text: '#FFFFFF' },
  { bg: '#2D5A38', text: '#FAF7F2' },
  { bg: '#C28B38', text: '#FFFFFF' },
  { bg: '#9E3F2E', text: '#FAF7F2' },
  { bg: '#163E32', text: '#FAF7F2' },
]

function getAvatarStyle(name = '') {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length
  return AVATAR_PALETTES[index]
}

function getInitials(name = '') {
  const trimmed = name.trim()
  if (!trimmed) return 'P'
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// Single Testimonial Card Component
function TestimonialCard({ item }) {
  const avatarStyle = useMemo(() => getAvatarStyle(item.customerName || ''), [item.customerName])
  const initials = useMemo(() => getInitials(item.customerName || ''), [item.customerName])

  const dateString = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('ta-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : ''

  return (
    <article className="testimonial-card" title={item.comment}>
      {/* Decorative Quotation Mark in top-right */}
      <div className="testimonial-card-quote-watermark" aria-hidden="true">
        <Quote size={28} />
      </div>

      {/* Customer Avatar */}
      <div
        className="testimonial-avatar"
        style={{
          backgroundColor: avatarStyle.bg,
          color: avatarStyle.text,
        }}
        aria-hidden="true"
      >
        {initials}
      </div>

      {/* Customer Name */}
      <h3 className="testimonial-customer-name font-tamil">
        {item.customerName}
      </h3>

      {/* Star Rating (only if submitted) */}
      {item.rating ? (
        <div className="testimonial-stars" aria-label={`Rating: ${item.rating} of 5 stars`}>
          {[1, 2, 3, 4, 5].map((starValue) => {
            const isFilled = starValue <= item.rating
            return (
              <Star
                key={starValue}
                size={14}
                fill={isFilled ? '#EE532F' : 'none'}
                stroke={isFilled ? '#EE532F' : '#D0C4B8'}
              />
            )
          })}
        </div>
      ) : null}

      {/* Comment Body */}
      <div className="testimonial-comment-wrap">
        <p className="testimonial-comment-text">
          &ldquo;{item.comment}&rdquo;
        </p>
      </div>

      {/* Card Footer with formatted date */}
      <div className="testimonial-card-footer">
        {dateString ? (
          <span className="testimonial-date">{dateString}</span>
        ) : (
          <span className="testimonial-date">வாடிக்கையாளர் மதிப்புரை</span>
        )}
        <Quote size={13} className="testimonial-footer-quote" aria-hidden="true" />
      </div>
    </article>
  )
}

function CustomerComments() {
  const [comments, setComments] = useState([])
  const [totalComments, setTotalComments] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  // Feedback form states
  const [showForm, setShowForm] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [submitError, setSubmitError] = useState('')

  // Marquee track & drag states
  const trackRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, startOffset: 0 })
  const activeOffsetRef = useRef(0)
  const resumeTimeoutRef = useRef(null)

  const fetchComments = async () => {
    setIsLoading(true)
    setLoadError(null)
    try {
      const response = await axios.get(`${API_URL}/api/comments?limit=50`)
      if (response.data && Array.isArray(response.data.comments)) {
        setComments(response.data.comments)
        setTotalComments(response.data.total || response.data.comments.length)
      } else if (Array.isArray(response.data)) {
        setComments(response.data)
        setTotalComments(response.data.length)
      }
    } catch (err) {
      console.error('Error fetching comments:', err)
      setLoadError('கருத்துகளை ஏற்றுவதில் சிக்கல் ஏற்பட்டது.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  // Infinite Marquee Items:
  // Build a base sequence with at least 8 cards so it spans any viewport width,
  // then duplicate once to achieve a seamless 50% translation loop without blank gaps.
  const marqueeItems = useMemo(() => {
    if (!comments || comments.length === 0) return []
    const minBaseCards = 8
    const repeatCount = Math.max(1, Math.ceil(minBaseCards / comments.length))
    let base = []
    for (let i = 0; i < repeatCount; i++) {
      base = base.concat(comments)
    }
    return [...base, ...base]
  }, [comments])

  // Animation cycle duration in seconds (slow, smooth, relaxing: 35s - 50s)
  const animationDuration = useMemo(() => {
    if (!comments || comments.length === 0) return 40
    const baseCount = marqueeItems.length / 2
    // Roughly 4.5 seconds per card, clamped between 35 and 50 seconds
    return Math.min(50, Math.max(35, Math.round(baseCount * 4.5)))
  }, [comments, marqueeItems])

  // Horizontal Pointer Drag / Mobile Swipe Handler
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    if (!trackRef.current) return

    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
      resumeTimeoutRef.current = null
    }

    const track = trackRef.current
    const computedStyle = window.getComputedStyle(track)
    const transform = computedStyle.transform || computedStyle.webkitTransform
    let currentX = 0

    if (transform && transform !== 'none') {
      try {
        const matrix = new DOMMatrixReadOnly(transform)
        currentX = matrix.m41
      } catch {
        const match = transform.match(/matrix(?:3d)?\((.+)\)/)
        if (match) {
          const values = match[1].split(', ')
          currentX = parseFloat(values[values.length === 6 ? 4 : 12]) || 0
        }
      }
    }

    // Freeze animation at current visual position
    track.style.animationPlayState = 'paused'
    track.style.transform = `translate3d(${currentX}px, 0, 0)`

    dragStartRef.current = {
      x: e.clientX,
      startOffset: currentX
    }
    activeOffsetRef.current = currentX
    setIsDragging(true)
  }

  const handlePointerMove = (e) => {
    if (!isDragging || !trackRef.current) return
    const track = trackRef.current
    const deltaX = e.clientX - dragStartRef.current.x
    let newX = dragStartRef.current.startOffset + deltaX

    // Wrap around seamlessly if user drags past loop boundary
    const halfWidth = track.scrollWidth / 2
    if (halfWidth > 0) {
      while (newX > 0) newX -= halfWidth
      while (newX < -halfWidth) newX += halfWidth
    }

    activeOffsetRef.current = newX
    track.style.transform = `translate3d(${newX}px, 0, 0)`
  }

  const handlePointerUp = () => {
    if (!isDragging || !trackRef.current) return
    setIsDragging(false)
    const track = trackRef.current

    const halfWidth = track.scrollWidth / 2
    if (halfWidth > 0) {
      let offset = activeOffsetRef.current
      while (offset > 0) offset -= halfWidth
      while (offset < -halfWidth) offset += halfWidth

      const progress = Math.abs(offset) / halfWidth
      const delay = -(progress * animationDuration)

      // Resume smooth marquee from exact current dragged position
      resumeTimeoutRef.current = setTimeout(() => {
        if (!trackRef.current) return
        track.style.transform = ''
        track.style.animationDelay = `${delay}s`
        track.style.animationPlayState = 'running'
      }, 50)
    } else {
      track.style.animationPlayState = 'running'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitSuccess('')
    setSubmitError('')

    const trimmedName = customerName.trim()
    const trimmedComment = commentText.trim()

    if (!trimmedName || trimmedName.length < 2) {
      setSubmitError('தயவுசெய்து உங்கள் பெயரை உள்ளிடவும் (குறைந்தது 2 எழுத்துகள்).')
      return
    }

    if (trimmedName.length > 60) {
      setSubmitError('பெயர் 60 எழுத்துகளுக்குள் இருக்க வேண்டும்.')
      return
    }

    if (!trimmedComment || trimmedComment.length < 3) {
      setSubmitError('தயவுசெய்து உங்கள் கருத்தை உள்ளிடவும் (குறைந்தது 3 எழுத்துகள்).')
      return
    }

    if (trimmedComment.length > 600) {
      setSubmitError('கருத்து 600 எழுத்துகளுக்குள் இருக்க வேண்டும்.')
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        customerName: trimmedName,
        comment: trimmedComment,
        rating: rating || null
      }

      const response = await axios.post(`${API_URL}/api/comments`, payload)

      setSubmitSuccess(
        response.data?.message ||
        'நன்றி! உங்கள் கருத்து வெற்றிகரமாக பெறப்பட்டது. நிர்வாகியின் சரிபார்ப்பிற்குப் பிறகு வெளியிடப்படும்.'
      )
      setCustomerName('')
      setCommentText('')
      setRating(5)
      setHoverRating(0)
    } catch (err) {
      console.error('Error submitting comment:', err)
      const msg = err.response?.data?.message || 'கருத்தை பதிவு செய்ய முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.'
      setSubmitError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="comments" className="comments-testimonial-section" aria-labelledby="comments-heading">
      {/* Decorative Large Quotation Mark Watermark */}
      <div className="comments-section-watermark" aria-hidden="true">
        &ldquo;
      </div>

      <div className="comments-container">
        {/* Section Heading Group */}
        <div className="comments-header-group">
          <div className="comments-tag">
            <Sparkles size={13} className="text-coral" />
            <span>வாடிக்கையாளர் மதிப்பீடு · TESTIMONIALS</span>
          </div>

          <h2 id="comments-heading" className="comments-title-tamil font-tamil">
            வாடிக்கையாளர்களின் கருத்துகள்
          </h2>

          <p className="comments-subtitle-en">
            What our customers say!
          </p>

          {/* Subtle Coral Decorative Underline */}
          <div className="comments-coral-underline" aria-hidden="true" />
        </div>

        {/* Testimonials Carousel or Loading / Empty State */}
        {isLoading ? (
          <div className="comments-loading-state" role="status">
            <div className="product-loading-spinner" />
            <p className="loading-title">கருத்துகள் ஏற்றப்படுகின்றன...</p>
          </div>
        ) : loadError ? (
          <div className="comments-empty-state">
            <p className="text-sm text-coral">{loadError}</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="comments-empty-state">
            <div className="empty-chat-icon">💬</div>
            <p className="empty-title font-tamil">இன்னும் கருத்துகள் பதிவாகவில்லை</p>
            <p className="empty-desc">
              Palani Broilers-ல் உங்கள் அனுபவத்தை முதலில் பகிரும் வாடிக்கையாளராக இருங்கள்!
            </p>
          </div>
        ) : (
          <div
            className="testimonial-marquee-wrapper"
            role="region"
            aria-label="Customer testimonials continuous auto-scrolling carousel"
          >
            <div
              ref={trackRef}
              className={`testimonial-marquee-track ${isDragging ? 'is-dragging' : ''}`}
              style={{
                '--marquee-duration': `${animationDuration}s`,
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {marqueeItems.map((item, index) => (
                <TestimonialCard
                  key={`${item._id || 'comment'}-${index}`}
                  item={item}
                />
              ))}
            </div>
          </div>
        )}

        {/* Toggle Form / Feedback Action Bar */}
        <div className="comments-action-bar">
          <button
            type="button"
            className="comments-open-form-btn"
            onClick={() => setShowForm(!showForm)}
            aria-expanded={showForm}
            aria-controls="comment-submission-panel"
          >
            <span className="comments-btn-icon" aria-hidden="true">✍️</span>
            <span className="font-tamil">கருத்தைப் பகிரவும் (Share Your Feedback)</span>
            <span className={`comments-btn-chevron ${showForm ? 'is-open' : ''}`} aria-hidden="true">
              <ChevronDown size={18} />
            </span>
          </button>

          <span className="comments-total-counter">
            <Heart size={14} className="text-coral inline mr-1" />
            <span>மொத்தம் {totalComments} {totalComments === 1 ? 'வாடிக்கையாளர் கருத்து' : 'வாடிக்கையாளர் கருத்துகள்'}</span>
          </span>
        </div>

        {/* Customer Comment Submission Form (Toggleable or auto-open when empty) */}
        {(showForm || comments.length === 0) && (
          <div id="comment-submission-panel" className="comment-form-panel">
            <div className="comment-form-card centered-card">
              <div className="comment-form-header">
                <div className="comment-form-icon-wrap">
                  <MessageSquare size={20} className="text-coral" />
                </div>
                <div>
                  <h3 className="comment-form-title font-tamil">உங்கள் கருத்தைப் பகிருங்கள்</h3>
                  <p className="comment-form-desc">
                    எங்களின் தரம் மற்றும் சேவை குறித்த உங்கள் மேலான எண்ணங்களை தெரிவிக்கவும்.
                  </p>
                </div>
              </div>

              {submitSuccess && (
                <div className="comment-alert comment-alert-success" role="status">
                  <CheckCircle2 size={18} className="flex-shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {submitError && (
                <div className="comment-alert comment-alert-error" role="alert">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="comment-form" noValidate>
                {/* Customer Name */}
                <div className="form-group">
                  <label htmlFor="customer-name" className="form-label font-tamil">
                    உங்கள் பெயர் (Your Name) <span className="text-coral">*</span>
                  </label>
                  <div className="form-input-wrap">
                    <User size={17} className="form-input-icon" />
                    <input
                      id="customer-name"
                      type="text"
                      className="form-input"
                      placeholder="உதாரணம்: கார்த்திக்"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      maxLength={60}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                {/* Star Rating Picker */}
                <div className="form-group">
                  <label className="form-label font-tamil">
                    மதிப்பீடு (Rating - Optional)
                  </label>
                  <div className="star-picker-row" role="radiogroup" aria-label="Rating from 1 to 5 stars">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isFilled = (hoverRating || rating) >= starValue
                      return (
                        <button
                          key={starValue}
                          type="button"
                          className="star-picker-btn"
                          onClick={() => setRating(rating === starValue ? 0 : starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
                          aria-checked={rating === starValue}
                          role="radio"
                        >
                          <Star
                            size={24}
                            fill={isFilled ? '#EE532F' : 'none'}
                            stroke={isFilled ? '#EE532F' : '#c8b8ab'}
                          />
                        </button>
                      )
                    })}
                    <span className="star-rating-label">
                      {rating ? `${rating} / 5 நட்சத்திரங்கள்` : 'மதிப்பீடு தேர்வு செய்யவில்லை'}
                    </span>
                  </div>
                </div>

                {/* Comment Body */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label htmlFor="comment-text" className="form-label font-tamil">
                      உங்கள் கருத்து (Your Feedback) <span className="text-coral">*</span>
                    </label>
                    <span className="form-char-count">{commentText.length} / 600</span>
                  </div>
                  <textarea
                    id="comment-text"
                    className="form-textarea"
                    rows={4}
                    placeholder="உங்கள் அனுபவத்தை எங்களுடன் பகிர்ந்து கொள்ளுங்கள்..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    maxLength={600}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="comment-submit-btn"
                  disabled={isSubmitting || !customerName.trim() || !commentText.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="submit-spinner" />
                      <span>அனுப்பப்படுகிறது...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>கருத்து சமர்ப்பிக்க (Submit Feedback)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default CustomerComments
