import React from "react";
import "../Styles/EventCard.css";

const EventCard = ({ event, onClick }) => {
  // Format date as dd-mm-yyyy
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB"); // ✅ dd/mm/yyyy
  };

  // Format time as 12h with AM/PM
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // ✅ converts to AM/PM
    });
  };

  return (
    <div className="event-card" onClick={() => onClick(event)}>
      {/* Image */}
      <div className="event-card__image-wrapper">
        <img src={event.image} alt={event.title} className="event-card__image" />
        <span className="event-card__category">{event.category}</span>
      </div>

      {/* Content */}
      <div className="event-card__content">
        <h3 className="event-card__title">{event.title}</h3>
        <p className="event-card__instructor">by {event.instructor}</p>

        <div className="event-card__info">
          <p>
            <strong>Date:</strong> {formatDate(event.dateTime)}
          </p>
          <p>
            <strong>Time:</strong> {formatTime(event.dateTime)}
          </p>
        </div>

        <button className="event-card__button">Know More</button>
      </div>
    </div>
  );
};

export default EventCard;
