const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const auth = require('../middleware/auth');

// create post
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, problemStatement, solutionOverview, targetAudience, impact, category, tags, imageUrl } = req.body;
    const post = await Post.create({ 
      title, 
      description,
      problemStatement,
      solutionOverview,
      targetAudience,
      impact,
      category,
      tags,
      imageUrl,
      author: req.user._id 
    });
    await post.populate('author', 'name');
    req.io.emit('new-post', post);
    res.json(post);
  } catch (err) {
    console.error('Post creation error:', err.message);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// list posts with filtering
router.get('/', async (req, res) => {
  try {
    const { q, sort = 'latest', category, limit = 20, skip = 0 } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (category && category !== 'All') filter.category = category;
    
    const sortOptions = {
      latest: { createdAt: -1 },
      trending: { ranking: -1, createdAt: -1 },
      'most-upvoted': { 'upvotes': -1 }
    };
    
    const posts = await Post.find(filter)
      .populate('author', 'name')
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'name bio department followers').populate('comments.author', 'name');
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// vote (up or down)
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { type } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    const userId = req.user._id;
    post.upvotes = post.upvotes.filter(u => u.toString() !== userId.toString());
    post.downvotes = post.downvotes.filter(u => u.toString() !== userId.toString());
    if (type === 'up') post.upvotes.push(userId);
    if (type === 'down') post.downvotes.push(userId);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    post.comments.push({ author: req.user._id, text: req.body.text });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// reply to comment
router.post('/:postId/comment/:commentId/reply', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Not found' });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    comment.replies.push({ author: req.user._id, text: req.body.text });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// get trending posts
router.get('/trending', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name')
      .sort({ ranking: -1 })
      .limit(10);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;