# ideaHub — User Flow & Walkthrough

## 🎬 App Flow Diagram

```
START
  ↓
┌─────────────────┐
│   Visit App     │ → http://localhost:5173
└─────────────────┘
        ↓
   [NAVBAR]
   - Brand (ideaHub link)
   - User Search
   - Login/User Menu
        ↓
  ┌─────────────────────┐
  │  NOT LOGGED IN?     │
  └─────────────────────┘
    ↙ (Click Login)      ↘ (Already have account?)
  [REGISTER]              [LOGIN]
   ↓                       ↓
  [CREATE USER]      [VERIFY CREDENTIALS]
   ↓                       ↓
  [GET JWT]           [GET JWT]
   ↓                       ↓
  └─────────────────────┬─────────────────────┘
                        ↓
              ┌─────────────────┐
              │  MAIN FEED PAGE │
              └─────────────────┘
                        ↓
      ┌─────────────────────────────────────┐
      │         [CREATE IDEA SECTION]       │
      │  - Input: Title                     │
      │  - Input: Description               │
      │  - Button: Post Idea                │
      └─────────────────────────────────────┘
                        ↓
      ┌─────────────────────────────────────┐
      │    [IDEA SEARCH SECTION]            │
      │  - Input: Search ideas...           │
      │  - Filters feed by keyword          │
      └─────────────────────────────────────┘
                        ↓
      ┌─────────────────────────────────────┐
      │     [LIVE FEED - POST CARDS]        │
      │  For each post:                     │
      │  ├─ Author name (link to profile)   │
      │  ├─ Date posted                     │
      │  ├─ Title (bold)                    │
      │  ├─ Description (text)              │
      │  ├─ Actions:                        │
      │  │  ├─ 👍 Upvote (+ count)         │
      │  │  ├─ 👎 Downvote (+ count)       │
      │  │  ├─ 💬 Comments (+ count)       │
      │  │  │   ↓ (click to expand)        │
      │  │  │   [Show all comments]        │
      │  │  │   [Comment input + Reply]    │
      │  │  └─ 🔗 Share (copy to clipboard)│
      │  └─ [Real-time updates]            │
      └─────────────────────────────────────┘
                        ↓
        ┌───────────────────────────┐
        │  SEARCH FOR USER (Navbar) │
        └───────────────────────────┘
                        ↓
      ┌─────────────────────────────────────┐
      │  [USER PROFILE PAGE] /profile/:id   │
      │  ├─ Avatar (emoji placeholder)      │
      │  ├─ Name                            │
      │  ├─ Bio                             │
      │  ├─ Followers: X                    │
      │  ├─ Following: Y                    │
      │  └─ [Follow/Unfollow Button]        │
      └─────────────────────────────────────┘
                        ↓
                    [LOGOUT]
                        ↓
                      END
```

---

## 🚶 Step-by-Step Walkthrough

### Step 1: Launch App
```
1. Backend running on port 5000 ✓
2. Frontend running on port 5173 ✓
3. Open http://localhost:5173 in browser
```

### Step 2: Register
```
1. Click "Login" button in navbar (top right)
2. Auth modal appears
3. Click "Sign Up" link
4. Enter:
   - Full name (e.g., "John Doe")
   - Email (e.g., "john@example.com")
   - Password (e.g., "password123")
5. Click "Sign Up" button
6. JWT token + user saved to localStorage
7. Modal closes, navbar shows: [John Doe] [Logout]
```

### Step 3: Create an Idea
```
1. You're on the Feed page
2. See "Share Your Idea 💡" section
3. Input title: "AI-powered Tutoring Platform"
4. Input description: "An adaptive learning app using ML..."
5. Click "Post Idea" button
6. Post appears at top of feed (real-time via Socket.io)
7. Your name shown as author
```

### Step 4: Interact with Posts
```
A. UPVOTE/DOWNVOTE
   1. Click 👍 to upvote (adds your ID to upvotes array)
   2. Count increases
   3. Button turns blue (active state)
   4. Click again to remove vote

B. COMMENT
   1. Click 💬 button
   2. Section expands showing:
      - All existing comments
      - Comment input box
   3. Type comment: "Great idea!"
   4. Click "Reply" button
   5. Comment added with your name and timestamp
   6. Click 💬 again to collapse

C. SHARE
   1. Click 🔗 button
   2. Post URL copied to clipboard
   3. Alert: "Link copied!"
   4. Share link in email, Slack, etc.
```

### Step 5: Search Ideas
```
1. See search box in feed: "Search ideas..."
2. Type keyword: "AI"
3. Feed auto-filters to show only posts containing "AI"
4. Clear search to see all posts again
```

### Step 6: Search & Follow Users
```
1. Click navbar search: "Find users..."
2. Type name: "Jane"
3. Dropdown shows matching users
4. Click user name → navigate to profile
5. See Jane's name, bio, followers/following
6. Click "Follow" button
7. Jane appears in your "Following" list
8. You appear in Jane's "Followers" list
```

### Step 7: View Your Profile
```
1. Click your name in navbar
2. Navigate to /profile/:yourId
3. See your profile info
4. (No Follow button on own profile)
```

### Step 8: Logout
```
1. Click "Logout" button in navbar
2. Token & user removed from localStorage
3. Navbar shows "Login" button again
4. Redirect to Feed (unauthenticated)
5. Cannot create posts, vote, or comment (alerts shown)
```

---

## 🎨 UI Components & States

### Navbar
```
[Logo]        [Search Users]        [Nav Links]
ideaHub       Find users... ✓        Feed
              ├─ User 1           [User Profile]
              ├─ User 2           [Logout]
              └─ User 3
```

### Auth Modal
```
┌─────────────────────────┐
│  X (close)              │
│  Login                  │
│  ┌─────────────────────┐│
│  │ Email input         ││
│  │ Password input      ││
│  │ [Login] button      ││
│  │ Don't have account? ││
│  │ Sign Up link        ││
│  └─────────────────────┘│
└─────────────────────────┘
```

### Feed Create Section
```
┌─────────────────────────────────────┐
│ Share Your Idea 💡                  │
│ ┌─────────────────────────────────┐ │
│ │ Title of your idea... (text)    │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Describe your startup idea...   │ │
│ │ (textarea - 3 rows)             │ │
│ └─────────────────────────────────┘ │
│ [Post Idea] button (blue)           │
│ Log in to post ideas (hint)         │
└─────────────────────────────────────┘
```

### Post Card
```
┌───────────────────────────────────────┐
│ John Doe · Nov 4, 2025                │
│ AI-powered Tutoring Platform          │
│ An adaptive learning app using ML...  │
│ ┌───────────────────────────────────┐ │
│ │ 👍 5   👎 0   💬 2   🔗 Share    │ │
│ └───────────────────────────────────┘ │
│ [Comments expanded]                   │
│ Jane: Great idea! This could help...  │
│ Mike: How will you monetize?          │
│ ┌───────────────────────────────────┐ │
│ │ Add a comment...  [Reply]         │ │
│ └───────────────────────────────────┘ │
└───────────────────────────────────────┘
```

### Profile Page
```
┌────────────────────────────────────┐
│  ┌──────────┐  John Doe            │
│  │    👤    │  Full-stack dev      │
│  │          │  12 followers        │
│  └──────────┘  8 following         │
│               [Follow] or [Unfollow]│
└────────────────────────────────────┘
```

---

## 🔄 Data Flow Examples

### Creating a Post

```
Frontend (Feed.jsx)
  ↓
[Post Idea] clicked
  ↓
axios.post('/api/posts', { title, desc })
  ↓
Backend (routes/posts.js)
  ↓
Create document in MongoDB
  ↓
io.emit('new-post', post)  [Socket.io broadcast]
  ↓
All connected clients receive 'new-post' event
  ↓
Frontend (Feed.jsx listens)
  ↓
setPosts([newPost, ...oldPosts])  [Add to top]
  ↓
Feed re-renders, new post visible instantly
```

### Voting on a Post

```
Frontend (Feed.jsx)
  ↓
[👍] button clicked
  ↓
axios.post('/api/posts/:id/vote', { type: 'up' })
  ↓
Backend (routes/posts.js)
  ↓
Remove user from both upvotes & downvotes arrays
Add user to upvotes array
Save to MongoDB
Return updated post
  ↓
Frontend receives updated post
  ↓
setPosts(prev => prev.map(p => p._id === postId ? updated : p))
  ↓
Post card re-renders
Button turns blue, count increases
```

### Following a User

```
Frontend (Profile.jsx)
  ↓
[Follow] button clicked
  ↓
axios.post('/api/users/:userId/follow')
  ↓
Backend (routes/users.js)
  ↓
Add current user to target's followers
Add target to current user's following
Save both to MongoDB
  ↓
Frontend receives response
  ↓
setIsFollowing(!isFollowing)
fetchUser() [refresh profile]
  ↓
Button changes to [Unfollow]
Stats update
```

---

## 💾 Data Stored in localStorage

```
localStorage = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "507f1f77bcf86cd799439011",
    name: "John Doe",
    email: "john@example.com"
  }
}
```

---

## 🔐 Authentication Flow

```
1. User registers with email + password
   ↓
2. Backend hashes password with bcrypt
   ↓
3. Create User document in MongoDB
   ↓
4. Sign JWT token with user.id
   ↓
5. Send token to frontend
   ↓
6. Frontend stores token in localStorage
   ↓
7. For protected routes:
   - Include token in Authorization header
   - Backend middleware verifies token
   - Attach user to request object
   - Allow access if valid
```

---

## 🌐 Real-time Communication

```
Socket.io Connection
├─ Client connects to server
├─ Server registers connection
├─ Post created
│  ├─ Backend emits 'new-post' event
│  ├─ All connected clients listen
│  └─ Clients update feed instantly
└─ Client disconnects → server logs event
```

---

## ✅ Full Feature Checklist

- [x] Register new user
- [x] Login to account
- [x] Logout
- [x] Create post
- [x] View feed
- [x] Search ideas
- [x] Upvote posts
- [x] Downvote posts
- [x] Add comments
- [x] View comments
- [x] Search users
- [x] View user profile
- [x] Follow user
- [x] Unfollow user
- [x] Share post link
- [x] Real-time feed updates
- [x] Modern minimal UI
- [x] Engaging UX

---

**Total Time to Run:** ~5 minutes (after setup)  
**Features Implemented:** 16+  
**Files Created:** 20+  
**Lines of Code:** ~1,000+ (frontend + backend)
