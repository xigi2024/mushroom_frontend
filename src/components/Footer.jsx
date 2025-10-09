import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaYoutube, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo2 from "/assets/logo2.png";


function Footer() {
  return (
    <footer className="bg-white text-dark pt-5 pb-3 mt-5">
      <Container>
        <Row>
          {/* Column 1 */}
          <Col md={3}>
            <Link to="/">
              <img src={logo2} alt="Mushroom Site" className="img-fluid" style={{ width: "200px", height: "100px", objectFit: "contain", margin: "auto" }} />
            </Link>

            <p>
              "Mushroom made our first import seamless and stress-free. Their
              guidance and support were invaluable throughout the entire process."
            </p>
          </Col>

          {/* Column 2 */}
          <Col md={3}>
            <h5>Our Product</h5>
            <ul className="list-unstyled" style={{ lineHeight: "2" }}>
              <li><Link to="/products" className="text-dark text-decoration-none">Organic Mushroom Kit</Link></li>
              <li><Link to="/products" className="text-dark text-decoration-none">Premium Spawns</Link></li>
              <li><Link to="/products" className="text-dark text-decoration-none">Grow Bags</Link></li>
              <li><Link to="/products" className="text-dark text-decoration-none">IoT Kit</Link></li>
            </ul>
          </Col>

          {/* Column 3 */}
          <Col md={3}>
            <h5>Help</h5>
            <ul className="list-unstyled" style={{ lineHeight: "2" }}>
  <li>
    <Link to="/about" className="text-dark text-decoration-none">About Us</Link>
  </li>
  <li>
    <Link to="/contact" className="text-dark text-decoration-none">Contact Us</Link>
  </li>
  <li>
    <Link to="/terms-conditions" className="text-dark text-decoration-none">Terms and Conditions</Link>
  </li>
  <li>
    <Link to="/privacy-policy" className="text-dark text-decoration-none">Privacy and Policy</Link>
  </li>
  <li>
    <Link to="/shipping-policy" className="text-dark text-decoration-none">Shipping Policy</Link>
  </li>
  <li>
    <Link to="/refund-policy" className="text-dark text-decoration-none">Refund Policy</Link>
  </li>
</ul>


          </Col>

          {/* Column 4 */}


          <Col md={3} style={{ lineHeight: "2" }}>
            <h5>Contact</h5>

            {/* Email */}
            <p className="mb-1 d-flex align-items-center gap-2">
              <FaEnvelope size={16} color="rgb(50 51 50)" />
              <span>mycomatrix1@gmail.com</span>
            </p>

            {/* Phone */}
            <p className="mb-1 d-flex align-items-center gap-2">
              <FaPhoneAlt size={16} color="rgb(50 51 50)" />
              <span>+91-9884248531</span>
            </p>

            {/* Location */}
            <p className="mb-3 d-flex align-items-start gap-2 "style={{ lineHeight: "1.5" }}>
              <FaMapMarkerAlt size={16} color="rgb(50 51 50)" className="mt-1" />
              <span>
                1/1/16 Ambalakar Street,<br />
                Vadugapatti, <br />
                Periyakulam - 625 603,<br />
                Theni,Tamil Nadu
              </span>
            </p>

            {/* Social Icons */}
            <div className="d-flex gap-3">
              <a
                href="https://www.youtube.com/@mycomatrix"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube size={24} color="rgb(50 51 50)" style={{border:"1px solid #000", borderRadius:"5px", padding:"8px",height:"40px",width:"45px"}}/>
              </a>
              <a
                href="https://www.instagram.com/myco_matrix_mushroom?utm_source=qr&igsh=YWE2cnNmd3NxNGhw"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={24} color="rgb(50 51 50)" style={{border:"1px solid #000", borderRadius:"5px", padding:"8px",height:"40px",width:"45px"}}/>
              </a>
            </div>
          </Col>


        </Row>

      </Container>
              {/* Copyright */}
              <div className="row border-top p-0 mt-3 phone" >
          <div
            className="col-12 text-center"
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",

              marginTop: "20px"
            }}
          >
            <p className="mb-0">
              Copyright © 2025 Mycomatrix Pvt.Ltd | Powered by{' '}
              <a href="https://xigi.in/" className="color text-decoration-none" target="_blank" rel="noopener noreferrer">
                Xigi Tech.Pvt.Ltd.
              </a>
            </p>
          </div>
        </div>
    </footer>
  );
}

export default Footer;
