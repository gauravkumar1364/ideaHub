import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

const API = import.meta.env.VITE_API || 'http://localhost:5000/api'

export default function Profile(){
  const { userId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOwn, setIsOwn] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if(stored) setCurrentUser(JSON.parse(stored))
    fetchProfile()
  }, [userId])

  async function fetchProfile(){
    setLoading(true)
    try{
      const res = await axios.get(API + '/users/profile/' + (userId || 'me'))
      setProfile(res.data)
      setIdeas(res.data.ideas || [])
      const stored = localStorage.getItem('user')
      if(stored){
        const u = JSON.parse(stored)
        setIsOwn(u._id === res.data._id)
        setIsFollowing(res.data.followers?.some(f => f._id === u._id) || false)
      }
    }catch(e){
      console.error('Failed to load profile')
    }finally{
      setLoading(false)
    }
  }

  async function toggleFollow(){
    if(!currentUser) return alert('Please log in')
    try{
      const token = localStorage.getItem('token')
      const endpoint = isFollowing ? 'unfollow' : 'follow'
      await axios.post(API + '/users/' + endpoint + '/' + profile._id, {}, { headers: { Authorization: `Bearer ${token}` } })
      setIsFollowing(!isFollowing)
      setProfile(prev => ({
        ...prev,
        followers: isFollowing ? prev.followers.filter(f => f._id !== currentUser._id) : [...prev.followers, currentUser]
      }))
    }catch(e){
      alert('Failed to update follow status')
    }
  }

  if(loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading profile...</div>
  if(!profile) return <div style={{padding: '40px', textAlign: 'center'}}>Profile not found</div>

  return (
    <div className="profile-page">
      <div style={{maxWidth: '1000px', margin: '0 auto', padding: '20px'}}>
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">{profile.name?.[0]?.toUpperCase() || 'U'}</div>
          <div className="profile-info">
            <h1>{profile.name}</h1>
            {profile.department && <p className="profile-username">{profile.department}</p>}
            {profile.batch && <p className="profile-username">Class of {profile.batch}</p>}
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
            
            <div className="profile-stats">
              <div className="stat">
                <div className="stat-number">{ideas.length}</div>
                <div className="stat-label">Ideas</div>
              </div>
              <div className="stat">
                <div className="stat-number">{profile.followers?.length || 0}</div>
                <div className="stat-label">Followers</div>
              </div>
              <div className="stat">
                <div className="stat-number">{profile.following?.length || 0}</div>
                <div className="stat-label">Following</div>
              </div>
            </div>

            <div className="profile-actions">
              {isOwn ? (
                <button onClick={() => navigate('/settings')} className="btn-primary">
                  Edit Profile
                </button>
              ) : (
                <button onClick={toggleFollow} className={isFollowing ? 'btn-secondary' : 'btn-primary'}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Ideas Grid */}
        <div style={{marginTop: '30px'}}>
          <h2 style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#000'}}>
            {isOwn ? 'My Ideas' : profile.name + "'s Ideas"} ({ideas.length})
          </h2>
          {ideas.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px', background: '#f5f5f5', borderRadius: '4px', color: '#999'}}>
              <p>{isOwn ? 'You haven\'t shared any ideas yet. Start by creating one!' : profile.name + ' hasn\'t shared any ideas yet.'}</p>
              {isOwn && (
                <button onClick={() => navigate('/create')} className="btn-primary" style={{marginTop: '12px'}}>
                  Create First Idea
                </button>
              )}
            </div>
          ) : (
            <div className="ideas-grid">
              {ideas.map(idea => (
                <div key={idea._id} className="idea-card" onClick={() => navigate(`/idea/${idea._id}`)}>
                  <h4>{idea.title}</h4>
                  <p className="post-description">{idea.description.substring(0, 80)}...</p>
                  <div style={{display: 'flex', gap: '12px', fontSize: '12px', color: '#999', marginTop: '8px'}}>
                    <span>{idea.upvotes?.length || 0} Upvotes</span>
                    <span>{idea.comments?.length || 0} Comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
