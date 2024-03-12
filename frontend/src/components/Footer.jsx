import { Container, Row, Col } from 'react-bootstrap';
import '../app.css'


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>

        <div className="container">
          <div className="col-1">
            <img src="/logo.png" alt="" />
            <p>
              Follow my instagram channel named mubashar_dev to see more of such
              projects and other posts. Also Like and share these posts.Also follow me
              on Github and Linkedin. I hope you will like my content.
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
              <a href="#">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="#">
                <i className="fab fa-twitter" />
              </a>
              <a href="#">
                <i className="fab fa-instagram" />
              </a>
              <a href="#">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-2">
          <p>© {currentYear} | Made with ❤️ by Mubashar Dev. All Rights Reserved.</p>
        </div>
      </Container>
    </footer>
  );
};
export default Footer;
