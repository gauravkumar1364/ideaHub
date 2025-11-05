import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import {
  FiTrendingUp,
  FiStar,
  FiUsers,
  FiChevronUp,
  FiChevronDown,
  FiMessageSquare,
  FiArrowRight,
  FiZap
} from 'react-icons/fi';

export default function Feed() {
  const { user } = useOutletContext() || {};
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('top');

  useEffect(() => {
    fetchFeed();
  }, [activeTab]);

  const formatDate = (value) => {
    try {
      return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value));
    } catch {
      return '';
    }
  };

  const fetchFeed = async () => {
    try {
      setLoading(true);
      let response;

      if (activeTab === 'following') {
        const token = localStorage.getItem('token');
        if (!user || !token) {
          setPosts([]);
          setLoading(false);
          return;
        }
        response = await axios.get('http://localhost:5000/api/posts/feed/following', {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        const sortMap = { top: 'trending', new: 'latest' };
        const sortParam = sortMap[activeTab] || 'latest';
        response = await axios.get(`http://localhost:5000/api/posts?sort=${sortParam}`);
      }
      setPosts(response?.data || []);
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
        <div className="feed-main">
          <div className="feed-header-pro">
            <h1>Feed</h1>
            <p className="feed-subtitle">Browse the latest ideas from the community. Vote, comment, and keep the good ones rising.</p>
            <button className="btn-post-pro" onClick={handlePostIdea}>
              + Post Idea
            </button>
          </div>

          <div className="tabs-professional">
            <button
              className={`tab-item ${activeTab === 'top' ? 'active' : ''}`}
              onClick={() => setActiveTab('top')}
            >
              <FiTrendingUp aria-hidden="true" />
              <span>Top</span>
            </button>
            <button
              className={`tab-item ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              <FiStar aria-hidden="true" />
              <span>New</span>
            </button>
            <button
              className={`tab-item ${activeTab === 'following' ? 'active' : ''}`}
              onClick={() => setActiveTab('following')}
            >
              <FiUsers aria-hidden="true" />
              <span>Following</span>
            </button>
          </div>

          {loading ? (
            <div className="empty-state loading-state">Loading ideas...</div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" aria-hidden="true">
                <FiZap size={48} />
              </div>
              <h2>No ideas yet</h2>
              <p>Be the first to share an idea!</p>
              <button className="btn-post-pro" onClick={handlePostIdea}>
                Share Your Idea
              </button>
            </div>
          ) : (
            <div className="posts-container">
              {posts.map((post) => (
                <article key={post._id} className="post-card-pro">
                  <div className="vote-stack">
                    <button
                      className={`vote-button up ${post.upvotes?.some(v => v._id === user?._id) ? 'active' : ''}`}
                      onClick={() => handleVote(post._id, 'upvote')}
                      aria-label="Upvote idea"
                    >
                      <FiChevronUp aria-hidden="true" />
                    </button>
                    <span className="vote-score">{(post.upvotes?.length || 0) - (post.downvotes?.length || 0)}</span>
                    <button
                      className={`vote-button down ${post.downvotes?.some(v => v._id === user?._id) ? 'active' : ''}`}
                      onClick={() => handleVote(post._id, 'downvote')}
                      aria-label="Downvote idea"
                    >
                      <FiChevronDown aria-hidden="true" />
                    </button>
                  </div>
                  <div
                    className="post-content"
                    onClick={() => navigate(`/idea/${post._id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if(event.key === 'Enter' || event.key === ' '){
                        event.preventDefault()
                        navigate(`/idea/${post._id}`)
                      }
                    }}
                  >
                    <div className="post-header">
                      <h3>{post.title}</h3>
                      <span className="category-badge">{post.category || 'General'}</span>
                    </div>
                    <div className="post-metadata">
                      <span className="post-author" onClick={(event) => {
                        event.stopPropagation();
                        if(post.author?._id){
                          navigate(`/profile/${post.author._id}`)
                        }
                      }}>
                        {post.author?.name || post.author?.username || 'Anonymous'}
                      </span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span>{post.views ? `${post.views} views` : 'Brand new'}</span>
                    </div>
                    <p className="post-description">{post.description}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="post-tags" onClick={(event) => event.stopPropagation()}>
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                    <div className="post-footer" onClick={(event) => event.stopPropagation()}>
                      <button
                        className="action-btn ghost"
                        onClick={() => navigate(`/idea/${post._id}`)}
                      >
                        <FiMessageSquare aria-hidden="true" />
                        <span>{post.comments?.length || 0} comments</span>
                      </button>
                      <button
                        className="action-btn outline"
                        onClick={() => navigate(`/idea/${post._id}`)}
                      >
                        <span>Open idea</span>
                        <FiArrowRight aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

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
