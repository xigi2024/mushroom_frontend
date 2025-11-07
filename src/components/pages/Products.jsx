import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/products.css';
import contactHeroImage from '/assets/contact.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';

const Products = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const [error, setError] = useState(null);
  const [imageLoadErrors, setImageLoadErrors] = useState({});

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://mycomatrix.in/api/category/');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleViewProduct = (categoryId) => {
    navigate(`/products/${categoryId}`);
  };

  const handleImageError = (categoryId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [categoryId]: true
    }));
  };

  const getImageSrc = (category) => {
    if (imageLoadErrors[category.id]) {
      return 'https://via.placeholder.com/300x200/28a745/ffffff?text=Mushroom+Category';
    }
    
    if (category.image && category.image.startsWith('http')) {
      return category.image;
    }
    
    if (category.image) {
      const baseUrl = 'https://mycomatrix.in';
      const imagePath = category.image.startsWith('/') ? category.image : `/${category.image}`;
      return `${baseUrl}${imagePath}`;
    }
    
    return 'https://via.placeholder.com/300x200/28a745/ffffff?text=Mushroom+Category';
  };

  if (loading) {
    return (
      <div className="products-container">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <Spinner animation="border" role="status" variant="success">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <Container className="my-5">
          <Alert variant="danger" className="text-center">
            <Alert.Heading>Error Loading Products</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }
  return (
    <div className="products-container">
      {/* Hero Section */}
      <div 
        className="hero-section"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${contactHeroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          padding: '100px 0',
          textAlign: 'center'
        }}
      >
        <div className="container">
          <h1 className="hero-title">Our Products</h1>
          <p className="hero-subtitle text-white">
            Discover our premium mushroom growing solutions - from beginner kits to advanced IoT systems.
          </p>
        </div>
      </div>
      {/* Products Section */}
      <section className="products-section">
  <Container>
  <nav aria-label="breadcrumb">
  <ol className="breadcrumb mb-4">
    <li className="breadcrumb-item">
      <a href="/" className="text-decoration-none fw-bold color">
        Home
      </a>
    </li>
    <li className="breadcrumb-item active fw-bold text-decoration-none color" aria-current="page">
      Products
    </li>
  </ol>
</nav>

    
    <h2 className="section-title text-center fw-bold mb-5">Our Mushroom Growing Solutions</h2>
    
    {categories.length > 0 ? (
      <Row className="g-4">
        {categories.map((category) => (
          <Col key={category.id} xs={12} sm={6} md={6} lg={4} xl={3}>            <Card 
              className="category-card h-100 border-0 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => handleViewProduct(category.id)}
            >
              <div className="card-image-containers position-relative">
                {!imageLoadErrors[category.id] && !loadedImages[category.id] && (
                  <div 
                    className="image-loading-placeholder position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light"
                    style={{ minHeight: '200px', zIndex: 1 }}
                  >
                    <Spinner animation="border" size="sm" variant="success" />
                  </div>
                )}
                
                <Card.Img
                  variant="top"
                  src={getImageSrc(category)}
                  alt={category.name}
                  className="category-image"
                  onLoad={(e) => {
                    setLoadedImages((prev) => ({
                      ...prev,
                      [category.id]: true
                    }));
                    e.target.style.opacity = 1;
                  }}
                  onError={() => handleImageError(category.id)}
                  data-category-id={category.id}
                  style={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                    opacity: loadedImages[category.id] ? 1 : 0,
                    transition: 'opacity 0.5s ease'
                  }}
                />
              </div>
              
              {/* Content Section - Updated structure */}
              <Card.Body className="d-flex flex-column p-3 ">
                {/* Title */}
                <Card.Title className="h4 fw-semibold mb-3 card-title h5" >
                  {category.name}
                </Card.Title>

                {/* Description */}
                {category.description && (
                <Card.Text className="para  flex-fill mb-3" >
                    {category.description}
                  </Card.Text>
                )}

                {/* Learn More button with icon */}
                <div 
                  className="d-flex align-items-center text-primary font-medium hover-text-primary transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FontAwesomeIcon 
                    icon={faLink} 
                    className="me-2 p-2 rounded link-icon bg-opacity-15 color" 
                    style={{ fontSize: '12px', width: '16px', height: '16px' }}
                  />                      
                  <span 
                    className="fs-6 fw-semibold color"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProduct(category.id);
                    }}
                  >
                    Learn More
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    ) : (
      <div className="text-center py-5">
        <h4 className="text-muted">No categories available</h4>
        <p className="text-muted">Please check back later for our product offerings.</p>
      </div>
    )}
  </Container>
</section>


      {/* middle cta section */}
      <Container className="my-5 py-5" style={{ backgroundColor: '#f1fff0' }}>
        <Row className="align-items-center text-center text-md-start">
          {/* ✅ Text + Button Section */}
          <Col className="mb-4 mb-md-0 text-center">
            <img src="/assets/leaf.png" className="leaf mb-3 object-fit-cover" alt="Leaf icon" style={{ width: "60px", height: "60px" }} />
            <h2 style={{ fontWeight: 'bold', color: '#006400' }}>
              Grow with Confidence
            </h2>
            <p className='mx-auto describes'>Discover our best-selling mushroom grow kits — easy to use, beginner-friendly, and 100% organic. Start your home cultivation journey today! Experience the joy of harvesting fresh mushrooms right from your kitchen.</p>
            <Button as={Link} to="/contact" className="button mt-3">
              We're Here to Help
            </Button>
          </Col>

      
        </Row>
      </Container>
    </div>
  );
};

export default Products;