# 🚀 ideaHub Running - MongoDB Setup Required

## Current Status

✅ **Frontend Running:** http://localhost:5173  
✅ **Backend Running:** http://localhost:5000 (API)  
⏳ **Database:** Waiting for MongoDB connection

---

## 🔧 Fix It Now (Choose One)

### Option 1: MongoDB Atlas (Cloud - EASIEST)

Perfect for quick testing. Free tier includes 5GB.

**Steps:**
1. Open https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create a cluster (takes ~5-10 min)
4. Click "Connect" → "Drivers"
5. Copy connection string
6. Open `backend/.env` in your editor
7. Replace the `MONGO_URI` line with:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ideahub
   ```
8. Save file
9. **Restart backend server** (kill Terminal 1, run `node server.js` again)
10. Done! Try the app now.

**Time:** ~15 minutes (mostly waiting for cluster creation)

---

### Option 2: Local MongoDB (FASTEST if you have it)

**If MongoDB is installed:**

1. Open "Services" (Press `Win + R`, type `services.msc`)
2. Find "MongoDB Server" or similar
3. Right-click → "Start"
4. Wait ~10 seconds
5. **Restart backend** (kill Terminal 1, run `node server.js` again)
6. Done!

**If MongoDB not installed:**

Download from: https://www.mongodb.com/try/download/community

Select your Windows version and install. Then follow steps 1-6 above.

**Time:** ~5 minutes (if already installed)

---

### Option 3: Docker (IF YOU HAVE DOCKER)

1. Open PowerShell
2. Run:
   ```powershell
   docker run -d -p 27017:27017 --name ideahub-mongo mongo
   ```
3. Wait ~10 seconds for container to start
4. **Restart backend** (kill Terminal 1, run `node server.js` again)
5. Done!

**Time:** ~2 minutes

---

## 📱 Test the App

Once MongoDB is connected:

1. Open http://localhost:5173
2. Click "Login" button
3. Click "Sign Up"
4. Enter name, email, password
5. Click "Sign Up"
6. Post an idea
7. Vote, comment, search users
8. Everything should work! ✓

---

## ✅ How to Know It's Working

### Backend Connected:
- Terminal 1 shows: `Connected to MongoDB`
- No error messages

### Frontend Ready:
- http://localhost:5173 loads
- Page is interactive
- No red errors in browser console (F12)

### Full System:
- Can register users
- Can create posts
- Can see posts in feed
- Can vote and comment
- Voting shows in real-time

---

## 🆘 Still Not Working?

### If backend shows "Cannot connect to MongoDB"
- Verify MongoDB is actually running
- Check `backend/.env` MONGO_URI is correct
- Try localhost: `mongodb://127.0.0.1:27017/ideahub`

### If registration fails
- Backend running on port 5000?
- Check browser console (F12) for errors
- Check backend terminal for error messages

### If frontend shows blank page
- Check browser console (F12) for errors
- Is frontend on http://localhost:5173 ?
- Try hard refresh (Ctrl + Shift + R)

---

## 📞 Need Help?

Check the files in your ideaHub folder:
- `README.md` - Full setup guide
- `QUICKSTART.md` - Quick reference
- `FEATURES.md` - What the app does

---

## ⏭️ Once MongoDB is Connected

1. Kill both terminal servers (Ctrl + C)
2. Follow QUICKSTART.md to restart fresh
3. App will be fully functional!

---

**MongoDB setup is the only missing piece. Once done, everything works! 🎉**
