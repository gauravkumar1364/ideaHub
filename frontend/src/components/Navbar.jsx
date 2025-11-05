import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  FiZap,
  FiSearch,
  FiPlus,
  FiHome,
  FiGlobe,
  FiUsers,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiSun,
  FiMoon
} from 'react-icons/fi'

const API = import.meta.env.VITE_API || 'http://localhost:5000/api'

export default function Navbar({ user, theme = 'light', onToggleTheme, onLogin, onLogout }){
  const navigate = useNavigate()
  const location = useLocation()
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

  const handleCreateClick = () => {
    if(user){
      handleNavClick('/create')
    } else {
      onLogin()
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar-professional">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <FiZap className="logo-icon" aria-hidden="true" />
        <span className="logo-text">ideaHub</span>
      </div>

      <div className="navbar-search">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" aria-hidden="true" />
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
            {searchResults.map(u => {
              const label = u.username
                ? (u.name ? `${u.name} (@${u.username})` : `@${u.username}`)
                : (u.name || 'User')

              return (
                <div key={u._id} onClick={() => { handleNavClick(`/profile/${u._id}`); setSearchUsers('') }} className="search-result">
                  <span className="result-avatar">
                    {u.profilePicture ? (
                      <img src={u.profilePicture} alt="" className="avatar-image" />
                    ) : (
                      (u.name || u.username || 'U')?.[0]?.toUpperCase()
                    )}
                  </span>
                  <span className="result-name">{label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="navbar-icons">
        <button 
          className="nav-pill"
          onClick={handleCreateClick}
        >
          <FiPlus className="pill-icon" aria-hidden="true" />
          <span>New Idea</span>
        </button>
        <span className="nav-divider" aria-hidden="true"></span>
        <button
          className="nav-icon-btn"
          onClick={() => onToggleTheme?.()}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Activate light mode' : 'Activate dark mode'}
        >
          {theme === 'dark' ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
        </button>
        <button 
          className={`nav-icon-btn${isActive('/') ? ' is-active' : ''}`}
          onClick={() => handleNavClick('/')}
          title="Home"
        >
          <FiHome aria-hidden="true" />
        </button>
        <button 
          className={`nav-icon-btn${isActive('/explore') ? ' is-active' : ''}`}
          onClick={() => handleNavClick('/explore')}
          title="Explore"
        >
          <FiGlobe aria-hidden="true" />
        </button>
        <button 
          className={`nav-icon-btn${isActive('/following') ? ' is-active' : ''}`}
          onClick={() => handleNavClick('/following')}
          title="Following"
        >
          <FiUsers aria-hidden="true" />
        </button>
        
        {user ? (
          <>
            <button 
              className={`nav-icon-btn${isActive('/notifications') ? ' is-active' : ''}`}
              onClick={() => handleNavClick('/notifications')}
              title="Notifications"
            >
              <FiBell aria-hidden="true" />
            </button>
            
            {/* User Menu */}
            <div className="user-menu-wrapper">
              <button 
                className="user-avatar-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                title={user.username || user.name}
              >
                <span className="avatar-circle">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt="" className="avatar-image" />
                  ) : (
                    (user.name || user.username || 'U')?.[0]?.toUpperCase()
                  )}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span className="header-avatar">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt="" className="avatar-image" />
                      ) : (
                        (user.name || user.username || 'U')?.[0]?.toUpperCase()
                      )}
                    </span>
                    <div className="header-info">
                      <p className="header-name">{user.name || user.username}</p>
                      <p className="header-email">@{user.username}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  <button onClick={() => handleNavClick(`/profile/${user._id}`)} className="dropdown-item">
                    <FiUser aria-hidden="true" />
                    <span>Profile</span>
                  </button>
                  <button onClick={() => handleNavClick('/settings')} className="dropdown-item">
                    <FiSettings aria-hidden="true" />
                    <span>Settings</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button onClick={() => { onLogout(); setShowUserMenu(false); }} className="dropdown-item logout">
                    <FiLogOut aria-hidden="true" />
                    <span>Logout</span>
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


