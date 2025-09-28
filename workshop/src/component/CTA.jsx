import "../Styles/CTA.css";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="cta">
      <div className="cta-content">
        <h2>Ready to learn or share your skills?</h2>
        <p>
          Join thousands of learners and experts who are already part of our
          growing community.
        </p>

        <div className="cta-buttons">
          <button
            className="btn btn-gradient btn-lg"
            onClick={() => navigate("/register")}
          >
            Join Now
          </button>
          <button
            className="btn btn-outline btn-lg"
            onClick={() => navigate("/login")}
          >
            Host a Workshop
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
