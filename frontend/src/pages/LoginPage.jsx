import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/history'); // Redirect to history page after successful login
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login failed', err);
    }
  };

  return (
    <div className="container auth-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="analyze-button">Login</button>
        {error && <p className="error-box" style={{marginTop: '1rem'}}>{error}</p>}
      </form>
      <p style={{marginTop: '1rem'}}>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
}

export default LoginPage;