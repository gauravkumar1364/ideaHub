import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API } from '../utils/api'
import {
  FiZap,
  FiUsers,
  FiTrendingUp,
  FiStar,
  FiThumbsUp,
  FiMessageSquare,
  FiBarChart2,
  FiUserCheck
} from 'react-icons/fi'

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
      } else if(tab === 'users'){
        const res = await axios.get(API + '/users/search?q=' + encodeURIComponent(search))
        setUsers(res.data)
      }
    }catch(e){
      console.error('Search failed')
    }finally{
      setLoading(false)
    }
  }

  const handleTabChange = (nextTab) => {
    setTab(nextTab)
    setResults([])
    setUsers([])
  }

  return (
    <div className="explore-page">
      <div className="page-shell explore-shell">
        <header className="page-header">
          <div>
            <h1>Explore the hub</h1>
            <p className="page-subtitle">Dive into trending ideas and discover creators worth following.</p>
          </div>
          <button
            className="btn-primary"
            onClick={() => navigate(user ? '/create' : '/login')}
          >
            Share an Idea
          </button>
        </header>

        <section className="card search-card">
          <div className="search-fieldset">
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch()}
              placeholder="Search ideas, tags, or users..."
              className="search-field"
            />
            <button onClick={performSearch} className="btn-primary search-button">
              Search
            </button>
          </div>
          <p className="search-hint">Try topics like <span>#ai</span>, <span>#design</span>, or <span>#productivity</span>.</p>
        </section>

        <div className="explore-tabs">
          <button onClick={() => handleTabChange('ideas')} className={tab === 'ideas' ? 'active' : ''}>
            <FiZap aria-hidden="true" />
            <span>Ideas</span>
          </button>
          <button onClick={() => handleTabChange('users')} className={tab === 'users' ? 'active' : ''}>
            <FiUsers aria-hidden="true" />
            <span>Users</span>
          </button>
          <button onClick={() => handleTabChange('trending')} className={tab === 'trending' ? 'active' : ''}>
            <FiTrendingUp aria-hidden="true" />
            <span>Trending</span>
          </button>
          <button onClick={() => handleTabChange('featured')} className={tab === 'featured' ? 'active' : ''}>
            <FiStar aria-hidden="true" />
            <span>Featured</span>
          </button>
        </div>

        {tab === 'ideas' && (
          <section className="explore-content">
            <aside className="filters card">
              <div className="filters-header">
                <h3>Filter ideas</h3>
                <p>Refine what shows up in your feed.</p>
              </div>
              <label className="filter-label">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="filter-select">
                <option>All</option>
                <option>Tech</option>
                <option>Business</option>
                <option>Social Good</option>
                <option>Education</option>
                <option>Health</option>
                <option>Entertainment</option>
              </select>
              <p className="filter-hint">More filters coming soon.</p>
            </aside>

            <div className="results">
              {loading ? (
                <div className="loading-state">Searching ideas...</div>
              ) : results.length === 0 ? (
                <div className="empty-state">
                  <h3>{search ? 'No ideas found' : 'Start a search'}</h3>
                  <p>{search ? 'Try another keyword or broaden your filters.' : 'Discover projects, tags, or contributors across ideaHub.'}</p>
                </div>
              ) : (
                <div className="ideas-grid">
                  {results
                    .filter(idea => category === 'All' || idea.category === category)
                    .map(idea => (
                      <article key={idea._id} className="idea-card" onClick={() => navigate(`/idea/${idea._id}`)}>
                        <header className="idea-card-header">
                          <h3>{idea.title}</h3>
                          <span className="category-badge">{idea.category}</span>
                        </header>
                        <p className="idea-card-description">{idea.description.substring(0, 120)}...</p>
                        <div className="idea-card-stats">
                          <span><FiThumbsUp aria-hidden="true" /> {idea.upvotes?.length || 0}</span>
                          <span><FiMessageSquare aria-hidden="true" /> {idea.comments?.length || 0}</span>
                          <span><FiBarChart2 aria-hidden="true" /> {Math.round((idea.ranking || 0) * 10) / 10}</span>
                        </div>
                        {idea.tags?.length > 0 && (
                          <div className="idea-tags">
                            {idea.tags.slice(0, 3).map(tag => (
                              <span key={tag}>#{tag}</span>
                            ))}
                          </div>
                        )}
                      </article>
                    ))}
                </div>
              )}
            </div>
          </section>
        )}

        {tab === 'users' && (
          <section className="explore-content full">
            {loading ? (
              <div className="loading-state">Searching creators...</div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <h3>{search ? 'No people found' : 'Find collaborators'}</h3>
                <p>{search ? 'Try searching with a different name or department.' : 'Search above to discover new people to follow.'}</p>
              </div>
            ) : (
              <div className="users-grid">
                {users.map(u => {
                  const userId = u._id || u.id
                  const goToProfile = () => {
                    if(userId) navigate(`/profile/${userId}`)
                  }
                  return (
                    <div
                      key={userId}
                      className="user-card"
                      role="button"
                      tabIndex={0}
                      onClick={goToProfile}
                      onKeyDown={(event) => {
                        if((event.key === 'Enter' || event.key === ' ') && userId){
                          event.preventDefault()
                          goToProfile()
                        }
                      }}
                    >
                    <div className="user-avatar">{(u.name || u.username || 'U')?.[0]?.toUpperCase()}</div>
                    <h4>{u.name || u.username}</h4>
                    {u.username && <p className="user-handle">@{u.username}</p>}
                    {u.department && <p className="user-meta">{u.department}</p>}
                    {u.bio && <p className="user-bio">{u.bio}</p>}
                    <div className="user-stats">
                      <span><FiUserCheck aria-hidden="true" /> {u.followers?.length || 0}</span>
                      <span><FiZap aria-hidden="true" /> {u.ideas || 0}</span>
                    </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          goToProfile()
                        }}
                        className="btn-secondary"
                      >
                        View Profile
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {tab === 'trending' && (
          <section className="explore-content full">
            <div className="empty-state">
              <h3>
                <FiTrendingUp aria-hidden="true" />
                <span>Trending This Week</span>
              </h3>
              <p>We&apos;re curating the most active ideas right now. Check back soon!</p>
            </div>
          </section>
        )}

        {tab === 'featured' && (
          <section className="explore-content full">
            <div className="empty-state">
              <h3>
                <FiStar aria-hidden="true" />
                <span>Featured Ideas</span>
              </h3>
              <p>Our editorial showcase is coming soon. Want to be featured? Keep sharing!</p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
