import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

function AdminPanel({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'Administrator' && user.role !== 'Editor')) {
      navigate('/');
      return;
    }
    fetchAllPosts();
  }, [user, navigate]);

  const fetchAllPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'Administrator' && user.role !== 'Editor')) {
    return null;
  }

  if (loading) {
    return <div className="loading-container">Loading admin panel...</div>;
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <p>Manage your blog posts and content</p>
      </header>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Posts</h3>
          <p className="stat-number">{posts.length}</p>
        </div>
        <div className="stat-card">
          <h3>Published</h3>
          <p className="stat-number">
            {posts.filter(p => p.published).length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Drafts</h3>
          <p className="stat-number">
            {posts.filter(p => !p.published).length}
          </p>
        </div>
      </div>

      {user.role === 'Administrator' && (
        <div className="admin-notice">
          <p>👑 Administrator Access: You can manage all posts and users</p>
        </div>
      )}

      {user.role === 'Editor' && (
        <div className="editor-notice">
          <p>✏️ Editor Access: You can create and edit blog posts</p>
        </div>
      )}

      <div className="posts-table-container">
        <h2>All Blog Posts</h2>
        <table className="posts-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Created</th>
              <th>Modified</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No posts found</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.contentItemId}>
                  <td className="post-title">{post.displayText}</td>
                  <td>{post.author || 'Unknown'}</td>
                  <td>
                    <span className={`status-badge ${post.published ? 'published' : 'draft'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(post.createdUtc).toLocaleDateString('sv-SE')}</td>
                  <td>{new Date(post.modifiedUtc).toLocaleDateString('sv-SE')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="orchard-link">
        <p>
          To create and manage content, go to{' '}
          <a href="http://localhost:5000/admin" target="_blank" rel="noopener noreferrer">
            Orchard Core Admin
          </a>
        </p>
      </div>
    </div>
  );
}

export default AdminPanel;
