import { useState, useEffect, useMemo } from 'react'
import { MessageSquare, Star, Send, Sparkles, CheckCircle2, AlertCircle, User, ChevronDown } from 'lucide-react'
import axios from 'axios'

const API_URL = 'https://palani-broilers-api.vercel.app'

function CustomerComments() {
  const [comments, setComments] = useState([])
  const [totalComments, setTotalComments] = useState(0)
  const [visibleCount, setVisibleCount] = useState(6)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  // Form states
  const [customerName, setCustomerName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [submitError, setSubmitError] = useState('')

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

  const displayedComments = useMemo(() => {
    return comments.slice(0, visibleCount)
  }, [comments, visibleCount])

  const hasMore = comments.length > visibleCount

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 6)
  }

  return (
    <section id="comments" className="comments-section" aria-labelledby="comments-heading">
      <div className="comments-header-group">
        <div className="comments-tag">
          <Sparkles size={13} className="text-coral" />
          <span>வாடிக்கையாளர் மதிப்பீடு · CUSTOMER FEEDBACK</span>
        </div>
        <h2 id="comments-heading" className="comments-title-tamil">
          வாடிக்கையாளர்களின் கருத்துகள்
        </h2>
        <p className="comments-subtitle-en">
          Share your experience with Palani Broilers
        </p>
      </div>

      <div className="comments-layout-grid">
        {/* Left Column: Comment Submission Form */}
        <div className="comment-form-card">
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

        {/* Right Column: Display Approved Comments */}
        <div className="comments-display-col">
          <div className="comments-display-header">
            <h3 className="comments-list-title font-tamil">
              வாடிக்கையாளர் பதிவுகள்
            </h3>
            <span className="comments-count-badge">
              {totalComments} {totalComments === 1 ? 'கருத்து' : 'கருத்துகள்'}
            </span>
          </div>

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
            <div className="comments-cards-list">
              {displayedComments.map((item, index) => {
                const dateString = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString('ta-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  : ''

                return (
                  <article key={item._id || index} className="comment-card">
                    <div className="comment-card-top">
                      <div className="comment-author-info">
                        <div className="comment-avatar">
                          {item.customerName?.charAt(0).toUpperCase() || 'P'}
                        </div>
                        <div>
                          <h4 className="comment-author-name">{item.customerName}</h4>
                          {dateString && (
                            <span className="comment-date">{dateString}</span>
                          )}
                        </div>
                      </div>

                      {item.rating && (
                        <div className="comment-stars" aria-label={`Rating: ${item.rating} of 5 stars`}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < item.rating ? '#EE532F' : 'none'}
                              stroke={i < item.rating ? '#EE532F' : '#c8b8ab'}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <p className="comment-card-body">{item.comment}</p>
                  </article>
                )
              })}

              {hasMore && (
                <div className="comments-view-more-wrap">
                  <button
                    type="button"
                    className="comments-view-more-btn"
                    onClick={handleViewMore}
                  >
                    <span>மேலும் கருத்துகளைப் பார்க்க ({comments.length - visibleCount} மீதம்)</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CustomerComments
