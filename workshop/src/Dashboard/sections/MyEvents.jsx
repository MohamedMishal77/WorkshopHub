import React, { useEffect, useState } from "react";
import EventList from "../EventList";
import apiFetch from "../../api/apiFetch";
import "../sections/Styles/MyEvents.css";

function MyEvents({ events: propEvents = [], registrations: propRegistrations = [], onViewDetails }) {
  const [events, setEvents] = useState(null); // all fetched events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("upcoming"); // "upcoming" | "completed" | "all"

  useEffect(() => {
    let mounted = true;

    async function fetchMyEvents() {
      setLoading(true);
      setError("");

      try {
        const res = await apiFetch("/api/registrations/mine", { method: "GET" });

        if (res.ok) {
          const data = await res.json();
          if (!mounted) return;
          setEvents(data.events || []);
        } else {
          // fallback to props if API fails
          if (!mounted) return;
          console.warn("Could not fetch /registrations/mine, falling back to props");
          const myEventIds = propRegistrations.map((r) => r.eventId);
          const myEvents = propEvents.filter((ev) => myEventIds.includes(ev.id));
          setEvents(myEvents);
          const errBody = await res.json().catch(() => ({}));
          setError(errBody.message || "");
        }
      } catch (err) {
        console.error("Error loading my events:", err);
        // fallback to props
        const myEventIds = propRegistrations.map((r) => r.eventId);
        const myEvents = propEvents.filter((ev) => myEventIds.includes(ev.id));
        if (!mounted) return;
        setEvents(myEvents);
        setError(err.message || "Unable to load your events");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchMyEvents();
    return () => {
      mounted = false;
    };
  }, [propEvents, propRegistrations]);

  const handleBrowseClick = () => {
    window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: "all-events" }));
    setTimeout(() => {
      const eventsSection = document.getElementById("all-events");
      if (eventsSection) eventsSection.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  // Filtering logic
  const now = new Date();
  const filteredEvents =
    events?.filter((e) => {
      const eventDate = new Date(e.dateTime);
      if (filter === "upcoming") return eventDate >= now;
      if (filter === "completed") return eventDate < now;
      return true; // "all"
    }) || [];

  if (loading || events === null) {
    return (
      <div className="my-events-container">
        <div className="my-events-header">
          <h1 className="my-events-title">My Events</h1>
        </div>
        <p className="loading-text">Loading your events...</p>
      </div>
    );
  }

  const hasEvents = filteredEvents.length > 0;

  return (
    <div className="my-events-container">
      <div className="my-events-header">
        <div>
          <h1 className="my-events-title">My Events</h1>
          <p className="my-events-subtitle">Events you've registered for</p>
        </div>

        {/* Filter Dropdown */}
        <select
          className="my-events-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="upcoming">Upcoming Events</option>
          <option value="completed">Completed Events</option>
          <option value="all">All Events</option>
        </select>
      </div>

      {hasEvents ? (
        <EventList
          events={filteredEvents}
          registrations={[]}
          showRegistrationStatus={true}
          onViewDetails={onViewDetails}
        />
      ) : (
        <div className="my-events-empty">
          <div className="my-events-empty-icon">🎫</div>
          <h3 className="my-events-empty-title">No {filter} events</h3>
          <p className="my-events-empty-text">
            {filter === "upcoming"
              ? "You have no upcoming events. Browse and register for workshops that interest you."
              : filter === "completed"
              ? "You haven't completed any events yet."
              : "You haven’t registered for any events."}
          </p>
          {filter === "upcoming" && (
            <button className="my-events-browse-btn" onClick={handleBrowseClick}>
              Browse Events
            </button>
          )}
          {error && <p className="my-events-error"> {error} </p>}
        </div>
      )}
    </div>
  );
}

export default MyEvents;
