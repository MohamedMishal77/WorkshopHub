// src/Pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import "../Styles/auth.css";
import apiFetch from "../api/apiFetch";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setSuccess("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* ===== Header ===== */}
      <header className="auth-header">
        <div
          className="auth-header-logo"
          onClick={() => navigate("/")}
        >
          <div className="auth-logo-icon">
            <BookOpen size={20} color="white" />
          </div>
          <span className="auth-logo-text">WorkshopHub</span>
        </div>
        <button
          className="auth-btn auth-btn-gradient"
          onClick={() => navigate("/register")}
        >
          Sign Up
        </button>
      </header>

      {/* ===== Auth Card ===== */}
      <div className="auth-container">
        <div className="auth-card">
          <h2>Login</h2>

          {error && <p className="auth-error-message">{error}</p>}
          {success && <p className="auth-success-message">{success}</p>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <input
              type="email"
              id="login-email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="auth-input"
              autoComplete="email"
            />

            {/* Password Input */}
            <div className="auth-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="login-password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="auth-input"
                autoComplete="current-password"
              />
              <span
                className="auth-eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-message">
            Not a user? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
