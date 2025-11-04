const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// get current user profile
router.get('/profile/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('following', 'name')
      .populate('followers', 'name');
    if (!user) return res.status(404).json({ message: 'Not found' });
    
    // Get user's posts/ideas
    const ideas = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json({ ...user.toObject(), ideas });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// get profile by userId or 'me'
router.get('/profile/:id', async (req, res) => {
  try {
    let userId = req.params.id;
    
    // Handle 'me' endpoint with auth
    if (userId === 'me') {
      if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      const token = req.headers.authorization.split(' ')[1];
      const jwt = require('jsonwebtoken');
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
      userId = payload.id;
    }
    
    const user = await User.findById(userId)
      .select('-password')
      .populate('following', 'name')
      .populate('followers', 'name');
    if (!user) return res.status(404).json({ message: 'Not found' });
    
    // Get user's posts/ideas
    const ideas = await Post.find({ author: userId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    
    const userObj = user.toObject();
    res.json({ ...userObj, _id: user._id.toString(), ideas });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// get profile by ID (legacy)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('following', 'name')
      .populate('followers', 'name');
    if (!user) return res.status(404).json({ message: 'Not found' });
    
    // Get user's posts/ideas
    const ideas = await Post.find({ author: req.params.id }).sort({ createdAt: -1 });
    res.json({ ...user.toObject(), ideas });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// follow / unfollow
router.post('/:id/follow', auth, async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    const me = await User.findById(req.user._id);
    const isFollowing = me.following.some(id => id.toString() === target._id.toString());
    if (isFollowing) {
      me.following = me.following.filter(id => id.toString() !== target._id.toString());
      target.followers = target.followers.filter(id => id.toString() !== me._id.toString());
    } else {
      me.following.push(target._id);
      target.followers.push(me._id);
    }
    await me.save();
    await target.save();
    res.json({ me, target });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// unfollow endpoint
router.post('/:id/unfollow', auth, async (req, res) => {
  try {
    const target = await User.findById(req.params.id);
    if (!target) return res.status(404).json({ message: 'User not found' });
    const me = await User.findById(req.user._id);
    me.following = me.following.filter(id => id.toString() !== target._id.toString());
    target.followers = target.followers.filter(id => id.toString() !== me._id.toString());
    await me.save();
    await target.save();
    res.json({ me, target });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// update profile
router.post('/profile/update', auth, async (req, res) => {
  try {
    const { name, bio, department, batch } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, department, batch },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile: ' + err.message });
  }
});

// change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to change password' });
  }
});

// search users
router.get('/', async (req, res) => {
  try {
    const q = req.query.q || '';
    const users = await User.find({ name: new RegExp(q, 'i') }).limit(20).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;