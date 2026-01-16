import { useState, useEffect } from 'react';
import './Home.css';

function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/content/blogpost', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container">Loading posts...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Blog CMS</h1>
        {user && (
          <p className="welcome-message">
            Hello, {user.username}! You are logged in as {user.role}.
          </p>
        )}
      </header>

      <div className="posts-grid">
        {posts.length === 0 ? (
          <p className="no-posts">No blog posts yet. Check back soon!</p>
        ) : (
          posts.map((post) => (
            <article key={post.contentItemId} className="post-card">
              <h2>{post.title}</h2>
              <div className="post-meta">
                <span className="post-author">
                  By {post.author || 'Unknown'}
                </span>
                <span className="post-date">
                  {new Date(post.publishedUtc || post.createdUtc).toLocaleDateString('sv-SE')}
                </span>
              </div>
              {post.body && (
                <div 
                  className="post-excerpt"
                  dangerouslySetInnerHTML={{ 
                    __html: post.body.substring(0, 200) + '...' 
                  }}
                />
              )}
              
              {/* Visa extra info för inloggade användare */}
              {user && (user.role === 'Administrator' || user.role === 'Editor') && (
                <div className="post-admin-info">
                  <span className="badge">
                    Status: {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              )}
            </article>
          ))
        )}
      </div>

      {/* Visa extra features baserat på roll */}
      {user && user.role === 'Administrator' && (
        <div className="admin-notice">
          <p>👑 As Administrator, you can see all posts including drafts.</p>
        </div>
      )}
      
      {user && user.role === 'Editor' && (
        <div className="editor-notice">
          <p>✏️ As Editor, you can see published posts and your drafts.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
