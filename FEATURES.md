# ideaHub — Features & Implementation Summary

## 🎯 Delivered Features

### 1. **User Authentication** ✅
- Registration with name, email, password
- Login with JWT token
- Password hashing with bcrypt
- Token stored in localStorage
- Logout functionality
- **Files:** `backend/routes/auth.js`, `frontend/components/Auth.jsx`

### 2. **Post Ideas (Create & Share)** ✅
- Title and description fields
- Author tracking
- Timestamps
- Search by keyword
- **Files:** `backend/models/Post.js`, `backend/routes/posts.js`, `frontend/pages/Feed.jsx`

### 3. **Voting System** ✅
- Upvote (👍) button with count
- Downvote (👎) button with count
- Toggle voting (add/remove votes)
- Active state UI (blue highlight when voted)
- User-specific voting state
- **Files:** `backend/routes/posts.js` (vote endpoint), `frontend/pages/Feed.jsx`

### 4. **Comments** ✅
- Add comments to posts
- Author and timestamp tracking
- Expandable comment section per post
- Display all comments in a scrollable list
- Reply input with "Reply" button
- **Files:** `backend/models/Post.js`, `backend/routes/posts.js`, `frontend/pages/Feed.jsx`

### 5. **User Profiles** ✅
- View user bio and name
- Follower/following counts
- Profile avatar placeholder
- User profile page at `/profile/:id`
- **Files:** `backend/models/User.js`, `backend/routes/users.js`, `frontend/pages/Profile.jsx`

### 6. **Follow System** ✅
- Follow/unfollow users
- Followers and following lists
- Follow button on profile
- Toggle follow state
- **Files:** `backend/routes/users.js`, `frontend/pages/Profile.jsx`

### 7. **User Search** ✅
- Search users by name in navbar
- Real-time dropdown results
- Click to navigate to profile
- **Files:** `backend/routes/users.js`, `frontend/components/Navbar.jsx`

### 8. **Idea Search** ✅
- Search ideas by keyword
- Filter feed based on search query
- Search box in feed
- **Files:** `backend/routes/posts.js`, `frontend/pages/Feed.jsx`

### 9. **Share Button** ✅
- Copy post link to clipboard
- Visual feedback (alert)
- Icon: 🔗
- **Files:** `frontend/pages/Feed.jsx`

### 10. **Live Feed** ✅
- Real-time updates via Socket.io
- New posts appear at top immediately
- Broadcast to all connected clients
- **Files:** `backend/server.js`, `frontend/pages/Feed.jsx`

### 11. **Modern Minimal UI** ✅
- Clean card-based design
- Navbar with branding and search
- Responsive layout (works on mobile)
- Hover effects
- Color scheme: Blue (#007bff) accents on white/gray
- Icons: Emojis for actions (👍👎💬🔗💡👤)
- Modal for auth
- **Files:** `frontend/src/styles.css`

### 12. **Engaging UX** ✅
- Smooth animations (modals, hover effects)
- Disabled states for buttons
- Visual feedback on interactions
- Loading states
- Error messages
- Input validation
- **Files:** All frontend components + styles.css

---

## 📊 Technical Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Frontend Framework** | React | 18.2.0 |
| **Build Tool** | Vite | 5.3.0 |
| **Routing** | React Router | 6.14.1 |
| **HTTP Client** | Axios | 1.4.0 |
| **Real-time** | Socket.io Client | 4.7.2 |
| **Styling** | Vanilla CSS | - |
| **Backend Framework** | Express | 4.18.2 |
| **Database** | MongoDB | (via Mongoose) |
| **ODM** | Mongoose | 7.5.0 |
| **Authentication** | JWT + bcrypt | 9.0.0, 5.1.0 |
| **Real-time Server** | Socket.io | 4.7.2 |
| **CORS** | cors | 2.8.5 |
| **Runtime** | Node.js | 16+ |

---

## 🗂️ Project Structure

```
ideaHub/
├── backend/
│   ├── server.js                   # Express + Socket.io server
│   ├── package.json                # Dependencies
│   ├── .env                        # Config (MONGO_URI, JWT_SECRET)
│   ├── .env.example
│   ├── routes/
│   │   ├── auth.js                 # register, login
│   │   ├── posts.js                # CRUD posts, vote, comment
│   │   └── users.js                # profile, follow, search
│   ├── models/
│   │   ├── User.js                 # User schema + followers/following
│   │   └── Post.js                 # Post schema + comments + votes
│   └── middleware/
│       └── auth.js                 # JWT verification
│
├── frontend/
│   ├── index.html                  # Entry HTML
│   ├── vite.config.js              # Vite config
│   ├── package.json                # Dependencies
│   ├── src/
│   │   ├── main.jsx                # React app entry
│   │   ├── App.jsx                 # Root layout + auth state
│   │   ├── styles.css              # All styling (minimal modern)
│   │   ├── pages/
│   │   │   ├── Feed.jsx            # Main feed + create + vote + comment
│   │   │   └── Profile.jsx         # User profile + follow
│   │   └── components/
│   │       ├── Navbar.jsx          # Header + user search
│   │       └── Auth.jsx            # Login/Register modal
│   └── dist/                       # Build output
│
├── README.md                       # Full documentation
├── QUICKSTART.md                   # Quick start guide
└── .gitignore
```

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register
  Body: { name, email, password }
  Returns: { token, user }

POST /api/auth/login
  Body: { email, password }
  Returns: { token, user }
```

### Posts
```
GET /api/posts?q=keyword
  Returns: [{ _id, title, description, author, upvotes, downvotes, comments, createdAt }]

GET /api/posts/:id
  Returns: { post details }

POST /api/posts
  Auth: Required (Bearer token)
  Body: { title, description }
  Returns: { created post }
  Emits: Socket event 'new-post' to all clients

POST /api/posts/:id/vote
  Auth: Required
  Body: { type: 'up' | 'down' }
  Returns: { updated post }

POST /api/posts/:id/comment
  Auth: Required
  Body: { text }
  Returns: { updated post with new comment }
```

### Users
```
GET /api/users?q=name
  Returns: [{ _id, name, email, bio, followers, following }]

GET /api/users/:id
  Returns: { user profile }

POST /api/users/:id/follow
  Auth: Required
  Returns: { me, target }
```

---

## 🚀 How to Run

### Quick Start (2 terminals)

**Terminal 1 — Backend:**
```powershell
cd backend
npm install  # (first time only)
node server.js
```

**Terminal 2 — Frontend:**
```powershell
cd frontend
npm install  # (first time only)
npm run dev
```

Open: http://localhost:5173

---

## ✨ Key Features Explained

### Live Feed
- Uses Socket.io to broadcast new posts in real-time
- New posts appear at top of feed without page refresh
- All connected clients see updates simultaneously

### Voting System
- Click 👍 to upvote or 👎 to downvote
- Click again to remove your vote
- Active vote shows in blue
- Vote counts update in real-time

### Comments
- Click 💬 button to expand/collapse comment section
- View all previous comments
- Add new comment in input box
- Comments have author name and timestamp

### Follow System
- Visit any user's profile
- Click "Follow" button
- User appears in your "Following" list
- Their profile shows you in "Followers"

### Search
- **Users:** Use navbar search to find people
- **Ideas:** Use feed search box to find posts by keyword

---

## 🛠️ Configuration

### Database
Set `MONGO_URI` in `backend/.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/ideahub
```

Or use MongoDB Atlas (cloud):
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ideahub
```

### JWT Secret
Change in production (in `backend/.env`):
```
JWT_SECRET=your-secure-random-string-here
```

---

## 📝 Future Enhancements

- **Pagination** — Load posts in batches, older posts via "Load More"
- **Image Uploads** — Add images to posts and profiles
- **Notifications** — Alert users of new comments, follows
- **Input Validation** — Enhanced field validation on backend
- **Rate Limiting** — Prevent spam (express-rate-limit)
- **Admin Panel** — Moderate posts, user management
- **Email** — Send verification emails, password reset
- **Dark Mode** — Toggle dark/light theme
- **Deployment** — Deploy to Vercel (frontend) + Railway/Render (backend)
- **Tests** — Jest for unit tests, Supertest for API tests
- **CI/CD** — GitHub Actions for automated testing

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot connect to MongoDB" | MongoDB not running | Start MongoDB or update MONGO_URI |
| "Cannot POST /api/posts" | Backend not running | Start backend in Terminal 1 |
| "Cannot find module 'express'" | Dependencies not installed | Run `npm install` in backend |
| "Vite port conflict" | Port 5173 in use | Vite auto-picks next port (5174) |
| "Token invalid" | JWT_SECRET mismatch | Ensure .env is loaded, restart backend |
| Search not working | Missing index on title/description | Add text index in Post model (optional) |

---

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📄 License

MIT — Free to use and modify for personal/educational use

---

**Created:** November 2025  
**Updated:** November 4, 2025  
**Status:** ✅ Ready to Run Locally
