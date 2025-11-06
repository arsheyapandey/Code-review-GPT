import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">CodeReviewGPT 🤖</Link>
      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/analyze">Analyze</NavLink>
        <NavLink to="/visualizer">Visualizer</NavLink> {/* ADD THIS LINE */}
        
        {/* Conditional links based on authentication state */}
        {isAuthenticated ? (
          <>
            <NavLink to="/history">History</NavLink>
            <a onClick={logout} href="/login" style={{cursor: 'pointer'}}>Logout</a>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

