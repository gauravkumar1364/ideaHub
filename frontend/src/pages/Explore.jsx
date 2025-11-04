import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API || 'http://localhost:5000/api'

export default function Explore(){
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [results, setResults] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('ideas')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if(stored) setUser(JSON.parse(stored))
  }, [])

  async function performSearch(){
    if(!search.trim()) return
    setLoading(true)
    try{
      if(tab === 'ideas'){
        const res = await axios.get(API + '/posts/search?q=' + encodeURIComponent(search))
        setResults(res.data)
      } else {
        const res = await axios.get(API + '/users/search?q=' + encodeURIComponent(search))
        setUsers(res.data)
      }
    }catch(e){
      console.error('Search failed')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="explore-page">
      <div style={{maxWidth: '1000px', margin: '0 auto', padding: '20px'}}>
        <h1>🔍 Explore Ideas & Users</h1>

        <div className="search-box">
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && performSearch()}
            placeholder="Search ideas, tags, or users..."
            style={{padding: '12px 16px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', width: '100%'}}
          />
          <button onClick={performSearch} style={{marginTop: '10px', padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>
            🔎 Search
          </button>
        </div>

        <div className="explore-tabs">
          <button onClick={() => { setTab('ideas'); setResults([]) }} className={tab === 'ideas' ? 'active' : ''}>
            💡 Ideas
          </button>
          <button onClick={() => { setTab('users'); setUsers([]) }} className={tab === 'users' ? 'active' : ''}>
            👥 Users
          </button>
          <button onClick={() => setTab('trending')}>🔥 Trending</button>
          <button onClick={() => setTab('featured')}>⭐ Featured</button>
        </div>

        {tab === 'ideas' && (
          <div className="explore-content">
            <div className="filters">
              <h3>Filters</h3>
              <div>
                <label><strong>Category</strong></label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}>
                  <option>All</option>
                  <option>Tech</option>
                  <option>Business</option>
                  <option>Social Good</option>
                  <option>Education</option>
                  <option>Health</option>
                  <option>Entertainment</option>
                </select>
              </div>
            </div>

            <div className="results">
              {loading ? (
                <p style={{textAlign: 'center', color: '#999'}}>Searching...</p>
              ) : results.length === 0 ? (
                <p style={{textAlign: 'center', color: '#999', padding: '40px'}}>
                  {search ? 'No ideas found. Try a different search!' : 'Start searching to discover ideas'}
                </p>
              ) : (
                <div className="ideas-grid">
                  {results.map(idea => (
                    <div key={idea._id} className="idea-card" onClick={() => navigate(`/idea/${idea._id}`)}>
                      <div className="idea-card-header">
                        <h3>{idea.title}</h3>
                        <span className="category">{idea.category}</span>
                      </div>
                      <p>{idea.description.substring(0, 100)}...</p>
                      <div className="idea-card-stats">
                        <span>👍 {idea.upvotes?.length || 0}</span>
                        <span>💬 {idea.comments?.length || 0}</span>
                        <span>⭐ {Math.round(idea.ranking * 10) / 10}</span>
                      </div>
                      {idea.tags?.length > 0 && (
                        <div className="idea-tags">
                          {idea.tags.slice(0, 2).map(tag => (
                            <span key={tag}>#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="explore-content">
            {loading ? (
              <p style={{textAlign: 'center', color: '#999'}}>Searching...</p>
            ) : users.length === 0 ? (
              <p style={{textAlign: 'center', color: '#999', padding: '40px'}}>
                {search ? 'No users found.' : 'Start searching for users'}
              </p>
            ) : (
              <div className="users-grid">
                {users.map(u => (
                  <div key={u._id} className="user-card">
                    <div style={{textAlign: 'center', marginBottom: '12px'}}>
                      <div style={{fontSize: '40px', marginBottom: '8px'}}>👤</div>
                      <h4 style={{margin: '0'}}>{u.name}</h4>
                      {u.department && <small style={{color: '#666'}}>{u.department}</small>}
                    </div>
                    {u.bio && <p style={{fontSize: '13px', color: '#555', marginBottom: '12px'}}>{u.bio}</p>}
                    <div style={{display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '12px', fontSize: '13px', color: '#666'}}>
                      <span>👥 {u.followers?.length || 0} followers</span>
                      <span>💡 {u.ideas || 0} ideas</span>
                    </div>
                    <button onClick={() => navigate(`/profile/${u._id}`)} style={{width: '100%', padding: '8px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'trending' && (
          <div className="explore-content">
            <h2>🔥 Trending This Week</h2>
            <div className="ideas-grid">
              {/* Placeholder - would fetch trending ideas */}
              <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#999'}}>
                Loading trending ideas...
              </div>
            </div>
          </div>
        )}

        {tab === 'featured' && (
          <div className="explore-content">
            <h2>⭐ Featured Ideas</h2>
            <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
              Our team's handpicked best ideas coming soon!
            </div>
          </div>
        )}
      </div>

      <style>{`
        .explore-page {
          padding: 20px 0;
          background: #f8f9fa;
          minHeight: 100vh;
        }

        .search-box {
          background: white;
          padding: 20px;
          borderRadius: 8px;
          border: 1px solid #ddd;
          marginBottom: 30px;
        }

        .explore-tabs {
          display: flex;
          gap: 10px;
          marginBottom: 30px;
          borderBottom: 1px solid #e0e0e0;
        }

        .explore-tabs button {
          padding: 10px 16px;
          background: white;
          border: none;
          cursor: pointer;
          color: #666;
          fontWeight: bold;
          borderBottom: 3px solid transparent;
          transition: all 0.3s ease;
        }

        .explore-tabs button:hover {
          color: #007bff;
        }

        .explore-tabs button.active {
          color: #007bff;
          borderBottomColor: #007bff;
        }

        .explore-content {
          display: flex;
          gap: 20px;
        }

        .filters {
          background: white;
          padding: 20px;
          borderRadius: 8px;
          border: 1px solid #ddd;
          width: 200px;
          height: fit-content;
        }

        .results {
          flex: 1;
        }

        .ideas-grid {
          display: grid;
          gridTemplateColumns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .idea-card {
          background: white;
          padding: 16px;
          borderRadius: 8px;
          border: 1px solid #e0e0e0;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .idea-card:hover {
          boxShadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-4px);
        }

        .idea-card-header {
          display: flex;
          justifyContent: space-between;
          alignItems: flex-start;
          marginBottom: 10px;
          gap: 10px;
        }

        .idea-card-header h3 {
          margin: 0;
          fontSize: 16px;
          color: #333;
        }

        .category {
          background: #f0f0f0;
          padding: 4px 8px;
          borderRadius: 4px;
          fontSize: 11px;
          fontWeight: bold;
          whiteSpace: nowrap;
        }

        .idea-card-stats {
          display: flex;
          gap: 12px;
          fontSize: 13px;
          color: #666;
          marginTop: 10px;
        }

        .idea-tags {
          display: flex;
          gap: 6px;
          marginTop: 10px;
          flexWrap: wrap;
        }

        .idea-tags span {
          background: #e8f4f8;
          color: #0066cc;
          padding: 2px 8px;
          borderRadius: 12px;
          fontSize: 11px;
        }

        .users-grid {
          display: grid;
          gridTemplateColumns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }

        .user-card {
          background: white;
          padding: 20px;
          borderRadius: 8px;
          border: 1px solid #e0e0e0;
          textAlign: center;
          transition: all 0.3s ease;
        }

        .user-card:hover {
          boxShadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        @media (maxWidth: 768px) {
          .explore-content {
            flexDirection: column;
          }

          .filters {
            width: 100%;
          }

          .ideas-grid {
            gridTemplateColumns: 1fr;
          }

          .users-grid {
            gridTemplateColumns: repeat(auto-fill, minmax(150px, 1fr));
          }
        }
      `}</style>
    </div>
  )
}
