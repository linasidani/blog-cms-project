import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/current', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">Blog CMS</Link>
            <ul className="nav-menu">
              <li><Link to="/">Home</Link></li>
              {user ? (
                <>
                  {(user.role === 'Administrator' || user.role === 'Editor') && (
                    <li><Link to="/admin">Admin Panel</Link></li>
                  )}
                  <li>
                    <span className="user-info">
                      {user.username} ({user.role})
                    </span>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="btn-logout">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li><Link to="/login">Login</Link></li>
              )}
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/admin" element={<AdminPanel user={user} />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>Blog CMS - Publiceringsverktyg och UX Projekt</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
