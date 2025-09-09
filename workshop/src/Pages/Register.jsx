// src/Pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import "../Styles/auth.css";
import apiFetch from "../api/apiFetch";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [loading, setLoading] = useState(false);

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const validatePassword = (password) => {
    const updated = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    setPasswordValidations(updated);

    if (Object.values(updated).every(Boolean)) {
      setShowOverlay(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          user_name: formData.user_name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
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
        <div className="auth-header-logo" onClick={() => navigate("/")}>
          <div className="auth-logo-icon">
            <BookOpen size={20} color="white" />
          </div>
          <span className="auth-logo-text">WorkshopHub</span>
        </div>
        <button
          className="auth-btn auth-btn-gradient"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </header>

      {/* ===== Auth Card ===== */}
      <div className="auth-container">
        <div className="auth-card">
          <h2>Create Account</h2>

          {error && <p className="auth-error-message">{error}</p>}
          {success && <p className="auth-success-message">{success}</p>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <input
              type="text"
              id="user_name"
              name="user_name"
              placeholder="Full Name"
              value={formData.user_name}
              onChange={handleChange}
              required
              className="auth-input"
              autoComplete="name"
            />

            {/* Email */}
            <input
              type="email"
              id="email"
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
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => {
                  handleChange(e);
                  validatePassword(e.target.value);
                }}
                required
                className="auth-input"
                autoComplete="new-password"
                onFocus={() => setShowOverlay(true)}
              />
              <span
                className="auth-eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>

              {showOverlay && (
                <div className="auth-password-overlay">
                  <p>Password must include:</p>
                  <ul>
                    <li className={passwordValidations.length ? "valid" : "invalid"}>
                      {passwordValidations.length ? "✅" : "❌"} At least 8 characters
                    </li>
                    <li className={passwordValidations.uppercase ? "valid" : "invalid"}>
                      {passwordValidations.uppercase ? "✅" : "❌"} One uppercase letter
                    </li>
                    <li className={passwordValidations.number ? "valid" : "invalid"}>
                      {passwordValidations.number ? "✅" : "❌"} One number
                    </li>
                    <li className={passwordValidations.special ? "valid" : "invalid"}>
                      {passwordValidations.special ? "✅" : "❌"} One special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="auth-password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="auth-input"
                autoComplete="new-password"
              />
              <span
                className="auth-eye-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="auth-message">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
