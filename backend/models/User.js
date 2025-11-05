const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const NotificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['follow', 'upvote', 'comment', 'reply', 'announcement'], default: 'announcement' },
  message: String,
  relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  name: { type: String, default: '' },
  email: { type: String, unique: true, sparse: true, trim: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  department: { type: String, default: '' },
  batch: { type: String, default: '' },
  profilePicture: { type: String, default: null },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notifications: [NotificationSchema],
  upvotedIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  privacy: {
    restrictDMs: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
