import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });

      if (response.status === 400) {
        setError(response.data.message);
      } else {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="homepage">
      <div className="hero-section">
        <h1>fin(e)ance.</h1>
        <p>Track your financial transactions with ease.</p>
      </div>

      <div className="login-box">
        <h1>Login to Your Account</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input 
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password" />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p className="signup-text">
          Don&apos;t have an account? <Link to="/register" className="signup-link">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
