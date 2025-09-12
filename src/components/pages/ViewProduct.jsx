import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Breadcrumb, Form, Badge, Spinner, Alert } from 'react-bootstrap';

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: '',
    inStock: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all categories and find the one with matching ID
        const categoryResponse = await fetch('http://127.0.0.1:8000/api/category/');
        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoryData = await categoryResponse.json();
        const foundCategory = categoryData.find(cat => cat.id === parseInt(id));
        
        if (!foundCategory) {
          throw new Error('Category not found');
        }
        
        setCategory(foundCategory);
        
        // Fetch products for this category
        const productsResponse = await fetch('http://127.0.0.1:8000/api/products/');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        
        // Filter products by category
        const categoryProducts = productsData.filter(product => 
          product.category === parseInt(id)
        );
        
        setProducts(categoryProducts);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  
  const handleViewDetails = (productId) => {
    navigate(`/product/${id}/${productId}`);
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Price range filter
    const price = parseFloat(product.price);
    if (filters.priceRange === 'under1000' && price >= 1000) return false;
    if (filters.priceRange === '1000-2000' && (price < 1000 || price > 2000)) return false;
    if (filters.priceRange === 'over2000' && price <= 2000) return false;
    
    // In stock filter
    if (filters.inStock && (!product.stock || product.stock <= 0)) return false;
    
    return true;
  });

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
      <Spinner animation="border" role="status" variant="success">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
  
  if (error) return (
    <Container className="my-5">
      <Alert variant="danger" className="text-center">
        <Alert.Heading>Error Loading Product</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Alert>
    </Container>
  );
  
  if (!category) return <div className="text-center py-5">Category not found</div>;

  return (
    <div className="product-detail-page">
      {/* Hero Section */}
      <section 
        className="about-hero-section d-flex align-items-center text-white position-relative"
        style={{
          background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '500px'
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h1 className="fs-1 fw-bold mb-4">
                Farming Meets Technology – For Fresher, Safer Mushrooms.
              </h1>
              <p className="lead mb-4">
                From our farms to your table, we ensure sustainability, innovation, 
                and quality. Our farms are clean, safe, and full of nutrition and flavor.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <Container className="py-5">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }} className='color text-decoration-none'>Home</Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/products" }} className='color text-decoration-none'>Products</Breadcrumb.Item>
          <Breadcrumb.Item active>{category.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Row>
          {/* Filter Sidebar */}
          <Col md={3} className="mb-4">
            <Card className="border-0 shadow-sm filter-sidebar">
              <Card.Header className="bg-white border-bottom">
                <h5 className="mb-0 text-start fw-bold color">Filters</h5>
              </Card.Header>
              <Card.Body className="p-4">
                {/* Price Range Filter */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3 text-dark d-flex align-items-center">
                    Price Range
                  </h6>
                  <div className="d-flex flex-column gap-2 ps-3">
                    <Form.Check 
                      type="radio" 
                      id="under1000" 
                      label="Under ₹1000" 
                      name="priceRange" 
                      checked={filters.priceRange === 'under1000'}
                      onChange={() => setFilters({...filters, priceRange: 'under1000'})}
                      className="filter-option"
                    />
                    <Form.Check 
                      type="radio" 
                      id="1000-2000" 
                      label="₹1000 - ₹2000" 
                      name="priceRange" 
                      checked={filters.priceRange === '1000-2000'}
                      onChange={() => setFilters({...filters, priceRange: '1000-2000'})}
                      className="filter-option"
                    />
                    <Form.Check 
                      type="radio" 
                      id="over2000" 
                      label="Over ₹2000" 
                      name="priceRange" 
                      checked={filters.priceRange === 'over2000'}
                      onChange={() => setFilters({...filters, priceRange: 'over2000'})}
                      className="filter-option"
                    />
                  </div>
                </div>

                {/* Divider */}
                <hr className="my-4" />

                {/* Availability Filter */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3 text-dark d-flex align-items-center">
                    Availability
                  </h6>
                  <div className="ps-3">
                    <Form.Check 
                      type="checkbox" 
                      id="inStock" 
                      label="In Stock Only" 
                      checked={filters.inStock}
                      onChange={(e) => setFilters({...filters, inStock: e.target.checked})}
                      className="filter-option"
                    />
                  </div>
                </div>

                {/* Active Filters Indicator */}
                {(filters.priceRange || filters.inStock) && (
                  <>
                    <hr className="my-4" />
                    <div className="mb-3">
                      <h6 className="fw-semibold mb-2 text-dark">Active Filters:</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {filters.priceRange && (
                          <Badge bg="success" className="d-flex align-items-center">
                            {filters.priceRange === 'under1000' && 'Under ₹1000'}
                            {filters.priceRange === '1000-2000' && '₹1000-₹2000'}
                            {filters.priceRange === 'over2000' && 'Over ₹2000'}
                            <button 
                              type="button" 
                              className="btn-close btn-close-white ms-2" 
                              style={{ fontSize: '0.6rem' }}
                              onClick={() => setFilters({...filters, priceRange: ''})}
                              aria-label="Remove"
                            ></button>
                          </Badge>
                        )}
                        {filters.inStock && (
                          <Badge bg="success" className="d-flex align-items-center">
                            In Stock Only
                            <button 
                              type="button" 
                              className="btn-close btn-close-white ms-2" 
                              style={{ fontSize: '0.6rem' }}
                              onClick={() => setFilters({...filters, inStock: false})}
                              aria-label="Remove"
                            ></button>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </>
                )}

              </Card.Body>
            </Card>
          </Col>

          {/* Products Grid */}
          <Col md={9}>
            <div className="mb-4">
              <h2 className="fw-semibold text-dark mb-2">Our {category.name} Collection</h2>
              <hr />
              <p className="lead text-muted mb-4">{category.description || 'Explore our premium selection of mushroom products.'}</p>
            </div>
            
            <Row className="g-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Col key={product.id} md={6} lg={4}>
                    <Card 
                      className="h-100 border-0 shadow-sm product-card" 
                      style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
                      onClick={() => handleViewDetails(product.id)}
                    >
                      <div className="overflow-hidden position-relative" style={{ height: '200px' }}>
<Card.Img 
  variant="top" 
  src={product.image || product.images?.[0]?.image || 'https://via.placeholder.com/300x200/28a745/ffffff?text=Mushroom'} 
  alt={product.name}
  className="w-100 h-100"
  style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
/>
                        {(!product.stock || product.stock <= 0) && (
                          <Badge 
                            bg="danger" 
                            className="position-absolute top-0 end-0 m-2"
                            style={{ fontSize: '0.7rem' }}
                          >
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      <Card.Body className="d-flex flex-column p-3">
                        <Card.Title className="mb-2 fw-bold" style={{ fontSize: '1.1rem' }}>
                          {product.name}
                        </Card.Title>
                        <Card.Text className="text-muted small mb-3 flex-grow-1">
                          {product.description}
                        </Card.Text>
                        <div className="mt-auto d-flex justify-content-between align-items-center">
                          <span className="fw-bold text-muted fs-5">₹{product.price}</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>                
                ))
              ) : (
                <Col>
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <i className="fas fa-search fa-3x text-muted"></i>
                    </div>
                    <h4 className="text-muted mb-3">No products found</h4>
                    <p className="text-muted mb-4">Try adjusting your filters to see more products</p>
                    <Button 
                      variant="success" 
                      onClick={() => setFilters({ priceRange: '', inStock: false })}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Container>

      <Container className="my-5" style={{ backgroundColor: '#f1fff0', padding: '60px 0' }}>
        <Row className="align-items-center">
          <Col md={8} className="text-center text-md-center">
            <img src="../src/assets/leaf.png" className='leaf mb-3' alt="Leaf icon" />
            <h2 style={{ fontWeight: 'bold', color: '#006400' }}>
              Grow with Confidence
            </h2>
            <Button as={Link} to="/contact" className="button mt-3">
              We're Here to Help
            </Button>
          </Col>
          <Col md={4} className="text-start">
            <img
              src="../src/assets/mushroom.png"
              alt="Mushrooms"
              style={{ height: "200px", objectFit: 'cover' }}
            />
          </Col>
        </Row>
      </Container>

      {/* Add some custom CSS for better filter alignment */}
      <style jsx>{`
        .breadcrumb {
          background: none;
          padding: 0.5rem 0;
          margin-bottom: 1.5rem;
        }
        .breadcrumb-item a {
          color: #0B8001 !important;
          text-decoration: none !important;
          transition: color 0.2s ease;
        }
        .breadcrumb-item a:hover {
          color: #0a6e01 !important;
          text-decoration: underline !important;
        }
        .breadcrumb-item.active {
          color: #6c757d;
        }
        .breadcrumb-item + .breadcrumb-item::before {
          content: '›';
          padding: 0 0.5rem;
          color: #6c757d;
        }
        
        .filter-sidebar .form-check {
          padding-left: 0;
          margin-bottom: 0.5rem;
        }
        .filter-sidebar .form-check-input {
          margin-top: 0.2rem;
          margin-right: 0.5rem;
        }
        .filter-option {
          transition: all 0.2s ease;
        }
        .filter-option:hover {
          background-color: #f8f9fa;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          margin: -0.25rem -0.5rem;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default ViewProduct;