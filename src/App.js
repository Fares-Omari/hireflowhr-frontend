import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import Apply from './pages/Apply';
import Applications from './pages/Applications';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setIsAuthenticated(true);
      setUserRole(userData.role || 'USER');
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={setIsAuthenticated}
          userRole={userRole}
        />
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/jobs" /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/jobs" /> : 
              <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
              <Navigate to="/jobs" /> : 
              <Register setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
            } 
          />
          <Route 
            path="/jobs" 
            element={
              isAuthenticated ? 
              <Jobs userRole={userRole} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/apply" 
            element={
              isAuthenticated ? 
              <Apply /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/applications" 
            element={
              isAuthenticated ? 
              <Applications userRole={userRole} /> : 
              <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
