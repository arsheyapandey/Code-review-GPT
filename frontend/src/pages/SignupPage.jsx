import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/users/register', { email, password });
      navigate('/login'); // Redirect to login after successful signup
    } catch (err) {
      setError('User already exists or there was a server error.');
      console.error('Signup failed', err);
    }
  };

  return (
    <div className="container auth-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="analyze-button">Sign Up</button>
        {error && <p className="error-box" style={{marginTop: '1rem'}}>{error}</p>}
      </form>
      <p style={{marginTop: '1rem'}}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default SignupPage;
