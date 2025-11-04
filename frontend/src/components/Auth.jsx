import React, { useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API || 'http://localhost:5000/api'

export default function Auth({onSuccess, onClose}){
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(){
    setError('')
    try{
      if(mode === 'register'){
        if(!name.trim()) return setError('Name required')
        const res = await axios.post(API + '/auth/register', { name, email, password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        onSuccess(res.data.user)
      } else {
        const res = await axios.post(API + '/auth/login', { email, password })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
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
        <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        
        {mode === 'register' && (
          <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Full name"
          />
        )}
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email"
          type="email"
        />
        <input 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password"
          type="password"
        />
        
        {error && <p className="error">{error}</p>}
        
        <button onClick={handleSubmit} className="submit-btn">
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
        
        <p className="toggle-mode">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => {setMode(mode === 'login' ? 'register' : 'login'); setError('')}} style={{background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}>
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
