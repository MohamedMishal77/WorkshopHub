// src/Dashboard/Navigation.jsx
import React from "react";
import { Calendar, Plus, LogOut, Users, BookOpen } from "lucide-react";
import "../styles/Navigation.css";

const Navigation = ({ currentSection, onSectionChange, onLogout }) => {
  const navItems = [
    { id: "all-events", label: "Dashboard", icon: Calendar },
    { id: "my-events", label: "My Events", icon: BookOpen },
    { id: "my-hosted-events", label: "My Hosted Events", icon: Users },
  ];

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-left">
          <div className="nav-logo">
            <BookOpen className="nav-logo-icon" />
            <span className="nav-logo-text">WorkshopHub</span>
          </div>

          <div className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`nav-link ${currentSection === item.id ? "active" : ""}`}
                >
                  <Icon className="nav-link-icon" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="nav-actions">
          <button
            onClick={() => onSectionChange("host-event")}
            className="host-btn"
          >
            <Plus className="nav-action-icon" />
            <span>Host Event</span>
          </button>

          <button onClick={onLogout} className="logout-btn">
            <LogOut className="nav-action-icon" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`mobile-link ${currentSection === item.id ? "active" : ""}`}
            >
              <Icon className="mobile-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
