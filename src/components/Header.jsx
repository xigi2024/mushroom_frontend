import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Row, Col, Offcanvas } from 'react-bootstrap';
import { ShoppingCart } from 'lucide-react';
import "./styles/header.css";
import logo2 from "../assets/logo2.png";

const Header = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const cartItemsCount = 0; // Replace with actual cart count if needed

  const handleLogout = () => {
    console.log('Logout clicked');
    setShowOffcanvas(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' }
  ];

  return (
    <>
    {/* Top Bar */}
<div className="top-bar text-white py-2 small">
  <Container>
    <Row className="align-items-center">
      <Col md={3}>
        <div className="d-flex align-items-center">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white me-3 text-decoration-none">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/hill_herbals/" target="_blank" rel="noopener noreferrer" className="text-white me-3 text-decoration-none">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="http://www.youtube.com/@HillHerbals" target="_blank" rel="noopener noreferrer" className="text-white me-3 text-decoration-none">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </Col>
      <Col md={6} className="text-center">
        <span>🚚 International Shipping Free Above 20 USD / 10000 INR</span>
      </Col>
      <Col md={3} className="text-end">
        <a href="mailto:mycomatrix2025@gmail.com" className="text-white text-decoration-none me-3">
          <i className="fas fa-envelope me-1"></i>
          <span className="small">mycomatrix2025@gmail.com</span>
        </a>
      </Col>
    </Row>
  </Container>
</div>


      {/* Main Navbar */}
      <BSNavbar bg="white" expand="lg" className="sticky-top p-4">
        <Container className=''>
          <BSNavbar.Brand as={Link} to="/" className="fw-bold">
          <img src={logo2} alt="Mushroom Site" class="img-fluid" style={{width:"200px",height:"100px",objectFit:"contain",margin:"auto"}} />
          </BSNavbar.Brand>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex align-items-center w-100 justify-content-between">
            <Nav className="mx-auto fw-semibold" style={{fontSize:"18px"}}>
              {navLinks.map((link) => (
                <Nav.Link key={link.path} as={Link} to={link.path} className="mx-2 text-dark">
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>

            {/* Cart + Buttons */}
            <div className="d-flex align-items-center gap-4">
              <a href="/cart" className="position-relative text-dark" style={{ textDecoration: 'none' }}>
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && <span className="cart-badge">{Math.min(cartItemsCount, 99)}</span>}
              </a>

              <Link to="/login" className="button text-decoration-none">Login</Link>
              <Link to="/register" className="text-black text-decoration-none">Sign Up</Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler d-lg-none border-0"
            onClick={() => setShowOffcanvas(true)}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Offcanvas Mobile Menu */}
          <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" className="sidebar">
            <Offcanvas.Header closeButton className="bg-white">
              <BSNavbar.Brand as={Link} to="/" className="fw-bold" onClick={() => setShowOffcanvas(false)}>
                <span className="text-dark">Myco Matrix</span>
              </BSNavbar.Brand>
            </Offcanvas.Header>
            <hr className="m-0" />
            <Offcanvas.Body className="bg-white p-0">
              <Nav className="flex-column">
                {navLinks.map((link) => (
                  <Nav.Link
                    key={link.path}
                    as={Link}
                    to={link.path}
                    onClick={() => setShowOffcanvas(false)}
                    className="px-4 py-3 text-dark border-bottom"
                  >
                    {link.label}
                  </Nav.Link>
                ))}
              </Nav>
              <div className="px-4 py-3 d-flex flex-column gap-2">
                <Link to="/cart" className="d-flex align-items-center text-dark" onClick={() => setShowOffcanvas(false)}>
                  <ShoppingCart size={20} className="me-2" />
                  Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                </Link>
                <Link to="/login" className="button" onClick={() => setShowOffcanvas(false)}>Login now</Link>
                <Link to="/register" onClick={() => setShowOffcanvas(false)}>Sign Up</Link>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </BSNavbar>
    </>
  );
};

export default Header;
