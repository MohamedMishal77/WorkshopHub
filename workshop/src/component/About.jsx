import "../Styles/About.css";
import { Users, Video, Award } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Video size={32} />,
      title: "Host Your Own Workshop",
      description:
        "Share your expertise with a global audience and build your personal brand.",
    },
    {
      icon: <Award size={32} />,
      title: "Discover New Skills",
      description:
        "Learn from industry experts and expand your knowledge across various domains.",
    },
    {
      icon: <Users size={32} />,
      title: "Join & Connect Easily",
      description:
        "Build meaningful connections with like-minded learners and professionals.",
    },
  ];

  return (
    <section id="about" className="about">
      <div className="about-header">
        <h2>Empowering Learning Through Connection</h2>
        <p>
          WorkshopHub is the premier platform for hosting and discovering online
          workshops. Whether you're looking to share your expertise or learn
          something new, our community brings together passionate individuals
          from around the world.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
