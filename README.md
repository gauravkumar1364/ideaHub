# ideaHub 💡

A full-stack MERN application for university students to share startup ideas and rate them collaboratively. Features live feed, user profiles, voting, comments, search, and follow functionality.

**Stack:** MongoDB · Express · React (Vite) · Node.js · Socket.io

---

## Features

✅ **User Authentication** — Register/login with JWT  
✅ **Create & Share Ideas** — Post startup ideas with title and description  
✅ **Voting System** — Upvote and downvote ideas (interactive UI)  
✅ **Comments** — Add comments to ideas (expandable per post)  
✅ **User Profiles** — View profiles, follow/unfollow users  
✅ **Search** — Find ideas by keyword or discover users  
✅ **Live Feed** — Real-time new posts via Socket.io  
✅ **Modern UI** — Clean, responsive design inspired by social media  
✅ **Live Variable Analysis Tool** — Analyze JavaScript code for live variables (Software Testing project)  

---

## Quick Setup (Windows PowerShell)

### Prerequisites
- **Node.js** 16+ (install from nodejs.org)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017`  
  (Or change `MONGO_URI` in `backend/.env`)

### 1. Clone/Extract Project
```powershell
cd "c:\Users\GAURAV\Desktop\Gaurav\New folder\ideaHub"
```

### 2. Backend Setup
```powershell
cd backend
npm install
# Start backend (port 5000)
node server.js
```

Expected output:
```
Connected to MongoDB
Server running on port 5000
```

### 3. Frontend Setup (new PowerShell tab)
```powershell
cd "c:\Users\GAURAV\Desktop\Gaurav\New folder\ideaHub\frontend"
npm install
# Start frontend dev server (port 5173)
npm run dev
```

Expected output:
```
➜  Local:   http://localhost:5173/
```

### 4. Open App
Click the link or open http://localhost:5173 in your browser.

### 5. Test It
- **Register** a user via the Login modal
- **Create an idea** in the feed
- **Vote** (👍/👎), **comment** (💬), or **share** (🔗)
- **Search users** in the navbar
- **Visit profiles** and **follow** other users

---

## Project Structure

```
ideaHub/
├── backend/
│   ├── server.js           # Express + Socket.io entry
│   ├── routes/
│   │   ├── auth.js         # register/login
│   │   ├── posts.js        # create, vote, comment, list
│   │   └── users.js        # profile, follow, search
│   ├── models/
│   │   ├── User.js         # User schema
│   │   └── Post.js         # Post with comments
│   ├── middleware/
│   │   └── auth.js         # JWT verification
│   ├── package.json
│   └── .env               # DB config
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Layout + Auth state
│   │   ├── pages/
│   │   │   ├── Feed.jsx    # Main feed with create, vote, comment
│   │   │   └── Profile.jsx # User profile + follow
│   │   ├── components/
│   │   │   ├── Navbar.jsx  # Header with search
│   │   │   └── Auth.jsx    # Login/Register modal
│   │   ├── styles.css      # Minimal modern styling
│   │   └── main.jsx        # React entry
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env                # API URL (optional)
├── README.md
└── .gitignore
```

---

## Environment Variables

### Backend (`backend/.env`)
```
MONGO_URI=mongodb://127.0.0.1:27017/ideahub
JWT_SECRET=dev_secret_key_change_in_production
PORT=5000
```

### Frontend (`frontend/.env` optional)
```
VITE_API=http://localhost:5000/api
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user

### Posts
- `GET /api/posts` — List all posts (supports `?q=search`)
- `GET /api/posts/:id` — Get single post
- `POST /api/posts` — Create post (auth required)
- `POST /api/posts/:id/vote` — Upvote/downvote (auth required)
- `POST /api/posts/:id/comment` — Add comment (auth required)

### Users
- `GET /api/users` — Search users (supports `?q=search`)
- `GET /api/users/:id` — Get user profile
- `POST /api/users/:id/follow` — Follow/unfollow user (auth required)

### Live Variable Analysis
- `POST /api/lva/analyze` — Analyze JavaScript code for live variables
- `GET /api/lva/examples` — Get example code snippets
- `GET /api/lva/example/:id` — Get specific example with analysis

---

## Troubleshooting

**"Cannot find module 'express'"**  
→ Run `npm install` in backend folder

**"MONGO_URI not set or connection refused"**  
→ Ensure MongoDB is running. Check `backend/.env`

**Frontend shows "Cannot POST /api/posts"**  
→ Backend not running. Start it in a separate terminal

**Port 5000 or 5173 already in use**  
→ Kill the process using that port or change PORT in `.env`

---

## Next Steps / Enhancements

- [ ] Pagination for posts and search results
- [ ] Image uploads for posts and profiles
- [ ] Notifications (new comments, follows)
- [ ] Rate limiting and input validation
- [ ] Email verification
- [ ] Admin dashboard
- [ ] Deployment (Vercel, Railway, Heroku)
- [ ] Test coverage (Jest, Supertest)
- [ ] Dark mode
- [ ] Analytics

---

## Tech Stack Details

| Layer | Tech | Why |
|-------|------|-----|
| **Frontend** | React 18, Vite | Fast HMR, modern build |
| **Styling** | Vanilla CSS | Minimal dependencies, clean design |
| **State** | React Hooks | Simple, local state management |
| **Backend** | Express 4 | Lightweight, proven |
| **Database** | MongoDB + Mongoose | Flexible schema, easy to scale |
| **Auth** | JWT + bcrypt | Stateless, secure passwords |
| **Real-time** | Socket.io | Live feed updates |
| **HTTP** | Axios | Simple promise-based requests |
| **Code Analysis** | Babel Parser | JavaScript AST parsing for LVA |

---

## Live Variable Analysis Tool

This project includes a complete **Live Variable Analysis (LVA)** tool for analyzing JavaScript code. Access it at `/lva` or click the Activity icon in the navigation bar.

**Key Features:**
- Parse JavaScript code using Babel
- Perform backward dataflow analysis
- Calculate GEN/KILL sets for each statement
- Visualize live variables at each program point
- Detect dead code (unused variable assignments)
- Interactive web interface with 10 example test cases

**Quick Access:**
- See [LVA_QUICKSTART.md](LVA_QUICKSTART.md) for usage guide
- See [LVA_DOCUMENTATION.md](LVA_DOCUMENTATION.md) for technical details
- See [EXISTING_TOOLS_GUIDE.md](EXISTING_TOOLS_GUIDE.md) for automated tools like ESLint, SonarQube, etc.

---

## License

MIT (use freely, attribution appreciated)

---

**Built by:** Your team  
**Updated:** November 2025

For feature requests or bugs, feel free to ask!