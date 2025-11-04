import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

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
      <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
        <div className="following-header">
          <h1>👥 Following Feed</h1>
          <button onClick={() => navigate('/explore')} style={{padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>
            👤 Discover More People
          </button>
        </div>

        <div style={{background: '#f0f8ff', padding: '16px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #007bff'}}>
          <p style={{margin: 0, color: '#0056b3'}}>
            <strong>💡 Tip:</strong> See only the ideas from people you follow. Follow more people to see more ideas!
          </p>
        </div>

        {loading ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>Loading following feed...</div>
        ) : posts.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px', border: '1px solid #ddd'}}>
            <p style={{fontSize: '40px', marginBottom: '10px'}}>👤</p>
            <p style={{color: '#999', marginBottom: '20px'}}>You're not following anyone yet!</p>
            <button onClick={() => navigate('/explore')} style={{padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>
              🔍 Explore & Find People to Follow
            </button>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map(post => (
              <article key={post._id} className="post-card">
                <div className="post-header">
                  <div style={{cursor: 'pointer'}} onClick={() => navigate(`/profile/${post.author?._id}`)}>
                    <h3>{post.title}</h3>
                    <small style={{color: '#666'}}>
                      {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <span className="category-badge">{post.category}</span>
                </div>

                <p className="post-description">{post.description.substring(0, 150)}...</p>

                <div className="post-tags">
                  {post.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>

                <div className="post-actions">
                  <button onClick={() => vote(post._id, 'up')} className="vote-btn">
                    👍 {post.upvotes?.length || 0}
                  </button>
                  <button onClick={() => vote(post._id, 'down')} className="vote-btn">
                    👎 {post.downvotes?.length || 0}
                  </button>
                  <button onClick={() => navigate(`/idea/${post._id}`)} className="view-btn">
                    💬 {post.comments?.length || 0} Comments
                  </button>
                  <button onClick={() => navigate(`/idea/${post._id}`)} className="view-btn">
                    Read More →
                  </button>
                </div>

                <div className="post-stats">
                  <span>👁️ {post.views} views</span>
                  <span>⭐ Ranking: {Math.round(post.ranking * 10) / 10}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .following-feed-page {
          padding: 20px 0;
          background: #f8f9fa;
          minHeight: 100vh;
        }

        .following-header {
          display: flex;
          justifyContent: space-between;
          alignItems: center;
          marginBottom: 30px;
          paddingBottom: 20px;
          borderBottom: 2px solid #e0e0e0;
        }

        .posts-list {
          display: flex;
          flexDirection: column;
          gap: 16px;
        }

        .post-card {
          background: white;
          padding: 20px;
          borderRadius: 8px;
          border: 1px solid #e0e0e0;
          transition: all 0.3s ease;
        }

        .post-card:hover {
          boxShadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .post-header {
          display: flex;
          justifyContent: space-between;
          alignItems: flex-start;
          marginBottom: 12px;
        }

        .post-header h3 {
          margin: 0 0 6px 0;
          color: #333;
        }

        .category-badge {
          background: #f0f0f0;
          padding: 6px 12px;
          borderRadius: 20px;
          fontSize: 12px;
          fontWeight: bold;
          color: #666;
          whiteSpace: nowrap;
        }

        .post-description {
          color: #555;
          lineHeight: 1.5;
          marginBottom: 12px;
        }

        .post-tags {
          display: flex;
          gap: 8px;
          flexWrap: wrap;
          marginBottom: 12px;
        }

        .tag {
          background: #e8f4f8;
          color: #0066cc;
          padding: 4px 10px;
          borderRadius: 12px;
          fontSize: 12px;
        }

        .post-actions {
          display: flex;
          gap: 10px;
          flexWrap: wrap;
          marginTop: 15px;
        }

        .vote-btn, .view-btn {
          padding: 8px 12px;
          border: 1px solid #ddd;
          borderRadius: 6px;
          background: white;
          cursor: pointer;
          fontSize: 13px;
          fontWeight: bold;
          transition: all 0.3s ease;
        }

        .vote-btn:hover {
          background: #f0f0f0;
        }

        .view-btn {
          background: #007bff;
          color: white;
          border: none;
        }

        .view-btn:hover {
          background: #0056b3;
        }

        .post-stats {
          display: flex;
          gap: 15px;
          fontSize: 13px;
          color: #999;
          marginTop: 12px;
          paddingTop: 12px;
          borderTop: 1px solid #f0f0f0;
        }

        @media (maxWidth: 600px) {
          .following-header {
            flexDirection: column;
            gap: 12px;
            alignItems: flex-start;
          }

          .post-actions {
            flexDirection: column;
          }

          .vote-btn, .view-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
