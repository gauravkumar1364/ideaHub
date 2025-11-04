import React, { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Auth from './components/Auth'

export default function App() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if(stored) setUser(JSON.parse(stored))
  }, [])

  function handleLogout(){
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
  }

  function handleAuthSuccess(u){
    setUser(u)
    setShowAuth(false)
  }

  return (
    <div>
      <Navbar user={user} onLogin={() => setShowAuth(true)} onLogout={handleLogout} />
      {showAuth && <Auth onSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />}
      <main style={{ padding: '16px', maxWidth: 900, margin: '0 auto' }}>
        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  )
}

