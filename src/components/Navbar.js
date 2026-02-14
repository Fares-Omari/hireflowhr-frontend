import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isAuthenticated, setIsAuthenticated, userRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
      .then(() => {
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        navigate('/login');
      })
      .catch(() => {
        // Logout anyway on error
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        navigate('/login');
      });
  };

  const canViewApplications = userRole === 'ADMIN' || userRole === 'HR';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        HireFlow
      </Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/jobs">Jobs</Link>
            {canViewApplications && <Link to="/applications">Applications</Link>}
            <span style={{ color: '#667eea', fontWeight: 'bold' }}>{userRole}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
