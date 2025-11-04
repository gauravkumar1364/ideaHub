import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'

const API = import.meta.env.VITE_API || 'http://localhost:5000/api'

export default function Notifications(){
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if(!stored) return navigate('/login')
    setUser(JSON.parse(stored))
    fetchNotifications()

    const socket = io(API.replace('/api', ''))
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
      'follow': '👥',
      'upvote': '👍',
      'downvote': '👎',
      'comment': '💬',
      'reply': '↩️',
      'system': '📢'
    }
    return icons[type] || '🔔'
  }

  function getNotificationMessage(notif){
    switch(notif.type){
      case 'follow':
        return `${notif.actor?.name} followed you`
      case 'upvote':
        return `${notif.actor?.name} upvoted your idea: "${notif.postTitle || 'Untitled'}"`
      case 'downvote':
        return `${notif.actor?.name} downvoted your idea`
      case 'comment':
        return `${notif.actor?.name} commented on your idea: "${notif.postTitle || 'Untitled'}"`
      case 'reply':
        return `${notif.actor?.name} replied to your comment`
      case 'system':
        return notif.message || 'System notification'
      default:
        return notif.message || 'New notification'
    }
  }

  return (
    <div className="notifications-page">
      <div style={{maxWidth: '700px', margin: '0 auto', padding: '20px'}}>
        <div className="notifications-header">
          <h1>🔔 Notifications</h1>
          {notifications.length > 0 && (
            <button onClick={fetchNotifications} style={{padding: '8px 16px', background: '#f0f0f0', border: 'none', borderRadius: '6px', cursor: 'pointer'}}>
              🔄 Refresh
            </button>
          )}
        </div>

        {loading ? (
          <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px', background: 'white', borderRadius: '8px', border: '1px solid #ddd'}}>
            <p style={{fontSize: '40px', marginBottom: '10px'}}>🌟</p>
            <p style={{color: '#999'}}>No notifications yet. Keep sharing to see activity!</p>
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
                  <small className="notification-time">
                    {new Date(notif.createdAt).toLocaleDateString()} · {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
                {!notif.read && <div className="unread-indicator"></div>}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .notifications-page {
          padding: 20px 0;
          background: #f8f9fa;
          minHeight: 100vh;
        }

        .notifications-header {
          display: flex;
          justifyContent: space-between;
          alignItems: center;
          marginBottom: 30px;
          paddingBottom: 20px;
          borderBottom: 2px solid #e0e0e0;
        }

        .notifications-list {
          display: flex;
          flexDirection: column;
          gap: 8px;
        }

        .notification-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: white;
          borderRadius: 8px;
          border: 1px solid #e0e0e0;
          cursor: pointer;
          transition: all 0.3s ease;
          align-items: flex-start;
          position: relative;
        }

        .notification-item:hover {
          background: #f9f9f9;
          boxShadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .notification-item.unread {
          background: #f0f7ff;
          borderColor: #b3d9ff;
        }

        .notification-icon {
          fontSize: 24px;
          flexShrink: 0;
          marginTop: 2px;
        }

        .notification-content {
          flex: 1;
          minWidth: 0;
        }

        .notification-message {
          margin: 0 0 6px 0;
          color: #333;
          lineHeight: 1.4;
          wordBreak: break-word;
        }

        .notification-time {
          color: #999;
          fontSize: 12px;
        }

        .unread-indicator {
          width: 10px;
          height: 10px;
          borderRadius: 50%;
          background: #007bff;
          flexShrink: 0;
          marginTop: 6px;
        }

        @media (maxWidth: 600px) {
          .notification-item {
            padding: 12px;
            gap: 10px;
          }

          .notification-icon {
            fontSize: 20px;
          }

          .notification-message {
            fontSize: 14px;
          }
        }
      `}</style>
    </div>
  )
}
