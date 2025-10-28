import { Container, Row, Col } from "react-bootstrap";
import { FaYoutube, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo2 from "/assets/logo2.png";

function Footer() {
  return (
    <footer className="bg-white text-dark pt-5">
      <Container>
        <Row>
          {/* Column 1 */}
          <Col md={3}>
            <Link to="/">
              <img src={logo2} alt="Mushroom Site" className="img-fluid" style={{ width: "200px", height: "140px", objectFit: "contain", margin: "auto" }} />
            </Link>
            <p className="mt-3">
              Powered by Mushroom, driving eCommerce growth through seamless IoT solutions.
            </p>
          </Col>

          {/* Column 2 */}
          <Col md={3} className="products">
            <h5 className="titles footer-text text-dark">Our Product</h5>
            <ul className="list-unstyled" style={{ lineHeight: "2" }}>
              <li><Link to="/products" className="text-dark para text-decoration-none">Organic Mushroom Kit</Link></li>
              <li><Link to="/products" className="text-dark para text-decoration-none">Premium Spawns</Link></li>
              <li><Link to="/products" className="text-dark para text-decoration-none">Grow Bags</Link></li>
              <li><Link to="/products" className="text-dark para text-decoration-none">IoT Kit</Link></li>
            </ul>
          </Col>

          {/* Column 3 */}
          <Col md={3}>
            <h5 className="titles footer-text text-dark">Help</h5>
            <ul className="list-unstyled" style={{ lineHeight: "2" }}>
              <li><Link to="/about" className="text-dark para text-decoration-none">About Us</Link></li>
              <li><Link to="/contact" className="text-dark para text-decoration-none">Contact Us</Link></li>
              <li><Link to="/terms-conditions" className="text-dark para text-decoration-none">Terms and Conditions</Link></li>
              <li><Link to="/privacy-policy" className="text-dark para text-decoration-none">Privacy and Policy</Link></li>
              <li><Link to="/shipping-policy" className="text-dark para text-decoration-none">Shipping Policy</Link></li>
              <li><Link to="/refund-policy" className="text-dark para text-decoration-none">Refund Policy</Link></li>
            </ul>
          </Col>

          {/* Column 4 */}
          <Col md={3} className="footer-text" style={{ lineHeight: "2" }}>
            <h5 className="titles text-dark">Contact</h5>
            <p className="mb-1 d-flex align-items-center gap-2 para" style={{color:"#212529"}}>
              <FaEnvelope size={16} color="rgb(50 51 50)" />
              mycomatrix1@gmail.com
            </p>
            <p className="mb-1 d-flex align-items-center gap-2 para" style={{color:"#212529"}}>
              <FaPhoneAlt size={16} color="rgb(50 51 50)" />
              +91-9884248531
            </p>
            <p className="mb-3 d-flex align-items-start gap-2 para" style={{ lineHeight: "1.5", color:"#212529"}}>
              <FaMapMarkerAlt size={16} color="rgb(50 51 50)" className="mt-1" />
              1/1/16 Ambalakar Street,<br />
              Vadugapatti, <br />
              Periyakulam - 625 603,<br />
              Theni, Tamil Nadu
            </p>
          </Col>
        </Row>

{/* Bottom Row - Copyright and Social Icons */}
<Row className="border-top mt-4 pt-4 pb-3 align-items-center">
  {/* Copyright Text - Left Side */}
  <Col md={6} className="text-md-start text-center mb-3 mb-md-0">
    <p className="mb-0 text-muted">
      Copyright © {new Date().getFullYear()} Mycomatrix Pvt.Ltd | Powered by{' '}
      <a href="https://xigi.in/" className="color text-decoration-none" target="_blank" rel="noopener noreferrer">
        Xigi Tech.Pvt.Ltd.
      </a>
    </p>
  </Col>
  
  {/* Social Icons - Right Side */}
  <Col md={6} className="text-md-end text-center">
    <div className="d-inline-flex gap-3">
      <a
        href="https://www.youtube.com/@mycomatrix"
        target="_blank"
        rel="noopener noreferrer"
        className="social-icon"
      >
        <FaYoutube size={24} color="rgb(50 51 50)" style={{ 
          border: "1px solid #000", 
          borderRadius: "5px", 
          padding: "8px", 
          height: "40px", 
          width: "45px",
          transition: "all 0.3s ease"
        }} 
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
        }} 
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }} />
      </a>
      <a
        href="https://www.instagram.com/myco_matrix_mushroom?utm_source=qr&igsh=YWE2cnNmd3NxNGhw"
        target="_blank"
        rel="noopener noreferrer"
        className="social-icon"
      >
        <FaInstagram size={24} color="rgb(50 51 50)" style={{ 
          border: "1px solid #000", 
          borderRadius: "5px", 
          padding: "8px", 
          height: "40px", 
          width: "45px",
          transition: "all 0.3s ease"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
        }} 
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }} />
      </a>
    </div>
  </Col>
</Row>
      </Container>
    </footer>
  );
}

export default Footer;