require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const lvaRoutes = require('./routes/lva');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

// ✅ Allowed origins (update if frontend URL changes)
const allowedOrigins = [
  "https://idea-hub-swart.vercel.app",
  "http://localhost:3000"
];

// ✅ CORS for Express
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ CORS for Socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected', socket.id));
});

// ✅ Make Socket.io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lva', lvaRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const db = process.env.MONGO_URI;
    if (!db) {
      throw new Error("❌ Missing MONGO_URI in environment variables");
    }

    await mongoose.connect(db);
    console.log("✅ Connected to MongoDB");

    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

  } catch (err) {
    console.error("❌ Failed to start server\n", err);
    process.exit(1);
  }
}

start();
