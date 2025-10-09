import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { ShoppingCart, Home, Package, Info, Phone, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import "./styles/header.css";
import logo2 from "/assets/logo.png";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const [showMobileAuth, setShowMobileAuth] = useState(false);

  const cartItemsCount = getTotalItems();

  const handleLogout = () => {
    logout();
    setShowMobileAuth(false);
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
              <div className="d-flex align-items-center top-text">
                <a href="https://www.instagram.com/myco_matrix_mushroom?utm_source=qr&igsh=YWE2cnNmd3NxNGhw" target="_blank" rel="noopener noreferrer" className="text-white me-3 text-decoration-none">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://www.youtube.com/@mycomatrix" target="_blank" rel="noopener noreferrer" className="text-white me-3 text-decoration-none">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </Col>
            <Col md={6} className="text-center">
              <span className="d-none d-md-inline top-text">Welcome to Myco Matrix</span>
            </Col>
            <Col md={3} className="text-end d-none d-md-block">
              <a href="mailto:mycomatrix1@gmail.com" className="text-white text-decoration-none">
                <i className="fas fa-envelope me-1"></i>
                <span className="top-text">mycomatrix1@gmail.com</span>
              </a>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Navbar */}
      <BSNavbar bg="white" expand="lg" className="sticky-top main-navbar">
        <Container>
          {/* Logo */}
          <BSNavbar.Brand as={Link} to="/" className="logo-brand">
            <img 
              src={logo2} 
              alt="MYCO MATRIX" 
              className="img-fluid logo-image" 
            />
          </BSNavbar.Brand>

          {/* Desktop Navigation - Center */}
          <div className="d-none d-lg-flex align-items-center w-100 justify-content-between">
            <Nav className="ms-auto fw-semibold main-nav">
              {navLinks.map((link) => {
                const isActive =
                  window.location.pathname === link.path ||
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

          {/* Mobile: Cart Icon Only */}
          <Link to="/cart" className="d-lg-none position-relative text-dark cart-icon" style={{ textDecoration: 'none' }}>
            <ShoppingCart size={22} />
            {cartItemsCount > 0 && (
              <span className="badges">
                {Math.min(cartItemsCount, 99)}
                {cartItemsCount > 99 && '+'}
              </span>
            )}
          </Link>
        </Container>
      </BSNavbar>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav d-lg-none">
        <Link 
          to="/" 
          className={`nav-icon ${window.location.pathname === '/' ? 'active' : ''}`}
          data-label="Home"
        >
          <Home size={22} />
        </Link>
        
        <Link 
          to="/products" 
          className={`nav-icon ${window.location.pathname.startsWith('/products') ? 'active' : ''}`}
          data-label="Products"
        >
          <Package size={22} />
        </Link>
        
        <Link 
          to="/about" 
          className={`nav-icon ${window.location.pathname === '/about' ? 'active' : ''}`}
          data-label="About"
        >
          <Info size={22} />
        </Link>
        
        <Link 
          to="/contact" 
          className={`nav-icon ${window.location.pathname === '/contact' ? 'active' : ''}`}
          data-label="Contact"
        >
          <Phone size={22} />
        </Link>
        
        <div 
          className={`nav-icon ${window.location.pathname.includes('/user-dashboard') || window.location.pathname.includes('/login') ? 'active' : ''}`}
          onClick={() => setShowMobileAuth(!showMobileAuth)}
          data-label="Account"
        >
          <User size={22} />
        </div>
      </div>

      {/* Mobile Auth Popup */}
      {showMobileAuth && (
        <div className="mobile-auth-popup">
          <div className="popup-overlay" onClick={() => setShowMobileAuth(false)}></div>
          <div className="popup-content">
            {isAuthenticated ? (
              <>
                <div className="user-info-popup">
                  <div className="user-avatar-popup">
                    <span>{getUserInitial()}</span>
                  </div>
                  <div>
                    <div className="user-name">{user?.name || 'User'}</div>
                    <div className="user-email">{user?.email}</div>
                  </div>
                </div>
                <Link 
                  to="/user-dashboard" 
                  className="popup-item"
                  onClick={() => setShowMobileAuth(false)}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <div className="popup-item text-danger" onClick={handleLogout}>
                  <LogOut size={18} />
                  Logout
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="popup-item"
                  onClick={() => setShowMobileAuth(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="popup-item"
                  onClick={() => setShowMobileAuth(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            <div className="popup-close" onClick={() => setShowMobileAuth(false)}>
              Close
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;