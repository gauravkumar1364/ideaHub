import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
import { API, API_URL } from '../utils/api'
import {
  FiBell,
  FiBellOff,
  FiUserPlus,
  FiThumbsUp,
  FiThumbsDown,
  FiMessageSquare,
  FiCornerDownRight,
  FiVolume2
} from 'react-icons/fi'

export default function Notifications(){
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if(!stored){
      navigate('/login')
      return
    }

    fetchNotifications()

  const socket = io(API_URL)
    socket.on('new-notification', (notif) => {
      setNotifications(prev => [notif, ...prev])
    })
    return () => socket.disconnect()
  }, [])

  async function fetchNotifications(){
    try{
      const token = localStorage.getItem('token')
      const res = await axios.get(API + '/users/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotifications(res.data || [])
    }catch(e){
      console.error('Failed to fetch notifications')
    }finally{
      setLoading(false)
    }
  }

  function getNotificationIcon(type){
    const icons = {
      follow: FiUserPlus,
      upvote: FiThumbsUp,
      downvote: FiThumbsDown,
      comment: FiMessageSquare,
      reply: FiCornerDownRight,
      system: FiVolume2
    }
    const Icon = icons[type] || FiBell
    return <Icon aria-hidden="true" />
  }

  function getNotificationMessage(notif){
    const actorName = notif.actor?.name || notif.actor?.username || 'Someone'
    switch(notif.type){
      case 'follow':
        return `${actorName} followed you`
      case 'upvote':
        return `${actorName} upvoted your idea: "${notif.postTitle || 'Untitled'}"`
      case 'downvote':
        return `${actorName} downvoted your idea`
      case 'comment':
        return `${actorName} commented on your idea: "${notif.postTitle || 'Untitled'}"`
      case 'reply':
        return `${actorName} replied to your comment`
      case 'system':
        return notif.message || 'System notification'
      default:
        return notif.message || 'New notification'
    }
  }

  return (
    <div className="notifications-page">
      <div className="page-shell notifications-shell">
        <header className="page-header">
          <div>
            <h1>Notifications</h1>
            <p className="page-subtitle">Stay on top of the activity happening around your ideas.</p>
          </div>
          {notifications.length > 0 && (
            <button onClick={fetchNotifications} className="btn-secondary">
              Refresh
            </button>
          )}
        </header>

        {loading ? (
          <div className="loading-state">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">
              <FiBellOff size={48} />
            </div>
            <h3>All quiet for now</h3>
            <p>Share ideas and engage with others to see activity here.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notif, i) => (
              <div 
                key={i} 
                className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                onClick={() => {
                  if(notif.postId) navigate(`/idea/${notif.postId}`)
                  else if(notif.actor?._id) navigate(`/profile/${notif.actor._id}`)
                }}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="notification-content">
                  <p className="notification-message">
                    {getNotificationMessage(notif)}
                  </p>
                  <span className="notification-time">
                    {new Date(notif.createdAt).toLocaleDateString()} · {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {!notif.read && <div className="unread-indicator"></div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
