import React, { useState } from "react";
import { Users, Calendar, Clock, Eye } from "lucide-react";
import AttendeeList from "../AttendeeList";
import apiFetch from "../../api/apiFetch";
import "../sections/Styles/MyHostedEvents.css";

function MyHostedEvents({ events, registrations, currentUserId }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventRegistrations, setEventRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!currentUserId) {
    return (
      <div className="my-hosted-container">
        <div className="my-hosted-header">
          <h1 className="my-hosted-title">My Hosted Events</h1>
          <p className="my-hosted-subtitle">Resolving your account…</p>
        </div>
      </div>
    );
  }

  const hostedEvents = events.filter(
    (event) => String(event.hostId) === String(currentUserId)
  );

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const formatDuration = (minutes) => {
    const num = Number(minutes) || 0;
    const hours = Math.floor(num / 60);
    const mins = num % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  // ✅ Fetch registrations when "View Registrations" is clicked
  const handleViewRegistrations = async (event) => {
    try {
      setLoading(true);
      setSelectedEvent(event);

      const res = await apiFetch(`/api/registrations/event/${event.id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to load attendees");

      setEventRegistrations(data.registrations || []);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setEventRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="my-hosted-container">
        <div className="my-hosted-header">
          <h1 className="my-hosted-title">My Hosted Events</h1>
          <p className="my-hosted-subtitle">
            Events you're hosting and their registrations
          </p>
        </div>

        {hostedEvents.length > 0 ? (
          <div className="my-hosted-list">
            {hostedEvents.map((event) => {
              const isPastEvent = new Date(event.dateTime) < new Date();

              return (
                <div key={event.id} className="my-hosted-card">
                  <div className="my-hosted-card-body">
                    <div className="my-hosted-card-content">
                      <div className="my-hosted-card-main">
                        <div className="my-hosted-card-header">
                          <h3 className="my-hosted-card-title">{event.title}</h3>
                          {isPastEvent && (
                            <span className="my-hosted-event-closed">
                              Event Closed
                            </span>
                          )}
                        </div>

                        <div className="my-hosted-meta">
                          <div className="my-hosted-meta-item">
                            <Calendar className="my-hosted-meta-icon" />
                            <span>
                              {formatDate(event.dateTime)} at{" "}
                              {formatTime(event.dateTime)}
                            </span>
                          </div>

                          <div className="my-hosted-meta-item">
                            <Clock className="my-hosted-meta-icon" />
                            <span>{formatDuration(event.duration)}</span>
                          </div>

                          <div className="my-hosted-meta-item">
                            <Users className="my-hosted-meta-icon" />
                            <span>{event.registeredCount || 0} registered</span>
                          </div>
                        </div>

                        <p className="my-hosted-description">
                          {event.description}
                        </p>
                      </div>

                      <div className="my-hosted-actions">
                        <button
                          onClick={() => handleViewRegistrations(event)}
                          className="my-hosted-view-btn"
                        >
                          <Eye className="my-hosted-view-icon" />
                          <span>View Registrations</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="my-hosted-empty">
            <div className="my-hosted-empty-icon">🎤</div>
            <h3 className="my-hosted-empty-title">No hosted events</h3>
            <p className="my-hosted-empty-text">
              Start hosting workshops and sharing your expertise with others.
            </p>
            <button
              className="my-hosted-empty-btn"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("dashboard:navigate", {
                    detail: "host-event",
                  })
                )
              }
            >
              Host Your First Event
            </button>
          </div>
        )}
      </div>

      {selectedEvent && (
        <AttendeeList
          registrations={eventRegistrations}
          eventTitle={selectedEvent.title}
          loading={loading}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}

export default MyHostedEvents;
