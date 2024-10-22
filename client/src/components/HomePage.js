import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>Welcome to the Personal Finance Dashboard</h1>
        <p>Track your financial transactions with ease.</p>
      </div>

      <div className="login-section">
        <h2>Login to Your Account</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password" />
          </div>
          {error && <p>{error}</p>}
          <button type="submit" className="btn-login">Login</button>
        </form>
        <p className="signup-text">
          Don't have an account? <Link to="/register" className="signup-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
