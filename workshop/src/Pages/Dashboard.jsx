// src/Pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../Dashboard/Navigation";
import AllEvents from "../Dashboard/sections/AllEvents";
import MyEvents from "../Dashboard/sections/MyEvents";
import MyHostedEvents from "../Dashboard/sections/MyHostedEvents";
import HostEventForm from "../Dashboard/HostEventForm";
import EventDetailsModal from "../Dashboard/EventDetailsModal";
import apiFetch from "../api/apiFetch";

function Dashboard() {
  const navigate = useNavigate();

  const [currentSection, setCurrentSection] = useState("all-events");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // ✅ real user from backend
  const [loadingUser, setLoadingUser] = useState(true);

  // Listen for custom navigation events (e.g., from MyEvents → Browse Events)
  useEffect(() => {
    const handler = (e) => {
      const section = e?.detail;
      if (section) setCurrentSection(section);
    };
    window.addEventListener("dashboard:navigate", handler);
    return () => window.removeEventListener("dashboard:navigate", handler);
  }, []);

  // ✅ Load current user from cookie-based auth
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await apiFetch("/api/auth/validate");
        if (!res.ok) {
          // Not logged in → go to login
          navigate("/login");
          return;
        }
        const data = await res.json();
        if (isMounted) {
          setCurrentUser(data.user); // { id, email }
        }
      } catch (err) {
        console.error("Validate error:", err);
        navigate("/login");
      } finally {
        if (isMounted) setLoadingUser(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Logout -> call server to clear cookies then navigate
  const handleLogout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setEvents([]);
      setRegistrations([]);
      setCurrentUser(null);
      navigate("/login");
    }
  };

  const handleViewDetails = (event) => setSelectedEvent(event);

  const handleRegister = (eventId) => {
    // local optimistic registration (your server still prevents double-register)
    const newRegistration = {
      id: `reg-${Date.now()}`,
      eventId,
      userId: currentUser?.id ?? "me",
      userName: "You",
      userEmail: currentUser?.email ?? "you@example.com",
      registeredAt: new Date().toISOString(),
      status: "registered",
    };

    setRegistrations((prev) => [...prev, newRegistration]);

    // Update event registered count (local)
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? {
              ...event,
              registeredCount: (event.registeredCount || 0) + 1,
              isRegistered: true,
            }
          : event
      )
    );
  };

  // ✅ Host new event → save to DB
  const handleHostEvent = async (eventData) => {
    try {
      const dateTimeIso = new Date(`${eventData.date}T${eventData.time}`).toISOString();

      const res = await apiFetch("/api/events", {
        method: "POST",
        body: JSON.stringify({
          title: eventData.title,
          description: eventData.description,
          category: eventData.category,
          duration: Number(eventData.duration), // your DB returns interval already mapped in route
          dateTime: dateTimeIso,
          banner_image: eventData.banner || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create event");

      const { event } = data; // event contains hostId from the backend
      // Add to state so it shows in All Events + (if host matches) My Hosted Events
      setEvents((prev) => [event, ...prev]);
      setCurrentSection("my-hosted-events");
    } catch (err) {
      console.error("Error hosting event:", err);
      alert("Failed to create event.");
    }
  };

  const isUserRegistered = (eventId) =>
    registrations.some(
      (reg) => reg.eventId === eventId && String(reg.userId) === String(currentUser?.id ?? "me")
    );

  const onEventsLoad = (loadedEvents) => setEvents(loadedEvents);

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "all-events":
        return (
          <AllEvents
            events={events}
            onViewDetails={handleViewDetails}
            onEventsLoad={onEventsLoad}
          />
        );
      case "my-events":
        return (
          <MyEvents
            events={events}
            registrations={registrations.filter(
              (reg) => String(reg.userId) === String(currentUser?.id ?? "me")
            )}
            onViewDetails={handleViewDetails}
          />
        );
      case "my-hosted-events":
        return (
          <MyHostedEvents
            events={events}
            registrations={registrations}
            currentUserId={currentUser?.id} // ✅ real user id
          />
        );
      case "host-event":
        return (
          <HostEventForm
            onCancel={() => setCurrentSection("all-events")}
            onSubmit={handleHostEvent}
          />
        );
      default:
        return <AllEvents events={events} onViewDetails={handleViewDetails} />;
    }
  };

  // Optionally gate the UI while we resolve who the user is
  if (loadingUser) {
    return <div className="min-h-screen bg-gray-50 p-6">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        onLogout={handleLogout}
      />

      <main>{renderCurrentSection()}</main>

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRegister={handleRegister}
          isRegistered={isUserRegistered(selectedEvent.id)}
        />
      )}
    </div>
  );
}

export default Dashboard;
