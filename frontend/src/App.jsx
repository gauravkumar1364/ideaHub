import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Auth from './components/Auth'

export default function App() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [theme, setTheme] = useState(() => {
    if(typeof window !== 'undefined'){
      const stored = window.localStorage.getItem('theme')
      if(stored === 'dark' || stored === 'light') return stored
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    }
    return 'light'
  })

  const normalizeUser = (raw) => {
    if(!raw) return null
    const normalizedId = raw._id || raw.id || raw.userId || null
    const username = raw.username || raw.name || ''
    const name = raw.name || raw.username || ''
    return {
      ...raw,
      _id: normalizedId,
      id: normalizedId,
      username,
      name
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if(!stored) return
    try {
      const parsed = JSON.parse(stored)
      const normalized = normalizeUser(parsed)
      if(normalized) setUser(normalized)
    } catch (err) {
      console.error('Failed to parse stored user', err)
    }
  }, [])

  useEffect(() => {
    if(typeof window === 'undefined') return
    document.body.classList.toggle('theme-dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  function handleLogout(){
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }

  function handleAuthSuccess(u){
    const normalized = normalizeUser(u)
    if(normalized){
      localStorage.setItem('user', JSON.stringify(normalized))
      setUser(normalized)
    }
    setShowAuth(false)
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="app-shell">
      <Navbar
        user={user}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogin={() => setShowAuth(true)}
        onLogout={handleLogout}
      />
      {showAuth && <Auth onSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />}
      <main className="page-content">
        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  )
}

