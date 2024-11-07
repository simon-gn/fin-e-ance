import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authAPI";
import styles from "./RegisterPage.module.css";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerUser({ name, email, password });

      if (response.status === 400) {
        setError(response.data.message);
      } else {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={`${styles.registerBox} card`}>
        <h2>Create Your Account</h2>
        <form className={styles.registerForm} onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit">Sign up</button>
        </form>
        <div className={styles.backToLoginPageLinkContainer}>
          <Link to="/" className={styles.backToLoginPageLink}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
