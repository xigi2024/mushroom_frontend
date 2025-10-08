import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Row, Col, Offcanvas, Dropdown } from 'react-bootstrap';
import { ShoppingCart, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import "./styles/header.css";
import logo2 from "../assets/logo2.png";

const Header = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();

  const cartItemsCount = getTotalItems();

  const handleLogout = () => {
    logout();
    setShowOffcanvas(false);
  };

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
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
            <Col md={3} className="d-none d-md-block">
              <div className="d-flex align-items-center">
               
                <a href="https://www.instagram.com/myco_matrix_mushroom?utm_source=qr&igsh=YWE2cnNmd3NxNGhw" target="_blank" rel="noopener noreferrer" className="text-white me-3 text-decoration-none">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://www.youtube.com/@mycomatrix" target="_blank" rel="noopener noreferrer" className="text-white me-3 text-decoration-none">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </Col>
            <Col md={6} className="text-center">
              <span className="d-none d-md-inline">Welcome to Myco Matrix</span>
            </Col>
            <Col md={3} className="text-end d-none d-md-block">
              <a href="mailto:mycomatrix1@gmail.com" className="text-white text-decoration-none">
                <i className="fas fa-envelope me-1"></i>
                <span className="small">mycomatrix1@gmail.com</span>
              </a>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Navbar */}
      <BSNavbar bg="white" expand="lg" className="sticky-top main-navbar">
        <Container>
          {/* Logo - Left Side */}
          <BSNavbar.Brand as={Link} to="/" className="logo-brand">
            <img 
              src={logo2} 
              alt="MYCO MATRIX" 
              className="img-fluid logo-image" 
            />
          </BSNavbar.Brand>

          {/* Desktop Navigation - Center */}
          <div className="d-none d-lg-flex align-items-center w-100 justify-content-between">
            <Nav className="mx-auto fw-semibold main-nav">
              {navLinks.map((link) => {
                const isActive = window.location.pathname === link.path || 
                               (link.path !== '/' && window.location.pathname.startsWith(link.path));
                return (
                  <Nav.Link 
                    key={link.path} 
                    as={Link} 
                    to={link.path} 
                    className={`nav-link-item ${isActive ? 'active-nav-link' : ''}`}
                  >
                    {link.label}
                  </Nav.Link>
                );
              })}
            </Nav>

            {/* Desktop Right Side Icons */}
            <div className="d-flex align-items-center gap-4 desktop-icons">
              <Link to="/cart" className="position-relative text-dark cart-icon" style={{ textDecoration: 'none' }}>
                <ShoppingCart size={22} />
                {cartItemsCount > 0 && (
                  <span className="badges">
                    {Math.min(cartItemsCount, 99)}
                    {cartItemsCount > 99 && '+'}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <Dropdown align="end" className="d-flex align-items-center">
                  <Dropdown.Toggle 
                    variant="light" 
                    id="user-dropdown" 
                    className="border-0 bg-transparent d-flex align-items-center p-0 user-toggle"
                  >
                    <div className="user-avatar">
                      <span className="user-initial">{getUserInitial()}</span>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="user-dropdown-menu">
                    <Dropdown.Item as={Link} to="/user-dashboard" className="dropdown-item-custom">
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="dropdown-item-custom text-danger">
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Link to="/login" className="login-btn text-decoration-none">Login</Link>
                  <Link to="/register" className="signup-btn text-decoration-none">Sign Up</Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Toggle Button - Right Side */}
          <button
            className="navbar-toggler d-lg-none border-0 p-0"
            onClick={() => setShowOffcanvas(true)}
            aria-label="Toggle navigation"
          >
            <Menu size={28} className="text-dark" />
          </button>

          {/* Offcanvas Mobile Menu */}
          <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" className="mobile-sidebar">
            <Offcanvas.Header closeButton className="sidebar-header">
              <BSNavbar.Brand as={Link} to="/" onClick={() => setShowOffcanvas(false)}>
                <img 
                  src={logo2} 
                  alt="MYCO MATRIX" 
                  className="img-fluid" 
                  style={{ width: "80px", height: "80px", objectFit: "contain" }} 
                />
              </BSNavbar.Brand>
            </Offcanvas.Header>
            
            <Offcanvas.Body className="sidebar-body">
              {/* User Info if authenticated */}
              {isAuthenticated && (
                <div className="user-info-mobile">
                  <div className="user-avatar-mobile">
                    <span className="user-initial-mobile">{getUserInitial()}</span>
                  </div>
                  <div className="user-details">
                    <div className="user-name">{user?.name || 'User'}</div>
                    <div className="user-email small text-muted">{user?.email}</div>
                  </div>
                </div>
              )}

              <Nav className="flex-column mobile-nav">
                {navLinks.map((link) => (
                  <Nav.Link
                    key={link.path}
                    as={Link}
                    to={link.path}
                    onClick={() => setShowOffcanvas(false)}
                    className={`mobile-nav-link ${
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

              {/* Cart in Offcanvas */}
              <div className="offcanvas-cart-section">
                <Link 
                  to="/cart" 
                  className="cart-offcanvas-link"
                  onClick={() => setShowOffcanvas(false)}
                >
                  <ShoppingCart size={20} className="me-2" />
                  Shopping Cart 
                  {cartItemsCount > 0 && (
                    <span className="cart-count-badge">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </div>

              <div className="mobile-auth-section">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/user-dashboard" 
                      className="btn btn-primary w-100 mb-2 dashboard-btn"
                      onClick={() => setShowOffcanvas(false)}
                    >
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Dashboard
                    </Link>
                    <button 
                      className="btn btn-outline-danger w-100 logout-btn" 
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="btn btn-primary w-100 mb-3 login-btn-mobile"
                      onClick={() => setShowOffcanvas(false)}
                    >
                      Login
                    </Link>
                    <div className="text-center">
                      <span className="text-muted small me-2">Don't have an account?</span>
                      <Link 
                        to="/register" 
                        className="signup-link"
                        onClick={() => setShowOffcanvas(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
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