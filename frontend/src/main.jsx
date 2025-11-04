import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Feed from './pages/Feed'
import Idea from './pages/Idea'
import CreateIdea from './pages/CreateIdea'
import Profile from './pages/Profile'
import Explore from './pages/Explore'
import Notifications from './pages/Notifications'
import FollowingFeed from './pages/FollowingFeed'
import Settings from './pages/Settings'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Feed />} />
          <Route path="idea/:id" element={<Idea />} />
          <Route path="create" element={<CreateIdea />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="explore" element={<Explore />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="following" element={<FollowingFeed />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
