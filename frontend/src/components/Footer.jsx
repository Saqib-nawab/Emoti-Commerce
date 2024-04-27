import { Container } from 'react-bootstrap';
import logo from '../assets/logo.png';
import { useState, useEffect } from 'react';
import '../app.css'
import { useNavigate, Link } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleHomeClick = () => {
    navigate('/');
  };

  // State to track subscription status
  const handleSubmit = async (e) => {
    e.preventDefault();
    let subscriptionAction; // Declare subscriptionAction outside the try block
    try {
      setSubscribed(!subscribed); // Toggle subscription status

      subscriptionAction = subscribed ? 'unsubscribe' : 'subscribe';// Determine the subscription action based on the current state

      const response = await fetch(`/api/users/${subscriptionAction}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // Subscription/unsubscription successful, handle accordingly
        console.log(`User ${subscriptionAction}d successfully`);
      } else {
        // Subscription/unsubscription failed, handle accordingly
        console.error(`Error ${subscriptionAction}ing`);
        // Revert subscription status if there was an error
        setSubscribed(!subscribed);
      }
    } catch (error) {
      console.error(`Error ${subscriptionAction}ing:`, error);
      // Revert subscription status if there was an error
      setSubscribed(!subscribed);
    }
  };



  return (
    <footer>
      <Container>
        <div className="footer-container">
          <div className="col-1">
            <a href="#" onClick={handleHomeClick}> {/* Wrap logo in an anchor tag */}
              <img src={logo} alt='ProShop' />
            </a>
            <p>
              Intelli-Commerce, Steps you into the future of retail with our automated tech store! Powered by AI and ML, we offer personalized recommendations for the latest iPhones, AirPods, and more. Experience seamless shopping tailored to your preferences.
            </p>
          </div>
          <div className="col-2">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="#" onClick={handleHomeClick}>Home</a>
              </li>
              <li>
                <Link to="/email-us" onClick={handleScroll}>Email Us</Link>
              </li>
              <li>
                <Link to="/FAQ's" onClick={handleScroll}>FAQ's</Link>
              </li>
            </ul>
          </div>
          <div className="col-3">
            <h3>Services</h3>
            <ul>
              <li>
                <a href="#">Product Catalog</a>
              </li>
              <li>
                <a href="#">Payment Gateway Integration</a>
              </li>
              <li>
                <a href="#">Automated FAQ's</a>
              </li>
              <li>
                <a href="#">Interactive Call Bot</a>
              </li>
              <li>
                <a href="#">Sentimental Reviews and Ratings</a>
              </li>
            </ul>
          </div>
          <div className="col-4">
            <h3>Subscribtion</h3>
            <form className="form-footer" onSubmit={handleSubmit}>
              <button type="submit" className={`btn ${subscribed ? 'btn-dark' : 'btn-danger'}`}>
                {subscribed ? 'Subscribed' : 'Subscribe'}
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
          <p>© {currentYear} | Saqib Nawab and Mohammed Talha, Intelli-Commerce. All Rights Reserved.</p>
        </div>
      </Container>
    </footer>
  );
};
export default Footer;
