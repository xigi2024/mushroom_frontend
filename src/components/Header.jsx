import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Row, Col, Offcanvas, Dropdown } from 'react-bootstrap';
import { ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Import the cart context
import "./styles/header.css";
import logo2 from "../assets/logo2.png";

const Header = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart(); // Get the cart function to count items

  const cartItemsCount = getTotalItems(); // Get the actual cart count

  const handleLogout = () => {
    logout();
    setShowOffcanvas(false);
  };

  // Function to get the first letter of the username
  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U'; // Default if no name or email
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
            <img src={logo2} alt="Mushroom Site" className="img-fluid" style={{ width: "200px", height: "100px", objectFit: "contain", margin: "auto" }} />
          </BSNavbar.Brand>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex align-items-center w-100 justify-content-between">
            <Nav className="mx-auto fw-semibold" style={{ fontSize: "18px" }}>
              {navLinks.map((link) => {
                const isActive = window.location.pathname === link.path || 
                               (link.path !== '/' && window.location.pathname.startsWith(link.path));
                return (
                  <Nav.Link 
                    key={link.path} 
                    as={Link} 
                    to={link.path} 
                    className={`mx-2 text-dark ${isActive ? 'active-nav-link' : ''}`}
                  >
                    {link.label}
                  </Nav.Link>
                );
              })}
            </Nav>

            {/* Cart + Auth Buttons/Profile */}
            <div className="d-flex align-items-center gap-4">
              <Link to="/cart" className="position-relative text-dark" style={{ textDecoration: 'none' }}>
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badges "
                    style={{ fontSize: '0.6rem' }}
                  >
                    {Math.min(cartItemsCount, 99)}
                    {cartItemsCount > 99 && '+'}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                // User Profile Dropdown with initial + arrow in one line
                <Dropdown align="end" className="d-flex align-items-center">
                  <Dropdown.Toggle 
                    variant="light" 
                    id="user-dropdown" 
                    className="border-0 bg-transparent d-flex align-items-center p-0"
                    style={{ boxShadow: "none" }}
                  >
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-circle bg-secondary text-white me-2" 
                      style={{ width: '36px', height: '36px', cursor: 'pointer' }}
                    >
                      <span className="fw-bold">{getUserInitial()}</span>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/user-dashboard">
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                // Login/Signup buttons (only shown when not authenticated)
                <>
                  <Link to="/login" className="button text-decoration-none">Login</Link>
                  <Link to="/register" className="text-black text-decoration-none ms-2">Sign Up</Link>
                </>
              )}
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
                    className={`px-4 py-3 text-dark border-bottom ${
                      window.location.pathname === link.path || 
                      (link.path !== '/' && window.location.pathname.startsWith(link.path)) 
                        ? 'active-nav-link' 
                        : ''
                    }`}
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
                
                {isAuthenticated ? (
                  // Mobile User Profile Section with initial only
                  <>
                    <div className="d-flex align-items-center gap-2 py-2 text-dark">
                      <div className="d-flex align-items-center justify-content-center rounded-circle bg-secondary text-white" 
                           style={{ width: '30px', height: '30px' }}>
                        <span className="fw-bold small">{getUserInitial()}</span>
                      </div>
                      <span>{user?.name || user?.email || 'User'}</span>
                    </div>
                    <Link to="/dashboard" className="button" onClick={() => setShowOffcanvas(false)}>
                      Dashboard
                    </Link>
                    <button 
                      className="btn btn-outline-danger w-100" 
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  // Mobile Login/Signup (only shown when not authenticated)
                  <>
                    <Link to="/login" className="button" onClick={() => setShowOffcanvas(false)}>Login now</Link>
                    <Link to="/register" onClick={() => setShowOffcanvas(false)}>Sign Up</Link>
                  </>
                )}
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </Container>
      </BSNavbar>
    </>
  );
};

export default Header;