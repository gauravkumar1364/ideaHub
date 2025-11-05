import React, { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API || 'http://localhost:5000/api'

export default function Auth({onSuccess, onClose}){
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(){
    setError('')
    try{
      if(mode === 'register'){
        const trimmedUsername = username.trim()
        if(!trimmedUsername) return setError('Username required')
        if(trimmedUsername.length < 3) return setError('Username must be at least 3 characters')
  if(!password) return setError('Password required')
  if(password.length < 6) return setError('Password must be at least 6 characters')
        const res = await axios.post(API + '/auth/register', { username: trimmedUsername, password })
        localStorage.setItem('token', res.data.token)
        onSuccess(res.data.user)
      } else {
        const trimmedUsername = username.trim()
        if(!trimmedUsername) return setError('Username required')
        if(!password) return setError('Password required')
        const res = await axios.post(API + '/auth/login', { username: trimmedUsername, password })
        localStorage.setItem('token', res.data.token)
        onSuccess(res.data.user)
      }
    }catch(e){
      setError(e.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="auth-modal">
      <div className="auth-container">
        <button onClick={onClose} className="close-btn">×</button>
        <h2>{mode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
        <p className="auth-subtitle">{mode === 'login' ? 'Sign in to share ideas and join the conversation.' : 'Join the community and start sharing your best ideas.'}</p>
        <input 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          placeholder="Username"
          autoComplete="username"
        />
        <input 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password"
          type="password"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
        
        {error && <p className="error">{error}</p>}
        
        <button onClick={handleSubmit} className="submit-btn">
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
        
        <p className="toggle-mode">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button 
            type="button" 
            className="toggle-mode-btn"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError('')
              setPassword('')
            }}
          >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
