import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import logo2 from "../assets/logo2.png";

function Footer() {
  return (
    <footer className="bg-white text-dark py-5 mt-5">
      <Container>
        <Row>
          {/* Column 1 */}
          <Col md={3}>
          <img src={logo2} alt="Mushroom Site" class="img-fluid" style={{width:"200px",height:"100px",objectFit:"contain",margin:"auto"}} />
        
            <p>
              "Mushroom made our first import seamless and stress-free. Their
              guidance and support were invaluable throughout the entire process."
            </p>
          </Col>

          {/* Column 2 */}
          <Col md={3}>
            <h5>Our Product</h5>
            <ul className="list-unstyled">
              <li>Organic Mushroom Kit</li>
              <li>Premium Spawns</li>
              <li>Grow Bags</li>
              <li>Iot Kit</li>
            </ul>
          </Col>

          {/* Column 3 */}
          <Col md={3}>
            <h5>Help</h5>
            <ul className="list-unstyled">
              <li>About Us</li>
              <li>Contact Us</li>
              <li>Terms and Conditions</li>
              <li>Privacy and Policy</li>
            </ul>
          </Col>

          {/* Column 4 */}
          <Col md={3}>
        

            <h5>Social Media</h5>
            <div className="d-flex gap-3">
              <a href="#"><FaFacebook size={24} color="#1877f2" /></a>
              <a href="#"><FaTwitter size={24} color="#1DA1F2" /></a>
              <a href="#"><FaYoutube size={24} color="#FF0000" /></a>
              <a href="#"><FaInstagram size={24} color="#E1306C" /></a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
