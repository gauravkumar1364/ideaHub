import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API || 'http://localhost:5000/api'

export default function IdeaPage(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [idea, setIdea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState({})
  const [user, setUser] = useState(null)

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

  async function addComment(text){
    if(!user) return alert('Please log in')
    if(!text.trim()) return
    try{
      const token = localStorage.getItem('token')
      const res = await axios.post(API + '/posts/' + id + '/comment', { text }, { headers: { Authorization: `Bearer ${token}` } })
      setIdea(res.data)
    }catch(e){
      alert('Comment failed')
    }
  }

  if(loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading idea...</div>
  if(!idea) return <div style={{padding: '40px', textAlign: 'center'}}>Idea not found</div>

  const userVoted = idea.upvotes?.some(u => u._id === user?._id) ? 'up' : idea.downvotes?.some(u => u._id === user?._id) ? 'down' : null

  return (
    <div className="idea-page">
      <button onClick={() => navigate(-1)} style={{marginBottom: '20px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd'}}>← Back</button>
      
      <article className="idea-detail">
        <div className="idea-header">
          <h1>{idea.title}</h1>
          <div className="idea-meta">
            <span className="category-badge">{idea.category}</span>
            <span style={{color: '#999', fontSize: '14px'}}>{new Date(idea.createdAt).toLocaleDateString()}</span>
            <span style={{color: '#999', fontSize: '14px'}}>👁️ {idea.views} views</span>
          </div>
        </div>

        <div className="idea-author-card">
          <div>
            <strong>{idea.author?.name}</strong>
            {idea.author?.department && <p style={{color: '#666', fontSize: '13px'}}>{idea.author.department}</p>}
          </div>
          <button style={{padding: '6px 12px', borderRadius: '6px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer'}}>Follow</button>
        </div>

        <div className="idea-content">
          <section>
            <h3>📌 Problem Statement</h3>
            <p>{idea.problemStatement || idea.description}</p>
          </section>

          <section>
            <h3>🚀 Solution Overview</h3>
            <p>{idea.solutionOverview || 'No details provided'}</p>
          </section>

          <section>
            <h3>🎯 Target Audience</h3>
            <p>{idea.targetAudience || 'Not specified'}</p>
          </section>

          {idea.impact && (
            <section>
              <h3>💡 Impact & USP</h3>
              <p>{idea.impact}</p>
            </section>
          )}

          {idea.tags && idea.tags.length > 0 && (
            <section>
              <h3>🏷️ Tags</h3>
              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                {idea.tags.map(tag => (
                  <span key={tag} style={{background: '#f0f0f0', padding: '6px 12px', borderRadius: '20px', fontSize: '13px'}}>
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="idea-stats">
          <div>Upvotes: <strong>{idea.upvotes?.length || 0}</strong></div>
          <div>Downvotes: <strong>{idea.downvotes?.length || 0}</strong></div>
          <div>Comments: <strong>{idea.comments?.length || 0}</strong></div>
          <div>Ranking: <strong>{Math.round(idea.ranking * 10) / 10}</strong></div>
        </div>

        <div className="idea-actions">
          <button onClick={() => vote('up')} className={userVoted === 'up' ? 'active' : ''}>👍 Upvote</button>
          <button onClick={() => vote('down')} className={userVoted === 'down' ? 'active' : ''}>👎 Downvote</button>
          <button onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            alert('Link copied!')
          }}>🔗 Share</button>
        </div>

        <div className="comments-section">
          <h3>💬 Comments ({idea.comments?.length || 0})</h3>
          
          {user && (
            <div className="comment-form">
              <textarea placeholder="Add a comment..." id="new-comment" style={{width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', minHeight: '80px'}}></textarea>
              <button onClick={() => {
                const text = document.getElementById('new-comment').value
                addComment(text)
                document.getElementById('new-comment').value = ''
              }} style={{marginTop: '8px', padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>Post Comment</button>
            </div>
          )}

          <div className="comments-list" style={{marginTop: '20px'}}>
            {idea.comments?.map((c, i) => (
              <div key={i} style={{background: '#f9f9f9', padding: '12px', borderRadius: '6px', marginBottom: '12px'}}>
                <div style={{fontWeight: 'bold', marginBottom: '6px'}}>{c.author?.name || 'User'}</div>
                <p style={{color: '#333', marginBottom: '8px'}}>{c.text}</p>
                <small style={{color: '#999'}}>{new Date(c.createdAt).toLocaleDateString()}</small>
                
                {c.replies?.length > 0 && (
                  <div style={{marginTop: '12px', borderLeft: '2px solid #ddd', paddingLeft: '12px'}}>
                    {c.replies.map((r, j) => (
                      <div key={j} style={{marginBottom: '8px', fontSize: '13px'}}>
                        <strong>{r.author?.name}</strong>: {r.text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}
