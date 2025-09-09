// src/Dashboard/EventList.jsx
import React from "react";
import EventCard from "./EventCard";
import "../Styles/EventList.css";

export default function EventList({ events, onViewDetails }) {
  return (
    <div className="event-list">
      {events.length === 0 ? (
        <p className="no-events-text">No events found.</p>
      ) : (
        events.map((event) => (
          <EventCard key={event.id} event={event} onClick={() => onViewDetails(event)} />
        ))
      )}
    </div>
  );
}
