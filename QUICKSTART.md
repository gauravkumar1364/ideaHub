# QUICK START for Windows PowerShell

## ⚡ Run in 2 Steps

### Step 1: Terminal A (Backend)
```powershell
cd "c:\Users\GAURAV\Desktop\Gaurav\New folder\ideaHub\backend"
node server.js
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

### Step 2: Terminal B (Frontend)  
```powershell
cd "c:\Users\GAURAV\Desktop\Gaurav\New folder\ideaHub\frontend"
npm run dev
```

You should see:
```
➜  Local:   http://localhost:5173/
```

### Step 3: Open Browser
Click http://localhost:5173 or paste in your browser.

---

## 🧪 Test the App

1. **Register** — Click "Login" → "Sign Up" → enter name, email, password
2. **Create an Idea** — Type title & description → "Post Idea"
3. **Interact** — Click 👍👎💬🔗 on any post
4. **Search Users** — Use navbar search to find other users
5. **Visit Profiles** — Click user names to see their profiles
6. **Follow** — Click "Follow" button on profiles

---

## ⚠️ Prerequisites

- **MongoDB** must be running locally
  - If you don't have it, download from https://www.mongodb.com/try/download/community
  - Or use MongoDB Atlas (cloud): Update `backend/.env` `MONGO_URI` to your cloud connection

- **Node.js 16+** installed
  - Check: `node --version`

---

## 🆘 Stuck?

| Problem | Solution |
|---------|----------|
| "Cannot POST /api/posts" | Backend not running. Check Terminal A |
| "Cannot find module 'express'" | Run `npm install` in backend folder |
| "Connection refused at 127.0.0.1:27017" | MongoDB not running. Start MongoDB service |
| Port 5000 already in use | Change PORT in `backend/.env` |
| Port 5173 already in use | Vite will auto-pick next port (5174, 5175...) |

---

## 📁 Files You Need to Know

- `backend/.env` — Database URL & secret key
- `backend/server.js` — Express entry point
- `frontend/src/pages/Feed.jsx` — Main feed page
- `frontend/src/components/Auth.jsx` — Login/Register modal

---

## 🎯 What Works Now

✅ Register & login  
✅ Create posts  
✅ Vote (up/down)  
✅ Comments  
✅ User profiles  
✅ Follow users  
✅ Search ideas & users  
✅ Live feed updates  
✅ Modern minimal UI  

---

**Next: Read README.md for full documentation**
