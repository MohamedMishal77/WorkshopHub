import "../Styles/Footer.css";
import { BookOpen, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div>
          <div className="footer-brand">
            <div className="brand-icon">
              <BookOpen size={20} color="white" />
            </div>
            <span className="brand-name">WorkshopHub</span>
          </div>
          <p>
            Empowering learning through connection. Join our community of lifelong learners and expert instructors.
          </p>
        </div>

        {/* Social */}
        <div>
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
            <a href="#"><Linkedin size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© {year} WorkshopHub. All rights reserved. Built with ❤️ for the learning community.</p>
      </div>
    </footer>
  );
};

export default Footer;
