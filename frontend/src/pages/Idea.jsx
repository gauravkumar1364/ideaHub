import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { API } from '../utils/api'
import {
  FiArrowLeft,
  FiCopy,
  FiBookmark,
  FiCompass,
  FiTarget,
  FiZap,
  FiTag,
  FiThumbsUp,
  FiThumbsDown,
  FiMessageSquare
} from 'react-icons/fi'

export default function IdeaPage(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [newComment, setNewComment] = useState('')

  useEffect(()=>{
    const stored = localStorage.getItem('user')
    if(stored) setUser(JSON.parse(stored))
    fetchIdea()
  }, [id])

  async function fetchIdea(){
    try{
      const res = await axios.get(API + '/posts/' + id)
      setIdea(res.data)
    }catch(e){
      console.error('Failed to load idea')
    }finally{
      setLoading(false)
    }
  }

  async function vote(type){
    if(!user) return alert('Please log in')
    try{
      const token = localStorage.getItem('token')
      const res = await axios.post(API + '/posts/' + id + '/vote', { type }, { headers: { Authorization: `Bearer ${token}` } })
      setIdea(res.data)
    }catch(e){
      alert('Vote failed')
    }
  }

  async function submitComment(){
    if(!user) return alert('Please log in')
    if(!newComment.trim()) return
    try{
      const token = localStorage.getItem('token')
      const res = await axios.post(
        API + '/posts/' + id + '/comment',
        { text: newComment.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setIdea(res.data)
      setNewComment('')
    }catch(e){
      alert('Comment failed')
    }
  }

  if(loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading idea...</div>
  if(!idea) return <div style={{padding: '40px', textAlign: 'center'}}>Idea not found</div>

  const userVoted = idea.upvotes?.some(u => u._id === user?._id) ? 'up' : idea.downvotes?.some(u => u._id === user?._id) ? 'down' : null
  const authorName = idea.author?.name || idea.author?.username || 'Anonymous'
  const formatDateTime = (value) => {
    try{
      return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(value))
    }catch{
      return ''
    }
  }

  return (
    <div className="idea-page">
      <div className="page-shell idea-shell">
        <button onClick={() => navigate(-1)} className="back-button">
          <FiArrowLeft aria-hidden="true" />
          <span>Back</span>
        </button>

        <article className="idea-detail card">
          <header className="idea-header">
            <div>
              <h1>{idea.title}</h1>
              <div className="idea-meta">
                <span className="category-badge">{idea.category}</span>
                <span>{formatDateTime(idea.createdAt)}</span>
                {idea.views !== undefined && <span>{idea.views} views</span>}
              </div>
            </div>
            <div className="idea-share">
              <button
                className="action-btn outline"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied!')
                }}
              >
                <FiCopy aria-hidden="true" />
                <span>Copy Link</span>
              </button>
            </div>
          </header>

          <div className="idea-author-card">
            <div className="author-avatar">{authorName?.[0]?.toUpperCase() || 'U'}</div>
            <div className="author-details">
              <p className="author-name">{authorName}</p>
              <p className="author-meta">
                {[idea.author?.department, idea.author?.batch ? `Class of ${idea.author.batch}` : null].filter(Boolean).join(' • ') || 'Community member'}
              </p>
            </div>
            <button className="btn-secondary">Follow</button>
          </div>

          <div className="idea-content">
            <section>
              <h3>
                <FiBookmark aria-hidden="true" />
                <span>Problem Statement</span>
              </h3>
              <p>{idea.problemStatement || idea.description}</p>
            </section>

            <section>
              <h3>
                <FiCompass aria-hidden="true" />
                <span>Solution Overview</span>
              </h3>
              <p>{idea.solutionOverview || 'No details provided yet.'}</p>
            </section>

            <section>
              <h3>
                <FiTarget aria-hidden="true" />
                <span>Target Audience</span>
              </h3>
              <p>{idea.targetAudience || 'Not specified'}</p>
            </section>

            {idea.impact && (
              <section>
                <h3>
                  <FiZap aria-hidden="true" />
                  <span>Impact & USP</span>
                </h3>
                <p>{idea.impact}</p>
              </section>
            )}

            {idea.tags && idea.tags.length > 0 && (
              <section>
                <h3>
                  <FiTag aria-hidden="true" />
                  <span>Tags</span>
                </h3>
                <div className="tag-list">
                  {idea.tags.map(tag => (
                    <span key={tag} className="tag-chip">#{tag}</span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="idea-stats">
            <div>
              <span className="stat-label">Upvotes</span>
              <span className="stat-value">{idea.upvotes?.length || 0}</span>
            </div>
            <div>
              <span className="stat-label">Downvotes</span>
              <span className="stat-value">{idea.downvotes?.length || 0}</span>
            </div>
            <div>
              <span className="stat-label">Comments</span>
              <span className="stat-value">{idea.comments?.length || 0}</span>
            </div>
            <div>
              <span className="stat-label">Ranking</span>
              <span className="stat-value">{Math.round((idea.ranking || 0) * 10) / 10}</span>
            </div>
          </div>

          <div className="idea-actions">
            <button onClick={() => vote('up')} className={userVoted === 'up' ? 'active' : ''}>
              <FiThumbsUp aria-hidden="true" />
              <span>Upvote</span>
            </button>
            <button onClick={() => vote('down')} className={userVoted === 'down' ? 'active' : ''}>
              <FiThumbsDown aria-hidden="true" />
              <span>Downvote</span>
            </button>
          </div>

          <section className="comments-section">
            <header>
              <h3>
                <FiMessageSquare aria-hidden="true" />
                <span>Comments ({idea.comments?.length || 0})</span>
              </h3>
            </header>

            {user && (
              <div className="comment-form">
                <textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
                ></textarea>
                <div className="comment-actions">
                  <button
                    className="btn-primary"
                    onClick={submitComment}
                    disabled={!newComment.trim()}
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            )}

            <div className="comments-list">
              {idea.comments?.map((c, i) => (
                <div key={i} className="comment-item">
                  <div className="comment-header">
                    <div className="comment-avatar">{(c.author?.name || c.author?.username || 'U')?.[0]?.toUpperCase()}</div>
                    <div>
                      <p className="comment-author">{c.author?.name || c.author?.username || 'User'}</p>
                      <span className="comment-time">{formatDateTime(c.createdAt)}</span>
                    </div>
                  </div>
                  <p className="comment-text">{c.text}</p>
                  {c.replies?.length > 0 && (
                    <div className="comment-replies">
                      {c.replies.map((r, j) => (
                        <div key={j} className="comment-reply">
                          <span className="reply-author">{r.author?.name || r.author?.username || 'User'}</span>
                          <span className="reply-text">{r.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}
