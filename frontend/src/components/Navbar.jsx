import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API || 'http://localhost:5000/api'

export default function Navbar({user, onLogin, onLogout}){
  const navigate = useNavigate()
  const [searchUsers, setSearchUsers] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  async function handleSearchUsers(q){
    setSearchUsers(q)
    if(!q.trim()){
      setSearchResults([])
      return
    }
    try{
      const res = await axios.get(API + '/users?q=' + encodeURIComponent(q))
      setSearchResults(res.data)
    }catch(e){
      console.log('search failed')
    }
  }

  const handleNavClick = (path) => {
    navigate(path)
    setShowUserMenu(false)
  }

  return (
    <nav className="navbar-professional">
      {/* Logo */}
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <span className="logo-icon">💡</span>
        <span className="logo-text">ideaHub</span>
      </div>

      {/* Search Bar */}
      <div className="navbar-search">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            value={searchUsers} 
            onChange={e => handleSearchUsers(e.target.value)}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            placeholder="Search ideas or users..."
            className="search-input"
          />
        </div>
        {showSearch && searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map(u => (
              <div key={u._id} onClick={() => { handleNavClick(`/profile/${u._id}`); setSearchUsers('') }} className="search-result">
                <span className="result-avatar">{u.name?.[0]?.toUpperCase()}</span>
                <span className="result-name">{u.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Icons */}
      <div className="navbar-icons">
        <button 
          className="nav-icon-btn" 
          onClick={() => handleNavClick('/')}
          title="Home"
        >
          🏠
        </button>
        <button 
          className="nav-icon-btn" 
          onClick={() => handleNavClick('/explore')}
          title="Explore"
        >
          🌍
        </button>
        
        {user ? (
          <>
            <button 
              className="nav-icon-btn" 
              onClick={() => handleNavClick('/notifications')}
              title="Notifications"
            >
              🔔
            </button>
            
            {/* User Menu */}
            <div className="user-menu-wrapper">
              <button 
                className="user-avatar-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                title={user.name}
              >
                <span className="avatar-circle">{user.name?.[0]?.toUpperCase()}</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span className="header-avatar">{user.name?.[0]?.toUpperCase()}</span>
                    <div className="header-info">
                      <p className="header-name">{user.name}</p>
                      <p className="header-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  <button onClick={() => handleNavClick(`/profile/${user._id}`)} className="dropdown-item">
                    👤 Profile
                  </button>
                  <button onClick={() => handleNavClick('/settings')} className="dropdown-item">
                    ⚙️ Settings
                  </button>
                  <div className="dropdown-divider"></div>
                  <button onClick={() => { onLogout(); setShowUserMenu(false); }} className="dropdown-item logout">
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button onClick={onLogin} className="nav-signin-btn">
            Sign In
          </button>
        )}
      </div>
    </nav>
  )
}


