import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';

export default function Feed() {
  const { user } = useOutletContext() || {};
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('top');

  useEffect(() => {
    fetchFeed();
  }, [activeTab]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const sortMap = { top: 'trending', new: 'latest', following: 'latest' };
      const response = await axios.get(`http://localhost:5000/api/posts?sort=${sortMap[activeTab]}`);
      setPosts(response.data || []);
    } catch (error) {
      console.error('Failed to fetch feed:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (ideaId, voteType) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const type = voteType === 'upvote' ? 'up' : 'down';
      await axios.post(`http://localhost:5000/api/posts/${ideaId}/vote`, { type });
      fetchFeed();
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  const handlePostIdea = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/create');
    }
  };

  const totalIdeas = posts.length;
  const activeToday = Math.ceil(posts.length * 0.3);

  return (
    <div className="feed-professional">
      <div className="feed-layout">
        {/* Main Feed */}
        <div className="feed-main">
          {/* Header */}
          <div className="feed-header-pro">
            <h1>Feed</h1>
            <button className="btn-post-pro" onClick={handlePostIdea}>
              + Post Idea
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs-professional">
            <button
              className={`tab-item ${activeTab === 'top' ? 'active' : ''}`}
              onClick={() => setActiveTab('top')}
            >
              📈 Top
            </button>
            <button
              className={`tab-item ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              ⭐ New
            </button>
            <button
              className={`tab-item ${activeTab === 'following' ? 'active' : ''}`}
              onClick={() => setActiveTab('following')}
            >
              👥 Following
            </button>
          </div>

          {/* Posts */}
          {loading ? (
            <div className="empty-state">
              <p>Loading ideas...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💡</div>
              <h2>No ideas yet</h2>
              <p>Be the first to share an idea!</p>
              <button className="btn-post-pro" onClick={handlePostIdea}>
                Share Your Idea
              </button>
            </div>
          ) : (
            <div className="posts-container">
              {posts.map((post) => (
                <div key={post._id} className="post-card-pro">
                  <div className="post-header">
                    <h3>{post.title}</h3>
                    <span className="category-badge">{post.category || 'General'}</span>
                  </div>
                  <p className="post-description">{post.description}</p>
                  <div className="post-metadata">
                    <span>by {post.author?.name || 'Anonymous'}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="post-tags">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="post-actions">
                    <button
                      className="action-btn"
                      onClick={() => handleVote(post._id, 'upvote')}
                    >
                      ↑ {post.upvotes?.length || 0}
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleVote(post._id, 'downvote')}
                    >
                      ↓ {post.downvotes?.length || 0}
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => navigate(`/idea/${post._id}`)}
                    >
                      💬 {post.comments?.length || 0}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="feed-sidebar">
          <div className="sidebar-card welcome-card">
            <h3>Welcome to ideaHub!</h3>
            <p>Share your ideas, upvote great concepts, and collaborate with the community.</p>
          </div>
          
          <div className="sidebar-card stats-card">
            <h3>Community Stats</h3>
            <div className="stat-row">
              <span>Total Ideas</span>
              <strong>{totalIdeas}</strong>
            </div>
            <div className="stat-row">
              <span>Active Today</span>
              <strong>{activeToday}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
