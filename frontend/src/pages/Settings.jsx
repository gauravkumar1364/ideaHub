import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API || 'http://localhost:5000/api'

export default function Settings(){
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    bio: '',
    department: '',
    batch: '',
    email: ''
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if(!stored) return navigate('/login')
    setUser(JSON.parse(stored))
    fetchUserDetails()
  }, [])

  async function fetchUserDetails(){
    try{
      const token = localStorage.getItem('token')
      const res = await axios.get(API + '/users/profile/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setForm({
        name: res.data.name,
        bio: res.data.bio || '',
        department: res.data.department || '',
        batch: res.data.batch || '',
        email: res.data.email
      })
    }catch(e){
      console.error('Failed to load user details')
    }finally{
      setLoading(false)
    }
  }

  async function saveProfile(){
    setSaving(true)
    try{
      const token = localStorage.getItem('token')
      const res = await axios.post(API + '/users/profile/update', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      localStorage.setItem('user', JSON.stringify(res.data))
      alert('Profile updated successfully!')
    }catch(e){
      alert('Failed to update profile: ' + (e.response?.data?.message || 'Unknown error'))
    }finally{
      setSaving(false)
    }
  }

  async function changePassword(){
    if(passwords.new !== passwords.confirm) return alert('Passwords don\'t match!')
    if(passwords.new.length < 6) return alert('Password must be at least 6 characters')
    
    setSaving(true)
    try{
      const token = localStorage.getItem('token')
      await axios.post(API + '/users/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Password changed successfully!')
      setPasswords({ current: '', new: '', confirm: '' })
    }catch(e){
      alert('Failed to change password: ' + (e.response?.data?.message || 'Unknown error'))
    }finally{
      setSaving(false)
    }
  }

  function logout(){
    if(window.confirm('Are you sure you want to log out?')){
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login')
    }
  }

  if(loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading...</div>

  return (
    <div className="settings-page">
      <div style={{maxWidth: '800px', margin: '0 auto', padding: '20px'}}>
        <h1>⚙️ Settings & Account</h1>

        <div className="settings-tabs">
          <button 
            onClick={() => setTab('profile')}
            className={tab === 'profile' ? 'active' : ''}
          >
            👤 Edit Profile
          </button>
          <button 
            onClick={() => setTab('password')}
            className={tab === 'password' ? 'active' : ''}
          >
            🔐 Change Password
          </button>
          <button 
            onClick={() => setTab('privacy')}
            className={tab === 'privacy' ? 'active' : ''}
          >
            🔒 Privacy & Security
          </button>
          <button 
            onClick={() => setTab('account')}
            className={tab === 'account' ? 'active' : ''}
          >
            ⚡ Account
          </button>
        </div>

        {tab === 'profile' && (
          <div className="settings-content">
            <h2>Edit Your Profile</h2>
            
            <div className="form-group">
              <label>Full Name</label>
              <input 
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                placeholder="Your name"
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}}
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea 
                value={form.bio}
                onChange={(e) => setForm({...form, bio: e.target.value})}
                placeholder="Tell us about yourself..."
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px'}}
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input 
                value={form.department}
                onChange={(e) => setForm({...form, department: e.target.value})}
                placeholder="e.g., Computer Science, Engineering"
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}}
              />
            </div>

            <div className="form-group">
              <label>Batch / Graduation Year</label>
              <input 
                value={form.batch}
                onChange={(e) => setForm({...form, batch: e.target.value})}
                placeholder="e.g., 2024"
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}}
              />
            </div>

            <div className="form-group">
              <label>Email (Read-only)</label>
              <input 
                value={form.email}
                disabled
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', background: '#f5f5f5'}}
              />
            </div>

            <button 
              onClick={saveProfile}
              disabled={saving}
              style={{
                padding: '12px 24px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '20px'
              }}
            >
              {saving ? '💾 Saving...' : '💾 Save Changes'}
            </button>
          </div>
        )}

        {tab === 'password' && (
          <div className="settings-content">
            <h2>Change Your Password</h2>
            
            <div style={{background: '#fff3cd', padding: '12px', borderRadius: '6px', marginBottom: '20px', borderLeft: '4px solid #ffc107'}}>
              <p style={{margin: 0, color: '#856404'}}>For security, choose a strong password with letters, numbers, and special characters.</p>
            </div>

            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                placeholder="Enter your current password"
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                placeholder="Enter new password"
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input 
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                placeholder="Confirm new password"
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}}
              />
            </div>

            <button 
              onClick={changePassword}
              disabled={saving}
              style={{
                padding: '12px 24px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '20px'
              }}
            >
              {saving ? '⏳ Updating...' : '🔐 Change Password'}
            </button>
          </div>
        )}

        {tab === 'privacy' && (
          <div className="settings-content">
            <h2>Privacy & Security</h2>
            
            <div className="setting-item">
              <div>
                <h4>Public Profile</h4>
                <p style={{color: '#666', fontSize: '14px'}}>Allow others to view your profile and ideas</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>

            <div className="setting-item">
              <div>
                <h4>Email Notifications</h4>
                <p style={{color: '#666', fontSize: '14px'}}>Receive email for new follows, comments, and upvotes</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>

            <div className="setting-item">
              <div>
                <h4>Show Email to Others</h4>
                <p style={{color: '#666', fontSize: '14px'}}>Let other users contact you via email</p>
              </div>
              <input type="checkbox" />
            </div>

            <div className="setting-item">
              <div>
                <h4>Two-Factor Authentication</h4>
                <p style={{color: '#666', fontSize: '14px'}}>Add extra security to your account (coming soon)</p>
              </div>
              <button disabled style={{padding: '8px 16px', background: '#ddd', color: '#999', border: 'none', borderRadius: '4px', cursor: 'not-allowed'}}>
                Enable
              </button>
            </div>
          </div>
        )}

        {tab === 'account' && (
          <div className="settings-content">
            <h2>Account Management</h2>
            
            <div className="danger-zone">
              <h3>⚠️ Danger Zone</h3>
              
              <div className="danger-item">
                <div>
                  <h4>Download Your Data</h4>
                  <p style={{color: '#666', fontSize: '14px'}}>Get a copy of all your data (coming soon)</p>
                </div>
                <button disabled style={{padding: '8px 16px', background: '#ddd', color: '#999', border: 'none', borderRadius: '4px', cursor: 'not-allowed'}}>
                  📥 Download
                </button>
              </div>

              <div className="danger-item">
                <div>
                  <h4>Deactivate Account</h4>
                  <p style={{color: '#666', fontSize: '14px'}}>Temporarily disable your account (you can reactivate later)</p>
                </div>
                <button style={{padding: '8px 16px', background: '#ffc107', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                  ⏸️ Deactivate
                </button>
              </div>

              <div className="danger-item">
                <div>
                  <h4>Delete Account Permanently</h4>
                  <p style={{color: '#666', fontSize: '14px'}}>This action cannot be undone. All your data will be deleted.</p>
                </div>
                <button style={{padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                  🗑️ Delete Permanently
                </button>
              </div>
            </div>

            <div style={{marginTop: '30px'}}>
              <button 
                onClick={logout}
                style={{
                  padding: '12px 24px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .settings-page {
          padding: 20px 0;
          background: #f8f9fa;
          minHeight: 100vh;
        }

        .settings-tabs {
          display: flex;
          gap: 10px;
          marginBottom: 30px;
          borderBottom: 1px solid #e0e0e0;
          flexWrap: wrap;
        }

        .settings-tabs button {
          padding: 10px 16px;
          background: white;
          border: none;
          cursor: pointer;
          color: #666;
          fontWeight: bold;
          borderBottom: 3px solid transparent;
          transition: all 0.3s ease;
        }

        .settings-tabs button:hover {
          color: #007bff;
        }

        .settings-tabs button.active {
          color: #007bff;
          borderBottomColor: #007bff;
        }

        .settings-tabs button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .settings-content {
          background: white;
          padding: 30px;
          borderRadius: 8px;
          border: 1px solid #e0e0e0;
        }

        .form-group {
          marginBottom: 20px;
        }

        .form-group label {
          display: block;
          fontWeight: bold;
          marginBottom: 8px;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          fontFamily: inherit;
        }

        .setting-item {
          display: flex;
          justifyContent: space-between;
          alignItems: center;
          padding: 16px 0;
          borderBottom: 1px solid #e0e0e0;
        }

        .setting-item:last-child {
          borderBottom: none;
        }

        .danger-zone {
          background: #fff5f5;
          padding: 20px;
          borderRadius: 8px;
          border: 1px solid #fcc;
          marginTop: 20px;
        }

        .danger-zone h3 {
          color: #dc3545;
          margin-top: 0;
        }

        .danger-item {
          display: flex;
          justifyContent: space-between;
          alignItems: center;
          padding: 12px 0;
          borderBottom: 1px solid #fdd;
        }

        .danger-item:last-child {
          borderBottom: none;
        }

        .danger-item h4 {
          margin: 0 0 4px 0;
          color: #333;
        }

        @media (maxWidth: 600px) {
          .settings-tabs {
            flexDirection: column;
          }

          .settings-tabs button {
            width: 100%;
            borderBottom: none;
            borderLeft: 3px solid transparent;
          }

          .settings-tabs button.active {
            borderLeftColor: #007bff;
          }

          .settings-content {
            padding: 20px;
          }

          .setting-item,
          .danger-item {
            flexDirection: column;
            alignItems: flex-start;
            gap: 10px;
          }

          .setting-item button,
          .danger-item button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
