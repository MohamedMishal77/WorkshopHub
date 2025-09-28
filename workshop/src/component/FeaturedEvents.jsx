import "../Styles/FeaturedEvents.css";
import { Calendar, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeaturedEvents = () => {
  const navigate = useNavigate();

  const sampleEvents = [
    {
      id: 1,
      title: "Advanced React Patterns",
      category: "Development",
      date: "2025-12-12",
      time: "14:00",
      instructor: "Sarah Johnson",

      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop",
    },
    {
      id: 2,
      title: "Digital Marketing Mastery",
      category: "Marketing",
      date: "2025-11-11",
      time: "16:00",
      instructor: "Michael Chen",

      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      category: "Design",
      date: "2025-11-10",
      time: "10:00",
      instructor: "Emma Davis",

      image:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=200&fit=crop",
    },
    {
      id: 4,
      title: "Data Science with Python",
      category: "Data Science",
      date: "2025-12-27",
      time: "13:00",
      instructor: "David Rodriguez",

      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    },
    {
      id: 5,
      title: "Project Management Essentials",
      category: "Business",
      date: "2024-12-01",
      time: "15:00",
      instructor: "Lisa Anderson",

      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
    },
    {
      id: 6,
      title: "Creative Writing Workshop",
      category: "Creative",
      date: "2025-11-20",
      time: "18:00",
      instructor: "James Wilson",

      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=200&fit=crop",
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section id="events" className="events-section">
      <div className="events-container">
        <div className="events-header">
          <h2>Featured Workshops</h2>
          <p>
            Discover upcoming workshops from industry experts and start your
            learning journey today.
          </p>
        </div>

        <div className="events-grid">
          {sampleEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <div className="event-category">{event.category}</div>
              </div>

              <div className="event-content">
                <h3>{event.title}</h3>

                <div className="event-details">
                  <div>
                    <Calendar size={16} />
                    {formatDate(event.date)}
                  </div>
                  <div>
                    <Clock size={16} />
                    {event.time}
                  </div>
                </div>

                <div className="event-footer">
                  <span>by {event.instructor}</span>
                  <button className="btn-outline">Know More</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all">
          <button className="btn-primary" onClick={() => navigate("/login")}>
            View All Workshops
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
