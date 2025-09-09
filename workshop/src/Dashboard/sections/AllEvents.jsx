// src/Dashboard/sections/AllEvents.jsx
import React, { useState, useEffect } from "react";
import FilterControls from "../FilterControls";
import EventList from "../EventList";
import "../sections/Styles/AllEvents.css";
import apiFetch from "../../api/apiFetch";

function AllEvents({ events: propEvents, onViewDetails, onEventsLoad }) {
  const [events, setEvents] = useState(propEvents || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortOption, setSortOption] = useState("latest");
  const [categories, setCategories] = useState(["All Categories"]);

  // Fetch events (cookie-based accessToken)
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);

      try {
        const res = await apiFetch("/api/events", { method: "GET" });
        if (res.status === 401 || res.status === 403) {
          // Not authenticated — redirect to login
          window.location.href = "/login";
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();
        const evts = data.events || [];
        setEvents(evts);

        // Extract unique categories
        const uniqueCategories = [
          "All Categories",
          ...new Set(evts.map((e) => e.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);

        // notify parent (if it cares)
        if (onEventsLoad) onEventsLoad(evts);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Unable to load events");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply search, filter, and sort
  const filteredEvents = events
    .filter((event) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        event.title.toLowerCase().includes(query) ||
        event.instructor?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All Categories" ||
        event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dateTime || `${a.date}T${a.time}`);
      const dateB = new Date(b.dateTime || `${b.date}T${b.time}`);
      return sortOption === "latest"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

  if (loading) return <p className="loading-text">Loading events...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div id = "all-events"className="all-events-container">
      <div className="all-events-header">
        <h1 className="all-events-title">Welcome</h1>
        <p className="all-events-subtitle">
          Find workshops and events that match your interests
        </p>
      </div>

      <FilterControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortOption={sortOption}
        onSortChange={setSortOption}
        categories={categories}
      />

      <EventList events={filteredEvents} onViewDetails={onViewDetails} />
    </div>
  );
}

export default AllEvents;
