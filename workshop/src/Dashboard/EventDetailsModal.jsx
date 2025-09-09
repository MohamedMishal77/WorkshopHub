import React, { useState, useEffect } from "react";
import "../Styles/EventDetailsModal.css";
import apiFetch from "../api/apiFetch";

const EventDetailsModal = ({ event, onClose, onRegister, isRegistered: isRegisteredProp }) => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(isRegisteredProp);

  useEffect(() => {
    setIsRegistered(isRegisteredProp);
  }, [isRegisteredProp]);

  if (!event) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/api/registrations", {
        method: "POST",
        body: JSON.stringify({ ...formData, event_id: event.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setShowRegistration(false);
        setFormData({ name: "", email: "", phone: "" });
        setIsRegistered(true); // ✅ update button state immediately
        if (onRegister) onRegister(event.id);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error submitting registration:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* Success Overlay */}
        {success ? (
          <div className="modal-content registration-success-box">
            <p className="registration-success">
              ✅ Your registration is confirmed! You will receive further updates from the host.
            </p>
            <button className="modal-register" onClick={onClose}>
              Close
            </button>
          </div>
        ) : showRegistration ? (
          <div className="modal-content registration-form">
            <button
              className="modal-close"
              onClick={() => setShowRegistration(false)}
            >
              ✕
            </button>
            <h2>Register for {event.title}</h2>

            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Phone (+91)
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </label>

              {error && <p className="error-message">{error}</p>}

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Registering..." : "Submit"}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Event Details */}
            <div className="modal-image-wrapper">
              <img src={event.image} alt={event.title} className="modal-image" />
              <span className="modal-category">{event.category}</span>
            </div>

            <div className="modal-content">
              <h2 className="modal-title">{event.title}</h2>
              <p className="modal-instructor">Hosted by {event.instructor}</p>

              <div className="modal-info">
                <p>
                  <strong>Date:</strong> {event.date}
                </p>
                <p>
                  <strong>Time:</strong> {event.time}
                </p>
              </div>

              <p className="modal-description">
                {event.description ||
                  "Join this exciting workshop to gain insights and learn from industry experts."}
              </p>

              {/* ✅ Registration Button */}
              <button
                className={`modal-register ${isRegistered ? "disabled" : ""}`}
                onClick={() => {
                  if (!isRegistered) {
                    setShowRegistration(true);
                  }
                }}
                disabled={isRegistered}
              >
                {isRegistered ? "Registered" : "Register Now"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventDetailsModal;
