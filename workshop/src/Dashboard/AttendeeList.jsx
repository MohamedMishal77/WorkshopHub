import React from "react";
import { User, Mail, Calendar, X, Loader2 } from "lucide-react";
import "../Styles/AttendeeList.css";

const AttendeeList = ({ registrations, eventTitle, onClose, loading }) => {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    if (!status) return null;

    let className = "status-badge ";
    if (status === "registered") className += "registered";
    if (status === "attended") className += "attended";
    if (status === "cancelled") className += "cancelled";

    return (
      <span className={className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="attendee-overlay">
      <div className="attendee-modal">
        {/* Header */}
        <div className="attendee-header">
          <div>
            <h2>Event Registrations</h2>
            <p>{eventTitle}</p>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="attendee-content">
          {loading ? (
            <div className="attendee-loading">
              <Loader2 className="spin" size={32} />
              <p>Loading registrations…</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="attendee-empty">
              <User size={48} className="empty-icon" />
              <h3>No registrations yet</h3>
              <p>Attendees will appear here once they register for your event.</p>
            </div>
          ) : (
            <div>
              <h3 className="attendee-count">
                {registrations.length} Registered Attendee
                {registrations.length !== 1 ? "s" : ""}
              </h3>

              {registrations.map((registration) => (
                <div key={registration.id} className="attendee-card">
                  <div className="attendee-card-header">
                    <User size={18} />
                    <span className="attendee-name">{registration.name}</span>
                    {getStatusBadge(registration.status)}
                  </div>

                  <div className="attendee-info">
                    <Mail size={14} />
                    <span>{registration.email}</span>
                  </div>

                  <div className="attendee-info">
                    <Calendar size={14} />
                    <span>
                      Registered on{" "}
                      {formatDate(
                        registration.registered_at || registration.registeredAt
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendeeList;
