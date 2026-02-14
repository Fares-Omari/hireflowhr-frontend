import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login({ setIsAuthenticated, setUserRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // TEMPORARY: For testing UI without backend
    // Remove this block once backend auth is working
    if (email === 'admin@hireflow.com' && password === 'password') {
      const user = { email, role: 'ADMIN', name: 'Admin User' };
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setUserRole('ADMIN');
      navigate('/jobs');
      return;
    } else if (email === 'hr@hireflow.com' && password === 'password') {
      const user = { email, role: 'HR', name: 'HR User' };
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setUserRole('HR');
      navigate('/jobs');
      return;
    } else if (email === 'user@hireflow.com"' && password === 'password') {
      const user = { email, role: 'USER', name: 'Regular User' };
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setUserRole('USER');
      navigate('/jobs');
      return;
    }
    // END TEMPORARY
    
    // Call your backend login API
    fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
      .then(async (res) => {
        const text = await res.text();
        console.log('Response status:', res.status);
        console.log('Response body:', text);
        
        if (!res.ok) {
          throw new Error(`Login failed: ${res.status} - ${text}`);
        }
        
        // Try to parse as JSON if not empty
        return text ? JSON.parse(text) : {};
      })
      .then((data) => {
        console.log('Login successful, data:', data);
        
        // Assuming backend returns user data with role
        const user = {
          email: data.email || email,
          role: data.role || data.authority || 'USER',
          name: data.name || data.username || email
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        setIsAuthenticated(true);
        setUserRole(user.role);
        navigate('/jobs');
      })
      .catch((err) => {
        console.error('Login error:', err);
        alert(`Login failed: ${err.message}\n\nFor testing, use:\nadmin@hireflow.com / admin\nhr@hireflow.com / hr\nuser@hireflow.com / user`);
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
        <div className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
