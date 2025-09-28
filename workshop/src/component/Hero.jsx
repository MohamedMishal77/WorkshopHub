import "../Styles/Hero.css";
import heroImage from "../assets/HeroImage.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="hero">
      <div className="hero-gradient"></div>

      <div className="hero-bg">
        <img src={heroImage} alt="People participating in online workshops" />
      </div>

      <div className="hero-content">
        <div className="hero-textbox">
          <h1 className="hero-title">Discover and Host Online Workshops</h1>

          <p className="hero-subtitle">
            Connect with experts, learn new skills, and share your knowledge in
            our vibrant community of lifelong learners.
          </p>

          <div className="hero-cta">
            <button
              className="btn btn-hero"
              onClick={() => navigate("/register")}
            >
              Join The Community !
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
