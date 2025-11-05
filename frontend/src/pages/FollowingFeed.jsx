import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  FiInfo,
  FiUser,
  FiChevronUp,
  FiChevronDown,
  FiMessageSquare,
  FiArrowRight
} from 'react-icons/fi'

const API = import.meta.env.VITE_API || 'http://localhost:5000/api'

export default function FollowingFeed(){
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if(!stored) return navigate('/login')
    setUser(JSON.parse(stored))
    fetchFollowingFeed()
  }, [])

  async function fetchFollowingFeed(){
    setLoading(true)
    try{
      const token = localStorage.getItem('token')
      const res = await axios.get(API + '/posts/feed/following', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPosts(res.data)
    }catch(e){
      console.error('Failed to fetch following feed')
    }finally{
      setLoading(false)
    }
  }

  async function vote(postId, type){
    if(!user) return alert('Please log in')
    try{
      const token = localStorage.getItem('token')
      const res = await axios.post(API + '/posts/' + postId + '/vote', { type }, { headers: { Authorization: `Bearer ${token}` } })
      setPosts(posts.map(p => p._id === postId ? res.data : p))
    }catch(e){
      alert('Vote failed')
    }
  }

  return (
    <div className="following-feed-page">
      <div className="page-shell following-shell">
        <header className="page-header">
          <div>
            <h1>Your following feed</h1>
            <p className="page-subtitle">Ideas from the people and teams you trust most.</p>
          </div>
          <button onClick={() => navigate('/explore')} className="btn-primary">
            Discover more creators
          </button>
        </header>

        <div className="info-banner">
          <strong>
            <FiInfo aria-hidden="true" />
            <span>Tip:</span>
          </strong>
          Follow more people to keep this feed lively. Explore curated recommendations anytime.
        </div>

        {loading ? (
          <div className="loading-state">Loading following feed...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">
              <FiUser size={44} />
            </div>
            <h3>Nothing here yet</h3>
            <p>Start following makers to see their ideas appear here.</p>
            <button onClick={() => navigate('/explore')} className="btn-primary">Explore creators</button>
          </div>
        ) : (
          <div className="posts-container">
            {posts.map(post => {
              const score = (post.upvotes?.length || 0) - (post.downvotes?.length || 0)
              const userVote = post.upvotes?.some(v => v._id === user?._id) ? 'up' : post.downvotes?.some(v => v._id === user?._id) ? 'down' : null
              const formatDate = (value) => {
                try {
                  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value))
                } catch {
                  return ''
                }
              }
              return (
                <article key={post._id} className="post-card-pro">
                  <div className="vote-stack">
                    <button
                      className={`vote-button up ${userVote === 'up' ? 'active' : ''}`}
                      onClick={() => vote(post._id, 'up')}
                      aria-label="Upvote idea"
                    >
                      <FiChevronUp aria-hidden="true" />
                    </button>
                    <span className="vote-score">{score}</span>
                    <button
                      className={`vote-button down ${userVote === 'down' ? 'active' : ''}`}
                      onClick={() => vote(post._id, 'down')}
                      aria-label="Downvote idea"
                    >
                      <FiChevronDown aria-hidden="true" />
                    </button>
                  </div>
                  <div
                    className="post-content"
                    onClick={() => navigate(`/idea/${post._id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if(event.key === 'Enter' || event.key === ' '){
                        event.preventDefault()
                        navigate(`/idea/${post._id}`)
                      }
                    }}
                  >
                    <div className="post-header">
                      <h3>{post.title}</h3>
                      <span className="category-badge">{post.category || 'General'}</span>
                    </div>
                    <div className="post-metadata">
                      <span
                        className="post-author"
                        onClick={(event) => {
                          event.stopPropagation()
                          if(post.author?._id){
                            navigate(`/profile/${post.author._id}`)
                          }
                        }}
                      >
                        {post.author?.name || post.author?.username || 'Creator'}
                      </span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span>{post.views ? `${post.views} views` : 'Just posted'}</span>
                    </div>
                    <p className="post-description">{post.description.substring(0, 180)}...</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="post-tags" onClick={(event) => event.stopPropagation()}>
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="post-footer" onClick={(event) => event.stopPropagation()}>
                      <button className="action-btn ghost" onClick={() => navigate(`/idea/${post._id}`)}>
                        <FiMessageSquare aria-hidden="true" />
                        <span>{post.comments?.length || 0} comments</span>
                      </button>
                      <button className="action-btn outline" onClick={() => navigate(`/idea/${post._id}`)}>
                        <span>Open idea</span>
                        <FiArrowRight aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
