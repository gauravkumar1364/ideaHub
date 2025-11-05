import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { API } from '../utils/api'
import {
  FiEdit3,
  FiUserPlus,
  FiUserCheck,
  FiZap,
  FiMessageSquare,
  FiThumbsUp
} from 'react-icons/fi'

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
      console.log('Profile fetched:', res.data)
      setProfile(res.data)
      setIdeas(res.data.ideas || [])
      const stored = localStorage.getItem('user')
      if(stored){
        const u = JSON.parse(stored)
        setIsOwn(u._id === res.data._id)
        // Check if current user is in the followers array
        const isFollowing = res.data.followers?.some(f => f._id === u._id || f === u._id) || false
        setIsFollowing(isFollowing)
      }
    }catch(e){
      console.error('Failed to load profile:', e.response?.data || e.message)
    }finally{
      setLoading(false)
    }
  }

  async function toggleFollow(){
    if(!currentUser) return alert('Please log in')
    if(!profile) return alert('Profile not loaded')
    try{
      const token = localStorage.getItem('token')
      // Use username-based follow endpoint instead of ID
      const endpoint = isFollowing ? 'unfollow-by-username' : 'follow-by-username'
      const response = await axios.post(
        `${API}/users/${endpoint}/${profile.username}`, 
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log('Follow response:', response.data)
      setIsFollowing(!isFollowing)
      // Update profile with new follower count
      setProfile(prev => ({
        ...prev,
        followersCount: response.data.target.followersCount
      }))
    }catch(e){
      console.error('Follow error:', e.response?.data || e.message)
      alert('Failed to update follow status: ' + (e.response?.data?.message || e.message))
    }
  }

  if(loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading profile...</div>
  if(!profile) return <div style={{padding: '40px', textAlign: 'center'}}>Profile not found</div>

  const displayName = profile.name || profile.username || 'User'

  return (
    <div className="profile-page">
      <div className="page-shell profile-shell">
        <section className="profile-header card">
          <div className="profile-avatar">
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt={`${displayName}'s avatar`} className="avatar-image" />
            ) : (
              displayName?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <div className="profile-info">
            <h1>{displayName}</h1>
            {profile.username && (
              <p className="profile-handle">@{profile.username}</p>
            )}
            <div className="profile-meta">
              {profile.department && <span>{profile.department}</span>}
              {profile.batch && <span>Class of {profile.batch}</span>}
            </div>
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
                  <FiEdit3 aria-hidden="true" />
                  <span>Edit profile</span>
                </button>
              ) : (
                <button onClick={toggleFollow} className={isFollowing ? 'btn-secondary' : 'btn-primary'}>
                  {isFollowing ? (
                    <>
                      <FiUserCheck aria-hidden="true" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <FiUserPlus aria-hidden="true" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="profile-ideas">
          <header className="section-header">
            <h2>{isOwn ? 'My ideas' : `${displayName}'s ideas`}</h2>
            <span className="section-count">{ideas.length}</span>
          </header>

          {ideas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">
                <FiZap size={44} />
              </div>
              <p>{isOwn ? 'You haven\'t shared any ideas yet. Start by creating one!' : `${displayName} hasn\'t shared any ideas yet.`}</p>
              {isOwn && (
                <button onClick={() => navigate('/create')} className="btn-primary">
                  <FiZap aria-hidden="true" />
                  <span>Create first idea</span>
                </button>
              )}
            </div>
          ) : (
            <div className="ideas-grid">
              {ideas.map(idea => (
                <article key={idea._id} className="idea-card" onClick={() => navigate(`/idea/${idea._id}`)}>
                  <h4>{idea.title}</h4>
                  <p className="post-description">{idea.description.substring(0, 90)}...</p>
                  <div className="idea-card-footer">
                    <span><FiThumbsUp aria-hidden="true" /> {idea.upvotes?.length || 0}</span>
                    <span><FiMessageSquare aria-hidden="true" /> {idea.comments?.length || 0}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
