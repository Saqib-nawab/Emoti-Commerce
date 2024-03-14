import { Container } from 'react-bootstrap';
import logo from '../assets/logo.png';

import '../app.css'


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <div className="footer-container">
          <div className="col-1">
            <img src={logo} alt='ProShop' />
            <p>
              Intelli-Commerce, Steps you into the future of retail with our automated tech store! Powered by AI and ML, we offer personalized recommendations for the latest iPhones, AirPods, and more. Experience seamless shopping tailored to your preferences.
            </p>
          </div>
          <div className="col-2">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Categories</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">Services</a>
              </li>
            </ul>
          </div>
          <div className="col-3">
            <h3>Services</h3>
            <ul>
              <li>
                <a href="#">HTML</a>
              </li>
              <li>
                <a href="#">CSS</a>
              </li>
              <li>
                <a href="#">JavaScript</a>
              </li>
              <li>
                <a href="#">React</a>
              </li>
              <li>
                <a href="#">Python</a>
              </li>
              <li>
                <a href="#">C++</a>
              </li>
            </ul>
          </div>
          <div className="col-4">
            <h3>Newsletter</h3>
            <form>
              <i className="far fa-envelope" />
              <input type="email" placeholder="Enter your email" required="" />
              <button>
                <i className="fas fa-arrow-right" />
              </button>
            </form>
            <div className="social-icons">
              <a href="https://github.com/Saqib-nawab" target="_blank">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="https://www.instagram.com/shahabe.saqib.33/" target="_blank">
                <i className="fab fa-instagram" />
              </a>
              <a href="https://www.linkedin.com/in/saqib-nawab-06aa411b9/" target="_blank">
                <i className="fab fa-linkedin-in" />
              </a>

            </div>
          </div>
        </div>
        <div className="footer-2">
          <p>© {currentYear} | Saqib Nawab, Intelli-Commerce. All Rights Reserved.</p>
        </div>
      </Container>
    </footer>
  );
};
export default Footer;
