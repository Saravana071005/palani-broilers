import { useEffect, useState } from 'react'
import { Check, Eye, EyeOff, MessageSquare, Search, Star, Trash2, Clock, CheckCircle2 } from 'lucide-react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''
const errorMessage = (error, fallback) => error.response?.data?.message || fallback

function CommentManagement() {
  const [comments, setComments] = useState([])
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, hidden: 0 })
  const [activeFilter, setActiveFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchComments = async (filter = activeFilter) => {
    setLoading(true)
    try {
      const params = filter === 'all' ? {} : { status: filter }
      const { data } = await axios.get(`${API_URL}/api/admin/comments`, { params })
      setComments(data.comments || [])
      if (data.stats) {
        setStats(data.stats)
      }
    } catch (error) {
      setMessage(errorMessage(error, 'Unable to load comments.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments(activeFilter)
  }, [activeFilter])

  const updateStatus = async (id, status) => {
    setActionLoading(id)
    setMessage('')
    try {
      await axios.patch(`${API_URL}/api/admin/comments/${id}/status`, { status })
      await fetchComments(activeFilter)
      setMessage(
        status === 'approved'
          ? 'Comment approved and published to website.'
          : status === 'hidden'
          ? 'Comment hidden from public website.'
          : 'Comment marked as pending.'
      )
    } catch (error) {
      setMessage(errorMessage(error, 'Failed to update comment status.'))
    } finally {
      setActionLoading(null)
    }
  }

  const removeComment = async (comment) => {
    if (!window.confirm(`Are you sure you want to permanently delete the comment by "${comment.customerName}"?`)) {
      return
    }
    setActionLoading(comment._id)
    setMessage('')
    try {
      await axios.delete(`${API_URL}/api/admin/comments/${comment._id}`)
      await fetchComments(activeFilter)
      setMessage('Comment deleted successfully.')
    } catch (error) {
      setMessage(errorMessage(error, 'Failed to delete comment.'))
    } finally {
      setActionLoading(null)
    }
  }

  const visibleComments = comments.filter((c) => {
    const q = query.toLowerCase()
    return (
      c.customerName?.toLowerCase().includes(q) ||
      c.comment?.toLowerCase().includes(q)
    )
  })

  return (
    <section className="admin-page">
      <div className="page-title">
        <span>Moderation</span>
        <h2>Customer Comments</h2>
        <p>Review, approve, hide or remove customer feedback submitted on the website.</p>
      </div>

      {message && <div className="admin-alert">{message}</div>}

      {/* Stats Cards */}
      <div className="admin-stats">
        <article className="stat-card">
          <div>
            <p>Total Feedback</p>
            <strong>{stats.total}</strong>
          </div>
          <MessageSquare size={22} />
        </article>
        <article className="stat-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div>
            <p>Pending Approval</p>
            <strong style={{ color: '#b45309' }}>{stats.pending}</strong>
          </div>
          <Clock size={22} color="#b45309" />
        </article>
        <article className="stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div>
            <p>Approved & Live</p>
            <strong style={{ color: '#047857' }}>{stats.approved}</strong>
          </div>
          <CheckCircle2 size={22} color="#047857" />
        </article>
        <article className="stat-card" style={{ borderLeft: '4px solid #9ca3af' }}>
          <div>
            <p>Hidden</p>
            <strong>{stats.hidden}</strong>
          </div>
          <EyeOff size={22} color="#6b7280" />
        </article>
      </div>

      {/* Main Moderation Panel */}
      <section className="admin-panel">
        <div className="panel-heading" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['all', 'pending', 'approved', 'hidden'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setActiveFilter(status)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb',
                  background: activeFilter === status ? '#991b1b' : '#ffffff',
                  color: activeFilter === status ? '#ffffff' : '#374151',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {status} ({status === 'all' ? stats.total : stats[status] || 0})
              </button>
            ))}
          </div>

          <label className="search-field" style={{ minWidth: '240px' }}>
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or content..."
            />
          </label>
        </div>

        {loading ? (
          <p className="empty-copy">Loading comments…</p>
        ) : visibleComments.length ? (
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {visibleComments.map((c) => {
              const isActionRunning = actionLoading === c._id
              return (
                <article
                  key={c._id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #f3d4dc',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <strong style={{ fontSize: '1.05rem', color: '#65283d' }}>{c.customerName}</strong>
                      {c.rating && (
                        <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }} aria-label={`${c.rating} out of 5 stars`}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={15}
                              fill={i < c.rating ? '#f59e0b' : 'none'}
                              stroke="#f59e0b"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        style={{
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background:
                            c.status === 'approved'
                              ? '#d1fae5'
                              : c.status === 'hidden'
                              ? '#f3f4f6'
                              : '#fef3c7',
                          color:
                            c.status === 'approved'
                              ? '#065f46'
                              : c.status === 'hidden'
                              ? '#374151'
                              : '#92400e'
                        }}
                      >
                        {c.status}
                      </span>
                      <small style={{ color: '#8d6572' }}>
                        {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'Date unavailable'}
                      </small>
                    </div>
                  </div>

                  <p style={{ margin: 0, color: '#374151', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {c.comment}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f9fafb' }}>
                    {c.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => updateStatus(c._id, 'approved')}
                        disabled={isActionRunning}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '0.5rem',
                          background: '#047857',
                          color: '#ffffff',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          border: 0,
                          cursor: 'pointer'
                        }}
                      >
                        <Check size={15} />
                        Approve & Publish
                      </button>
                    )}

                    {c.status !== 'hidden' && (
                      <button
                        type="button"
                        onClick={() => updateStatus(c._id, 'hidden')}
                        disabled={isActionRunning}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '0.5rem',
                          background: '#4b5563',
                          color: '#ffffff',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          border: 0,
                          cursor: 'pointer'
                        }}
                      >
                        <EyeOff size={15} />
                        Hide
                      </button>
                    )}

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => removeComment(c)}
                      disabled={isActionRunning}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.8rem'
                      }}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No comments found</h3>
            <p>
              {activeFilter === 'pending'
                ? 'No comments waiting for review.'
                : 'No comments matching the selected filter.'}
            </p>
          </div>
        )}
      </section>
    </section>
  )
}

export default CommentManagement
