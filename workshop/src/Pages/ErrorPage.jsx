import React from "react";
import { Link } from "react-router-dom";
import "../Styles/error.css";
function ErrorPage() {
  return (
    <div className="error-container">
      <div className="error-card">
        <h1 className="error-title">404</h1>
        <p className="error-subtitle">Page Not Found</p>
        <p className="error-message">
          Oops! The page you are looking for does not exist.
        </p>
        <Link to="/" className="error-button">
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
