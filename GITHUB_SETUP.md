# ideaHub - Full Stack MERN Application

A modern, professional idea-sharing platform built with the MERN stack (MongoDB, Express, React, Node.js).

## 🎯 Features

### Core Features
- **User Authentication**: Secure sign up and login with JWT tokens
- **Create & Share Ideas**: Multi-step form for publishing ideas with categories and tags
- **Idea Feed**: View trending, latest, and personalized ideas
- **Engagement**: Upvote, downvote, and comment on ideas
- **User Profiles**: View user profiles with their ideas and followers
- **Following System**: Follow/unfollow users to customize your feed
- **Search**: Search for ideas and users
- **Notifications**: Real-time notifications for interactions
- **Settings**: Manage profile and account settings

### Professional UI
- Icon-based navigation navbar
- Professional minimal design (Instagram/LinkedIn/Reddit style)
- Responsive layout for desktop and mobile
- Smooth hover effects and transitions
- Clean color scheme with blue accents (#0095f6)
- Empty states with engaging CTAs

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing (8 pages)
- **Axios** - HTTP client
- **Socket.io-client** - Real-time features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Socket.io** - Real-time communication
- **Bcrypt** - Password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ideaHub.git
cd ideaHub
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
MONGO_URI=mongodb://127.0.0.1:27017/ideahub
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **Start the Application**

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
ideaHub/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx (Icon-based navigation)
│   │   │   └── Auth.jsx (Login/Register)
│   │   ├── pages/
│   │   │   ├── Feed.jsx (Main feed with professional layout)
│   │   │   ├── Idea.jsx (Idea detail view)
│   │   │   ├── CreateIdea.jsx (Multi-step idea creation)
│   │   │   ├── Profile.jsx (User profile)
│   │   │   ├── Explore.jsx (Discover ideas)
│   │   │   ├── Notifications.jsx
│   │   │   ├── FollowingFeed.jsx
│   │   │   └── Settings.jsx
│   │   ├── styles.css (Professional minimal styling)
│   │   ├── App.jsx (Main app component)
│   │   ├── main.jsx (Entry point)
│   │   └── vite.config.js
│   ├── package.json
│   └── index.html
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js (JWT authentication)
│   ├── server.js (Main server)
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Ideas (Posts)
- `GET /api/posts` - Get all ideas with filtering
- `POST /api/posts` - Create new idea (auth required)
- `GET /api/posts/:id` - Get idea details
- `POST /api/posts/:id/vote` - Vote on idea (auth required)
- `POST /api/posts/:id/comment` - Comment on idea (auth required)

### Users
- `GET /api/users/profile/:id` - Get user profile
- `POST /api/users/:id/follow` - Follow user (auth required)
- `POST /api/users/:id/unfollow` - Unfollow user (auth required)

## 🎨 UI Features

### Professional Navbar
- Logo with icon (💡 ideaHub)
- Integrated search bar with user results
- Icon-based navigation (🏠 Home, 🌍 Explore, 🔔 Notifications)
- User avatar dropdown menu with profile/settings
- Responsive design

### Feed Page
- Header with title and "+ Post Idea" CTA
- Tab navigation (📈 Top, ⭐ New, 👥 Following)
- Professional post cards with engagement metrics
- Sidebar with community stats
- Empty states with engaging messages

### Create Idea Form
- Multi-step form (4 steps)
- Auto-save draft functionality
- Tag support
- Category selection
- Problem statement, solution, target audience, impact fields

## 🔒 Security

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes on frontend
- Auth middleware on backend
- Secure headers and CORS configuration

## 📱 Responsive Design

- Desktop: Full layout with sidebar and expanded features
- Tablet: Optimized grid layout
- Mobile: Single column, touch-friendly icons, compact search

## 🌟 Performance

- Vite for fast development and builds
- Optimized bundle size (~300KB)
- Efficient database queries with Mongoose
- Real-time updates with Socket.io

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@ideahub.com or open an issue on GitHub.

---

Built with ❤️ by Gaurav
