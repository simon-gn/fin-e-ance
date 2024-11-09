import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authAPI";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });

      if (response.status === 400) {
        setError(response.data.message);
      } else {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.heroSection}>
        <h1>fin(e)ance.</h1>
        <p>Track your financial transactions with ease.</p>
      </div>

      <div className={`${styles.loginBox} card`}>
        <h2>Login to Your Account</h2>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p className={styles.signupText}>
          Don&apos;t have an account?{" "}
          <Link to="/register" className={styles.signupLink}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
