// DEBUG: All requests
router.use((req, res, next) => {
  console.log(`[USERS ROUTE] ${req.method} ${req.path}`);
  next();
});

// DEBUG: Simple test endpoint
router.post('/test', (req, res) => {
  res.json({ message: 'test endpoint works' });
});

// Get user ID by username
router.get('/by-username/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('_id username name profilePicture');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by username:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get current user profile
router.get('/profile/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('following', 'name username profilePicture')
      .populate('followers', 'name username profilePicture');
    if (!user) return res.status(404).json({ message: 'Not found' });
    
    // Get user's posts/ideas
    const ideas = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json({ ...user.toObject(), ideas });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// notifications (current user)
router.get('/notifications', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('notifications')
      .populate({ path: 'notifications.relatedUser', select: 'name username profilePicture' })
      .populate({ path: 'notifications.relatedPost', select: 'title' });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const notifications = (user.notifications || [])
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((notif) => ({
        _id: notif._id,
        type: notif.type,
        message: notif.message,
        read: notif.read,
        createdAt: notif.createdAt,
        actor: notif.relatedUser
          ? {
              _id: notif.relatedUser._id,
              name: notif.relatedUser.name,
              username: notif.relatedUser.username,
              profilePicture: notif.relatedUser.profilePicture || null,
            }
          : null,
        postId: notif.relatedPost ? notif.relatedPost._id : null,
        postTitle: notif.relatedPost ? notif.relatedPost.title : null,
      }));

    res.json(notifications);
  } catch (err) {
    console.error('Notifications fetch error:', err);
    res.status(500).json({ message: 'Failed to load notifications' });
  }
});

// DEBUG: Test follow endpoint
router.post('/follow/:id', auth, async (req, res) => {
  console.log('Follow endpoint hit with ID:', req.params.id);
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
    console.error('Follow error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow by username (new endpoint that accepts username)
router.post('/follow-by-username/:username', auth, async (req, res) => {
  try {
    console.log('Follow by username endpoint hit:', req.params.username);
    
    // Find target user by username
    const target = await User.findOne({ username: req.params.username });
    if (!target) return res.status(404).json({ message: 'User not found' });
    
    // Get current user
    const me = await User.findById(req.user._id);
    if (!me) return res.status(404).json({ message: 'Current user not found' });
    
    // Check if already following
    const isFollowing = me.following.some(id => id.toString() === target._id.toString());
    
    if (isFollowing) {
      // Unfollow
      me.following = me.following.filter(id => id.toString() !== target._id.toString());
      target.followers = target.followers.filter(id => id.toString() !== me._id.toString());
    } else {
      // Follow
      me.following.push(target._id);
      target.followers.push(me._id);
    }
    
    await me.save();
    await target.save();
    
    res.json({ 
      success: true,
      action: isFollowing ? 'unfollowed' : 'followed',
      me, 
      target 
    });
  } catch (err) {
    console.error('Follow by username error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// unfollow endpoint
router.post('/unfollow/:id', auth, async (req, res) => {
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

// Unfollow by username (new endpoint that accepts username)
router.post('/unfollow-by-username/:username', auth, async (req, res) => {
  try {
    console.log('Unfollow by username endpoint hit:', req.params.username);
    
    // Find target user by username
    const target = await User.findOne({ username: req.params.username });
    if (!target) return res.status(404).json({ message: 'User not found' });
    
    // Get current user
    const me = await User.findById(req.user._id);
    if (!me) return res.status(404).json({ message: 'Current user not found' });
    
    // Remove from following/followers
    me.following = me.following.filter(id => id.toString() !== target._id.toString());
    target.followers = target.followers.filter(id => id.toString() !== me._id.toString());
    
    await me.save();
    await target.save();
    
    res.json({ 
      success: true,
      message: 'Unfollowed successfully',
      me, 
      target 
    });
  } catch (err) {
    console.error('Unfollow by username error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// update profile
router.post('/profile/update', auth, async (req, res) => {
  try {
    const { name, bio, department, batch, profilePicture } = req.body;
    const update = { name, bio, department, batch };
    if (typeof profilePicture !== 'undefined') {
      update.profilePicture = profilePicture || null;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      update,
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
    const regex = new RegExp(q, 'i');
    const users = await User.find({
      $or: [
        { name: regex },
        { username: regex }
      ]
    })
      .limit(20)
      .select('-password');
    res.json(users);
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
      .populate('following', 'name username profilePicture')
      .populate('followers', 'name username profilePicture');
    if (!user) return res.status(404).json({ message: 'Not found' });
    
    // Get user's posts/ideas
    const ideas = await Post.find({ author: userId })
      .populate('author', 'name username')
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
      .populate('following', 'name username profilePicture')
      .populate('followers', 'name username profilePicture');
    if (!user) return res.status(404).json({ message: 'Not found' });
    
    // Get user's posts/ideas
    const ideas = await Post.find({ author: req.params.id }).sort({ createdAt: -1 });
  res.json({ ...user.toObject(), ideas });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;