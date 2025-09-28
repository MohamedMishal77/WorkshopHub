import { useState } from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../Styles/Header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="logo" onClick={() => navigate("/")}>
          <div className="logo-icon">
            <BookOpen size={20} color="white" />
          </div>
          <span className="logo-text">WorkshopHub</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#events">Events</a>
        </div>

        <div className="nav-auth">
          <button className="btn btn-ghost" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="btn btn-gradient"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </button>
        </div>

        <button className="menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <a href="#home" onClick={() => setIsMenuOpen(false)}>
            Home
          </a>
          <a href="#about" onClick={() => setIsMenuOpen(false)}>
            About
          </a>
          <a href="#events" onClick={() => setIsMenuOpen(false)}>
            Events
          </a>
        </div>
      )}
    </nav>
  );
};

export default Header;
